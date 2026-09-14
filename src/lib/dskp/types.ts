export type StandardPembelajaran = {
  kod: string;
  pernyataan: string;
  butiran: string[];
};

export type StandardKandungan = {
  kod: string;
  tajuk: string;
  standard_pembelajaran: StandardPembelajaran[];
};

export type BidangPembelajaran = {
  kod: string;
  nama: string;
  penerangan: string | null;
  jam: number | null;
  standard_kandungan: StandardKandungan[];
};

export type DskpExtract = {
  mata_pelajaran: string;
  tingkatan: string;
  tahun_terbitan: string | null;
  bidang: BidangPembelajaran[];
  kaedah_analisis: "parser" | "ai";
  amaran?: string;
};

export type DokumenDskp = {
  id: string;
  nama_fail: string;
  mata_pelajaran: string | null;
  tingkatan: string | null;
  tahun_terbitan: string | null;
  storage_path: string | null;
  fail_hash: string | null;
  kaedah_analisis: string | null;
  status: string;
  ralat: string | null;
  created_at: string;
};

export type DokumenDskpWithTree = DokumenDskp & {
  bidang_pembelajaran: Array<{
    id: string;
    kod: string;
    nama: string;
    penerangan: string | null;
    jam: number | null;
    susunan: number;
    standard_kandungan: Array<{
      id: string;
      kod: string;
      tajuk: string;
      susunan: number;
      standard_pembelajaran: Array<{
        id: string;
        kod: string;
        pernyataan: string;
        butiran: string[] | null;
        susunan: number;
      }>;
    }>;
  }>;
};
