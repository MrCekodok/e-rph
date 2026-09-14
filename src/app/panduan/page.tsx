export default function PanduanPage() {
  return (
    <div className="prose prose-neutral max-w-2xl space-y-6 dark:prose-invert">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Panduan e-RPH DSKP</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sistem ini membaca PDF DSKP KSSM dan menyimpan tiga lapisan kurikulum ke Supabase.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-heading text-lg font-medium">Apa yang disimpan</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Bidang pembelajaran</strong> — contohnya Pengaturcaraan,
            Pangkalan Data
          </li>
          <li>
            <strong className="text-foreground">Standard kandungan</strong> — contohnya 1.1 Strategi
            Penyelesaian Masalah
          </li>
          <li>
            <strong className="text-foreground">Standard pembelajaran</strong> — contohnya 1.1.1
            Menerangkan keperluan penyelesaian masalah berstrategi
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-lg font-medium">Sambung Supabase</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Cipta projek di supabase.com</li>
          <li>
            Buka SQL Editor, tampal keseluruhan fail{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">supabase/schema.sql</code>, kemudian
            Run
          </li>
          <li>
            Salin URL dan kunci (anon + service role) ke{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>
          </li>
          <li>Mulakan semula <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run dev</code></li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-lg font-medium">Analisis PDF</h2>
        <p className="text-sm text-muted-foreground">
          Parser DSKP membaca kod 1.0 / 1.1 / 1.1.1 terus daripada teks PDF. Jika anda isi{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">GOOGLE_GENERATIVE_AI_API_KEY</code> atau{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">OPENAI_API_KEY</code>, sistem akan
          membetulkan lajur yang terpecah dengan AI.
        </p>
      </section>
    </div>
  );
}
