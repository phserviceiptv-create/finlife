-- FinLife core schema (reviewed design; apply after Supabase project is ready)
create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  moeda_padrao text not null default 'BRL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('receita','despesa')),
  icone text,
  created_at timestamptz not null default now(),
  unique(usuario_id,nome,tipo)
);

create table if not exists public.contas_financeiras (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('corrente','poupanca','carteira','cartao','investimento')),
  saldo_centavos bigint not null default 0,
  moeda text not null default 'BRL',
  created_at timestamptz not null default now()
);

create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  conta_id uuid not null references public.contas_financeiras(id) on delete restrict,
  categoria_id uuid references public.categorias(id) on delete set null,
  tipo text not null check (tipo in ('receita','despesa','transferencia')),
  valor_centavos bigint not null check (valor_centavos > 0),
  descricao text,
  data_transacao date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  limite_centavos bigint not null check (limite_centavos >= 0),
  mes date not null,
  created_at timestamptz not null default now(),
  unique(usuario_id,categoria_id,mes)
);

create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  nome text not null,
  alvo_centavos bigint not null check (alvo_centavos > 0),
  atual_centavos bigint not null default 0 check (atual_centavos >= 0),
  prazo date,
  created_at timestamptz not null default now()
);

alter table public.usuarios enable row level security;
alter table public.categorias enable row level security;
alter table public.contas_financeiras enable row level security;
alter table public.transacoes enable row level security;
alter table public.orcamentos enable row level security;
alter table public.metas enable row level security;

create policy "usuarios_owner" on public.usuarios for all to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "categorias_owner" on public.categorias for all to authenticated
using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "contas_owner" on public.contas_financeiras for all to authenticated
using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "transacoes_owner" on public.transacoes for all to authenticated
using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "orcamentos_owner" on public.orcamentos for all to authenticated
using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "metas_owner" on public.metas for all to authenticated
using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
