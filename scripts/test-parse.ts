import { readFile } from "node:fs/promises";
import { extractPdfText } from "../src/lib/dskp/extract-pdf";
import { parseDskpText, ringkasanExtract } from "../src/lib/dskp/parse";

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Guna: npx tsx scripts/test-parse.ts <fail.pdf>");
    process.exit(1);
  }

  const bytes = new Uint8Array(await readFile(pdfPath));
  const { text, jumlahMukaSurat } = await extractPdfText(bytes);
  const extract = parseDskpText(text);
  const ringkasan = ringkasanExtract(extract);

  console.log(
    JSON.stringify(
      {
        mukaSurat: jumlahMukaSurat,
        ...ringkasan,
        mata_pelajaran: extract.mata_pelajaran,
        tingkatan: extract.tingkatan,
        tahun_terbitan: extract.tahun_terbitan,
        jam: extract.bidang.map((bidang) => ({ kod: bidang.kod, jam: bidang.jam })),
        sampel: extract.bidang[0]?.standard_kandungan[0],
        bidang: extract.bidang.map((bidang) => ({
          kod: bidang.kod,
          nama: bidang.nama,
          jam: bidang.jam,
          sk: bidang.standard_kandungan.map((sk) => ({
            kod: sk.kod,
            tajuk: sk.tajuk,
            sp: sk.standard_pembelajaran.map((sp) => sp.kod),
          })),
        })),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
