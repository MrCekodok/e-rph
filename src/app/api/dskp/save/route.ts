import { NextResponse } from "next/server";
import { dskpExtractSchema } from "@/lib/dskp/schema";
import { simpanDskp } from "@/lib/dskp/save";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { DskpExtract } from "@/lib/dskp/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ralat: "Supabase belum dikonfigurasi. Isi .env.local dan jalankan supabase/schema.sql." },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const payloadRaw = form.get("payload");
    if (!(file instanceof File) || typeof payloadRaw !== "string") {
      return NextResponse.json({ ralat: "Fail dan hasil analisis diperlukan." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ralat: "Fail melebihi 15 MB." }, { status: 400 });
    }

    const parsedJson = JSON.parse(payloadRaw);
    const extractParsed = dskpExtractSchema.parse(parsedJson);
    const extract: DskpExtract = {
      ...extractParsed,
      kaedah_analisis: parsedJson.kaedah_analisis === "ai" ? "ai" : "parser",
      amaran: parsedJson.amaran,
    };

    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const result = await simpanDskp({
      extract,
      namaFail: file.name,
      pdfBytes,
    });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    const mesej = error instanceof Error ? error.message : "Gagal menyimpan DSKP.";
    return NextResponse.json({ ralat: mesej }, { status: 500 });
  }
}
