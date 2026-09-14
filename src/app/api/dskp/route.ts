import { NextResponse } from "next/server";
import { senaraiDokumen } from "@/lib/dskp/queries";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ dikonfigurasi: false, dokumen: [] });
  }
  try {
    const dokumen = await senaraiDokumen();
    return NextResponse.json({ dikonfigurasi: true, dokumen });
  } catch (error) {
    const mesej = error instanceof Error ? error.message : "Gagal memuatkan senarai.";
    return NextResponse.json({ ralat: mesej }, { status: 500 });
  }
}
