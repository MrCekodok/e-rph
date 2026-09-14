import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <h1 className="font-heading text-2xl font-semibold">DSKP tidak dijumpai</h1>
      <p className="mt-2 text-sm text-muted-foreground">Rekod ini tiada dalam pangkalan data.</p>
      <Button asChild className="mt-4">
        <Link href="/">Kembali ke senarai</Link>
      </Button>
    </div>
  );
}
