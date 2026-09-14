# e-RPH · DSKP

Aplikasi untuk memuat naik PDF DSKP KSSM, menganalisis kandungannya, dan menyimpan tiga lapisan kurikulum ke Supabase:

1. **Bidang pembelajaran**
2. **Standard kandungan**
3. **Standard pembelajaran**

## Setup

```bash
cp .env.example .env.local
npm run dev
```

1. Cipta projek Supabase.
2. Jalankan `supabase/schema.sql` dalam SQL Editor.
3. Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` dalam `.env.local`.
4. (Pilihan) Isi `GOOGLE_GENERATIVE_AI_API_KEY` atau `OPENAI_API_KEY` untuk analisis AI.

Buka [http://localhost:3000](http://localhost:3000), kemudian muat naik PDF DSKP.
