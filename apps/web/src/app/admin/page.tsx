'use client';

import Link from 'next/link';

const links = [
  { href: '/admin/agents', label: 'Atendentes' },
  { href: '/admin/clients', label: 'Clientes' },
  { href: '/admin/routing', label: 'Roteamento Níveis' }
];

export default function AdminHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 bg-slate-50 p-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-slate-900">Administração</h1>
        <p className="text-sm text-slate-500">Configure usuários, clientes e regras do atendimento.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400"
          >
            <span className="text-lg font-medium text-slate-800">{link.label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
