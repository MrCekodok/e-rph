import { z } from "zod";

export const standardPembelajaranSchema = z.object({
  kod: z.string().describe("Kod seperti 1.1.1"),
  pernyataan: z.string().describe("Ayat standard pembelajaran tanpa nombor rumawi"),
  butiran: z
    .array(z.string())
    .default([])
    .describe("Sub-item (i), (ii), (iii) jika ada"),
});

export const standardKandunganSchema = z.object({
  kod: z.string().describe("Kod seperti 1.1"),
  tajuk: z.string(),
  standard_pembelajaran: z.array(standardPembelajaranSchema),
});

export const bidangPembelajaranSchema = z.object({
  kod: z.string().describe("Kod seperti 1.0"),
  nama: z.string(),
  penerangan: z.string().nullable(),
  jam: z.number().nullable(),
  standard_kandungan: z.array(standardKandunganSchema),
});

export const dskpExtractSchema = z.object({
  mata_pelajaran: z.string(),
  tingkatan: z.string(),
  tahun_terbitan: z.string().nullable(),
  bidang: z.array(bidangPembelajaranSchema),
});

export type DskpExtractSchema = z.infer<typeof dskpExtractSchema>;
