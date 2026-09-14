-- e-RPH: skema DSKP KSSM
-- Jalankan dalam SQL Editor projek Supabase.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Jadual
-- ---------------------------------------------------------------------------

create table if not exists public.dokumen_dskp (
  id uuid primary key default gen_random_uuid(),
  nama_fail text not null,
  mata_pelajaran text,
  tingkatan text,
  tahun_terbitan text,
  storage_path text,
  fail_hash text,
  kaedah_analisis text,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  ralat text,
  created_at timestamptz not null default now()
);

create table if not exists public.bidang_pembelajaran (
  id uuid primary key default gen_random_uuid(),
  dskp_id uuid not null references public.dokumen_dskp(id) on delete cascade,
  kod text not null,
  nama text not null,
  penerangan text,
  jam numeric,
  susunan integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.standard_kandungan (
  id uuid primary key default gen_random_uuid(),
  bidang_id uuid not null references public.bidang_pembelajaran(id) on delete cascade,
  kod text not null,
  tajuk text not null,
  susunan integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.standard_pembelajaran (
  id uuid primary key default gen_random_uuid(),
  sk_id uuid not null references public.standard_kandungan(id) on delete cascade,
  kod text not null,
  pernyataan text not null,
  butiran jsonb not null default '[]'::jsonb,
  susunan integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists bidang_dskp_idx on public.bidang_pembelajaran (dskp_id, susunan);
create index if not exists sk_bidang_idx on public.standard_kandungan (bidang_id, susunan);
create index if not exists sp_sk_idx on public.standard_pembelajaran (sk_id, susunan);
create index if not exists dokumen_created_idx on public.dokumen_dskp (created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: bacaan awam, penulisan melalui service role / fungsi
-- ---------------------------------------------------------------------------

alter table public.dokumen_dskp enable row level security;
alter table public.bidang_pembelajaran enable row level security;
alter table public.standard_kandungan enable row level security;
alter table public.standard_pembelajaran enable row level security;

drop policy if exists "baca dokumen dskp" on public.dokumen_dskp;
create policy "baca dokumen dskp" on public.dokumen_dskp for select using (true);

drop policy if exists "baca bidang" on public.bidang_pembelajaran;
create policy "baca bidang" on public.bidang_pembelajaran for select using (true);

drop policy if exists "baca standard kandungan" on public.standard_kandungan;
create policy "baca standard kandungan" on public.standard_kandungan for select using (true);

drop policy if exists "baca standard pembelajaran" on public.standard_pembelajaran;
create policy "baca standard pembelajaran" on public.standard_pembelajaran for select using (true);

-- ---------------------------------------------------------------------------
-- Simpan keseluruhan DSKP dalam satu transaksi
-- ---------------------------------------------------------------------------

create or replace function public.simpan_dskp(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doc_id uuid;
  v_bidang jsonb;
  v_sk jsonb;
  v_sp jsonb;
  v_bidang_id uuid;
  v_sk_id uuid;
  v_b_idx int := 0;
  v_s_idx int := 0;
  v_p_idx int := 0;
  v_jam numeric;
begin
  insert into public.dokumen_dskp (
    nama_fail,
    mata_pelajaran,
    tingkatan,
    tahun_terbitan,
    storage_path,
    fail_hash,
    kaedah_analisis,
    status
  ) values (
    payload->>'nama_fail',
    nullif(payload->>'mata_pelajaran', ''),
    nullif(payload->>'tingkatan', ''),
    nullif(payload->>'tahun_terbitan', ''),
    nullif(payload->>'storage_path', ''),
    nullif(payload->>'fail_hash', ''),
    nullif(payload->>'kaedah_analisis', ''),
    'completed'
  ) returning id into v_doc_id;

  for v_bidang in select value from jsonb_array_elements(coalesce(payload->'bidang', '[]'::jsonb))
  loop
    if jsonb_typeof(v_bidang->'jam') = 'number' then
      v_jam := (v_bidang->>'jam')::numeric;
    elsif coalesce(v_bidang->>'jam', '') ~ '^[0-9]+(\.[0-9]+)?$' then
      v_jam := (v_bidang->>'jam')::numeric;
    else
      v_jam := null;
    end if;

    insert into public.bidang_pembelajaran (dskp_id, kod, nama, penerangan, jam, susunan)
    values (
      v_doc_id,
      coalesce(v_bidang->>'kod', ''),
      coalesce(v_bidang->>'nama', 'Tidak bernama'),
      nullif(v_bidang->>'penerangan', ''),
      v_jam,
      v_b_idx
    ) returning id into v_bidang_id;

    v_b_idx := v_b_idx + 1;
    v_s_idx := 0;

    for v_sk in select value from jsonb_array_elements(coalesce(v_bidang->'standard_kandungan', '[]'::jsonb))
    loop
      insert into public.standard_kandungan (bidang_id, kod, tajuk, susunan)
      values (
        v_bidang_id,
        coalesce(v_sk->>'kod', ''),
        coalesce(v_sk->>'tajuk', 'Tidak bertajuk'),
        v_s_idx
      ) returning id into v_sk_id;

      v_s_idx := v_s_idx + 1;
      v_p_idx := 0;

      for v_sp in select value from jsonb_array_elements(coalesce(v_sk->'standard_pembelajaran', '[]'::jsonb))
      loop
        insert into public.standard_pembelajaran (sk_id, kod, pernyataan, butiran, susunan)
        values (
          v_sk_id,
          coalesce(v_sp->>'kod', ''),
          coalesce(v_sp->>'pernyataan', ''),
          coalesce(v_sp->'butiran', '[]'::jsonb),
          v_p_idx
        );
        v_p_idx := v_p_idx + 1;
      end loop;
    end loop;
  end loop;

  return v_doc_id;
end;
$$;

revoke all on function public.simpan_dskp(jsonb) from public;
grant execute on function public.simpan_dskp(jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- Storage: bucket fail PDF
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('dskp-pdf', 'dskp-pdf', false)
on conflict (id) do nothing;
