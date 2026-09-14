import { NextResponse } from "next/server";
import { analyzeDskp, hasAiProvider } from "@/lib/dskp/analyze";
import { extractPdfText } from "@/lib/dskp/extract-pdf";
import { ringkasanExtract } from "@/lib/dskp/parse";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ralat: "Sila muat naik fail PDF." }, { status: 400 });
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ ralat: "Fail mestilah PDF DSKP." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ralat: "Fail melebihi 15 MB." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(buffer);
    const { text, jumlahMukaSurat } = await extractPdfText(pdfBytes);
    if (!text.trim()) {
      return NextResponse.json(
        { ralat: "Teks PDF tidak dapat dibaca. Cuba fail DSKP rasmi KPM." },
        { status: 422 }
      );
    }

    const extract = await analyzeDskp({ text, pdfBytes });
    const ringkasan = ringkasanExtract(extract);

    return NextResponse.json({
      extract,
      ringkasan,
      jumlahMukaSurat,
      menggunakanAi: hasAiProvider() && extract.kaedah_analisis === "ai",
    });
  } catch (error) {
    const mesej = error instanceof Error ? error.message : "Analisis gagal.";
    return NextResponse.json({ ralat: mesej }, { status: 500 });
  }
}
