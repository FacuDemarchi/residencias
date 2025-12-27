-- Crear tabla (si no existe) para evitar errores 400 por columnas faltantes
create table if not exists public.pagotic_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  publication_id text not null,
  amount numeric not null,
  currency text not null,
  status text not null check (status in ('pending','completed','failed','cancelled')),
  payment_url text,
  reference text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pagotic_tx_updated_at on public.pagotic_transactions;
create trigger trg_pagotic_tx_updated_at
before update on public.pagotic_transactions
for each row execute function public.set_updated_at();

-- Habilitar RLS
alter table public.pagotic_transactions enable row level security;

-- Políticas:
-- 1) Lectura propia para usuarios autenticados
drop policy if exists "read_own_transactions" on public.pagotic_transactions;
create policy "read_own_transactions" on public.pagotic_transactions
for select
to authenticated
using (user_id = auth.uid());

-- 2) Sin inserción/actualización por usuarios normales (Edge Functions usan service role que ignora RLS)
drop policy if exists "deny_write_authenticated" on public.pagotic_transactions;
create policy "deny_write_authenticated" on public.pagotic_transactions
for all
to authenticated
using (false)
with check (false);

-- Nota: Las funciones Edge usan SUPABASE_SERVICE_ROLE_KEY, que bypass RLS, por lo que no se requieren políticas adicionales.

