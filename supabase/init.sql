-- Supabase SQL schema for a trading platform with KYC, wallets, and RLS
-- Modified to use UPSERT (INSERT ... ON CONFLICT DO UPDATE) to handle existing profiles

create extension if not exists "pgcrypto";

-- =========================
-- PROFILES
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  phone text unique,
  full_name text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- =========================
-- COINS / ASSETS
-- =========================
create table if not exists public.coins (
  id uuid primary key default gen_random_uuid(),
  symbol text unique not null,
  name text not null,
  decimals int default 8,
  is_active boolean default true
);

insert into public.coins (symbol, name) values
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('USDT', 'Tether')
on conflict (symbol) do nothing;

-- =========================
-- WALLETS
-- =========================
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id)
);

create table if not exists public.wallet_balances (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references public.wallets(id) on delete cascade,
  coin_id uuid references public.coins(id),
  available_balance numeric(30, 10) default 0,
  locked_balance numeric(30, 10) default 0,
  unique (wallet_id, coin_id)
);

-- =========================
-- KYC SUBMISSIONS
-- =========================
create table if not exists public.kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_type text not null,
  document_number text not null,
  front_url text,
  back_url text,
  selfie_url text,
  status text default 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- =========================
-- TRANSACTIONS (DEPOSIT / WITHDRAW)
-- =========================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  coin_id uuid references public.coins(id),
  type text not null, -- deposit, withdraw
  amount numeric(30, 10) not null,
  tx_hash text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- =========================
-- TRADE HISTORY
-- =========================
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  base_coin_id uuid references public.coins(id),
  quote_coin_id uuid references public.coins(id),
  side text not null, -- buy, sell
  price numeric(30, 10) not null,
  quantity numeric(30, 10) not null,
  fee numeric(30, 10) default 0,
  created_at timestamptz default now()
);

-- =========================
-- WITHDRAW REQUESTS
-- =========================
create table if not exists public.withdraw_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  coin_id uuid references public.coins(id),
  amount numeric(30, 10) not null,
  address text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- =========================
-- CREATE / UPDATE PROFILE ONLY AFTER EMAIL CONFIRMATION
-- =========================
create or replace function public.handle_email_confirmed()
returns trigger as $$
begin
  -- Only act when email_confirmed_at becomes non-null
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then

    -- UPSERT profile (insert or update if exists)
    insert into public.profiles (id, email, phone, full_name)
    values (
      new.id,
      new.email,
      coalesce(new.user_metadata->>'phone', new.phone),
      new.user_metadata->>'full_name'
    )
    on conflict (id) do update set
      email = excluded.email,
      phone = excluded.phone,
      full_name = excluded.full_name;

    -- UPSERT wallet
    insert into public.wallets (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger on update of auth.users (email confirmation happens via update)
drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update on auth.users
  for each row
  execute procedure public.handle_email_confirmed();

-- =========================
-- ROW LEVEL SECURITY
-- =========================
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.kyc_submissions enable row level security;
alter table public.transactions enable row level security;
alter table public.trades enable row level security;
alter table public.withdraw_requests enable row level security;

-- Profiles
create policy if not exists "Users manage own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Wallets
create policy if not exists "Users access own wallet"
  on public.wallets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Wallet balances
create policy if not exists "Users access own balances"
  on public.wallet_balances
  for all
  using (
    exists (
      select 1 from public.wallets w
      where w.id = wallet_balances.wallet_id
      and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.wallets w
      where w.id = wallet_balances.wallet_id
      and w.user_id = auth.uid()
    )
  );

-- KYC
create policy if not exists "Users manage own KYC"
  on public.kyc_submissions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Transactions
create policy if not exists "Users manage own transactions"
  on public.transactions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trades
create policy if not exists "Users manage own trades"
  on public.trades
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Withdraws
create policy if not exists "Users manage own withdraws"
  on public.withdraw_requests
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================
-- ADMIN KYC REVIEW POLICY
-- =========================
create policy if not exists "Admins can review KYC"
  on public.kyc_submissions
  for select
  using (
    auth.jwt() ->> 'role' = 'admin'
  );

-- =========================
-- STORAGE BUCKET (MANUAL STEP)
-- =========================
-- Create a private bucket named: kyc-documents
-- Use storage RLS so only owner and admins can read files