import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mata_pelajaran: [] });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("mata_pelajaran")
      .select("id, nama")
      .order("nama", { ascending: true });

    if (error) throw new Error(error.message);
    return NextResponse.json({ mata_pelajaran: data ?? [] });
  } catch (error) {
    const mesej = error instanceof Error ? error.message : "Gagal memuatkan mata pelajaran.";
    return NextResponse.json({ ralat: mesej }, { status: 500 });
  }
}
