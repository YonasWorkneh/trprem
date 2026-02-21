-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.app_settings (
  id boolean NOT NULL DEFAULT true CHECK (id = true),
  access_granted boolean NOT NULL DEFAULT true,
  CONSTRAINT app_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.crypto_deposit_addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  currency text NOT NULL,
  network text NOT NULL,
  network_symbol text,
  address text NOT NULL,
  qr_code_url text,
  min_deposit numeric DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crypto_deposit_addresses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.crypto_deposits (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  deposit_code text,
  currency text NOT NULL,
  deposit_address text NOT NULL,
  transaction_hash text NOT NULL UNIQUE,
  user_reported_amount numeric,
  admin_verified_amount numeric,
  amount numeric NOT NULL,
  amount_usd numeric,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'reported'::text, 'confirmed'::text, 'credited'::text, 'rejected'::text])),
  confirmations integer DEFAULT 0,
  blockchain_explorer_url text,
  screenshot_url text,
  notes text,
  verification_notes text,
  verified_by uuid,
  reported_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone,
  credited_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crypto_deposits_pkey PRIMARY KEY (id),
  CONSTRAINT crypto_deposits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT crypto_deposits_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id)
);
CREATE TABLE public.kyc_submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  date_of_birth date,
  nationality text,
  address_line text,
  city text,
  zip_code text,
  country text,
  id_type text CHECK (id_type = ANY (ARRAY['passport'::text, 'national_id'::text, 'drivers_license'::text])),
  id_number text,
  id_front_url text NOT NULL,
  id_back_url text,
  selfie_url text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'approved'::text])),
  rejection_reason text,
  reviewed_by uuid,
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT kyc_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT kyc_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id),
  CONSTRAINT kyc_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info'::text,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  asset_id text NOT NULL,
  asset_name text,
  type text CHECK (type = ANY (ARRAY['market'::text, 'limit'::text])),
  side text CHECK (side = ANY (ARRAY['buy'::text, 'sell'::text])),
  price numeric NOT NULL,
  amount numeric NOT NULL,
  total numeric NOT NULL,
  status text DEFAULT 'open'::text CHECK (status = ANY (ARRAY['open'::text, 'filled'::text, 'cancelled'::text])),
  is_demo boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.portfolio (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  asset text NOT NULL,
  total_quantity numeric DEFAULT 0,
  average_price numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  is_demo boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT portfolio_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.support_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  image_url text,
  is_admin_reply boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_messages_pkey PRIMARY KEY (id),
  CONSTRAINT support_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id),
  CONSTRAINT support_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  page_context text,
  status text DEFAULT 'open'::text CHECK (status = ANY (ARRAY['open'::text, 'pending'::text, 'in_progress'::text, 'resolved'::text, 'closed'::text])),
  priority text DEFAULT 'normal'::text CHECK (priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_trading_enabled boolean DEFAULT true,
  contract_outcome_mode text DEFAULT 'fair'::text CHECK (contract_outcome_mode = ANY (ARRAY['fair'::text, 'always_win'::text, 'always_loss'::text])),
  withdrawal_enabled boolean DEFAULT true,
  min_deposit_amount numeric DEFAULT 10,
  min_withdrawal_amount numeric DEFAULT 20,
  maintenance_mode boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  CONSTRAINT system_settings_pkey PRIMARY KEY (id),
  CONSTRAINT system_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id)
);
CREATE TABLE public.trades (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  asset text NOT NULL,
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  type text CHECK (type = ANY (ARRAY['buy'::text, 'sell'::text])),
  is_demo boolean DEFAULT false,
  timestamp timestamp with time zone DEFAULT now(),
  exit_price numeric,
  payout numeric,
  profit numeric,
  status text CHECK (status = ANY (ARRAY['open'::text, 'win'::text, 'loss'::text, 'tie'::text])),
  open_time timestamp with time zone,
  close_time timestamp with time zone,
  contract_data jsonb,
  p_l real DEFAULT 0,
  cycle integer DEFAULT 60,
  CONSTRAINT trades_pkey PRIMARY KEY (id),
  CONSTRAINT trades_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.usdt_wallets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  address text NOT NULL,
  network text DEFAULT 'TRC20'::text,
  balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT usdt_wallets_pkey PRIMARY KEY (id),
  CONSTRAINT usdt_wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  avatar_url text,
  phone text,
  kyc_status text DEFAULT 'not_started'::text CHECK (kyc_status = ANY (ARRAY['not_started'::text, 'pending'::text, 'verified'::text, 'rejected'::text])),
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text])),
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  trading_balance numeric DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.wallet_transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  wallet_address text,
  to_address text,
  from_address text,
  transaction_hash text,
  type text CHECK (type = ANY (ARRAY['send'::text, 'receive'::text, 'deposit'::text, 'withdrawal'::text, 'trade_pnl'::text, 'admin_adjustment'::text])),
  amount numeric NOT NULL,
  asset text DEFAULT 'USDT'::text,
  network text,
  status text DEFAULT 'pending'::text,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.withdrawals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  fee numeric DEFAULT 0,
  final_amount numeric DEFAULT (amount - fee),
  currency text DEFAULT 'USDT'::text,
  network text,
  address text NOT NULL,
  transaction_hash text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'approved'::text, 'completed'::text, 'rejected'::text, 'failed'::text])),
  rejection_reason text,
  processed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT withdrawals_pkey PRIMARY KEY (id),
  CONSTRAINT withdrawals_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id),
  CONSTRAINT withdrawals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);