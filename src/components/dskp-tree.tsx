import { Badge } from "@/components/ui/badge";
import type { BidangPembelajaran } from "@/lib/dskp/types";

type TreeBidang = {
  kod: string;
  nama: string;
  penerangan?: string | null;
  jam?: number | null;
  standard_kandungan: Array<{
    kod: string;
    tajuk: string;
    standard_pembelajaran: Array<{
      kod: string;
      pernyataan: string;
      butiran?: string[] | null;
    }>;
  }>;
};

export function DskpTree({ bidang }: { bidang: TreeBidang[] | BidangPembelajaran[] }) {
  if (bidang.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Tiada bidang pembelajaran dikesan. Semak fail PDF DSKP.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bidang.map((item) => (
        <details key={item.kod} open className="rounded-xl border bg-card">
          <summary className="cursor-pointer list-none px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Bidang pembelajaran
                </p>
                <h3 className="font-heading text-base font-medium">
                  {item.kod} {item.nama}
                </h3>
              </div>
              <div className="flex gap-2">
                {item.jam != null ? <Badge variant="secondary">{item.jam} jam</Badge> : null}
                <Badge variant="outline">{item.standard_kandungan.length} SK</Badge>
              </div>
            </div>
            {item.penerangan ? (
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{item.penerangan}</p>
            ) : null}
          </summary>
          <div className="border-t">
            {item.standard_kandungan.map((sk) => (
              <div key={sk.kod} className="border-b px-4 py-4 last:border-b-0">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Standard kandungan
                </p>
                <h4 className="mt-1 font-medium">
                  {sk.kod} {sk.tajuk}
                </h4>
                <ol className="mt-3 space-y-3">
                  {sk.standard_pembelajaran.map((sp) => (
                    <li key={sp.kod} className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-sm">
                        <span className="font-mono text-xs text-primary">{sp.kod}</span>{" "}
                        {sp.pernyataan}
                      </p>
                      {sp.butiran && sp.butiran.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {sp.butiran.map((butiran) => (
                            <li key={butiran}>{butiran}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
