import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DskpExtract } from "./types";

const BUCKET = "dskp-pdf";

export function hashFail(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function simpanDskp(params: {
  extract: DskpExtract;
  namaFail: string;
  pdfBytes: Uint8Array;
}) {
  const supabase = createAdminClient();
  const failHash = hashFail(params.pdfBytes);
  const storagePath = `${crypto.randomUUID()}/${params.namaFail.replace(/[^\w.\- ()]/g, "_")}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, params.pdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Gagal muat naik PDF: ${uploadError.message}`);
  }

  const payload = {
    nama_fail: params.namaFail,
    mata_pelajaran: params.extract.mata_pelajaran,
    tingkatan: params.extract.tingkatan,
    tahun_terbitan: params.extract.tahun_terbitan,
    storage_path: storagePath,
    fail_hash: failHash,
    kaedah_analisis: params.extract.kaedah_analisis,
    bidang: params.extract.bidang,
  };

  const { data, error } = await supabase.rpc("simpan_dskp", { payload });

  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Gagal simpan ke pangkalan data: ${error.message}`);
  }

  return { id: data as string, failHash };
}
