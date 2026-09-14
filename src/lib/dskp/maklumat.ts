export const TINGKATAN = [
  "Tingkatan 1",
  "Tingkatan 2",
  "Tingkatan 3",
  "Tingkatan 4",
  "Tingkatan 5",
] as const;

export function normaliseNama(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function sahkanMaklumatDskp(mataPelajaran: string, tingkatan: string) {
  const nama = normaliseNama(mataPelajaran);
  const tahap = normaliseNama(tingkatan);
  if (!nama) {
    return { ralat: "Sila masukkan mata pelajaran." as const };
  }
  if (!tahap) {
    return { ralat: "Sila pilih tingkatan." as const };
  }
  return { nama, tahap };
}
