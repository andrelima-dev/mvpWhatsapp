import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-100">
      <section className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold text-slate-900">WhatsApp Support MVP</h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Painel de atendimento multiusuário com roteamento N1/N2/N3, integração com a API de
          WhatsApp e gestão de conversas para times de suporte.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-center text-white shadow hover:bg-slate-700"
            href="/login"
          >
            Acessar painel
          </Link>
          <Link
            className="rounded-md border border-slate-200 px-4 py-2 text-center text-slate-700 hover:border-slate-400"
            href="/admin"
          >
            Administração
          </Link>
        </div>
      </section>
    </main>
  );
}
