import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DskpTree } from "@/components/dskp-tree";
import { getDokumen } from "@/lib/dskp/queries";

export default async function DskpDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dokumen = await getDokumen(id);
  if (!dokumen) notFound();

  const tree = dokumen.bidang_pembelajaran.map((bidang) => ({
    kod: bidang.kod,
    nama: bidang.nama,
    penerangan: bidang.penerangan,
    jam: bidang.jam,
    standard_kandungan: bidang.standard_kandungan.map((sk) => ({
      kod: sk.kod,
      tajuk: sk.tajuk,
      standard_pembelajaran: sk.standard_pembelajaran.map((sp) => ({
        kod: sp.kod,
        pernyataan: sp.pernyataan,
        butiran: Array.isArray(sp.butiran) ? sp.butiran : [],
      })),
    })),
  }));

  const bilSk = tree.reduce((sum, bidang) => sum + bidang.standard_kandungan.length, 0);
  const bilSp = tree.reduce(
    (sum, bidang) =>
      sum + bidang.standard_kandungan.reduce((inner, sk) => inner + sk.standard_pembelajaran.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">
          <ArrowLeft />
          Senarai DSKP
        </Link>
      </Button>
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {dokumen.mata_pelajaran ?? "DSKP"} {dokumen.tingkatan ? `· ${dokumen.tingkatan}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{dokumen.nama_fail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{tree.length} bidang</Badge>
          <Badge variant="secondary">{bilSk} SK</Badge>
          <Badge variant="secondary">{bilSp} SP</Badge>
          {dokumen.tahun_terbitan ? <Badge variant="outline">{dokumen.tahun_terbitan}</Badge> : null}
          {dokumen.kaedah_analisis ? <Badge variant="outline">{dokumen.kaedah_analisis}</Badge> : null}
        </div>
      </div>
      <DskpTree bidang={tree} />
    </div>
  );
}
