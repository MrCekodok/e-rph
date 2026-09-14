import { extractText } from "unpdf";

export async function extractPdfText(data: ArrayBuffer | Uint8Array) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const { text, totalPages } = await extractText(bytes, { mergePages: true });
  return {
    text,
    jumlahMukaSurat: totalPages,
  };
}
