-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Invoices Table
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text unique not null,
  customer_name text not null,
  invoice_type_id int not null,
  invoice_type_name text not null,
  bank_group text check (bank_group in ('A', 'B')),
  is_fee boolean default false,
  invoice_date date not null,
  period_start date,
  period_end date,
  total_amount numeric default 0,
  dp numeric default 0,
  grand_total numeric default 0,
  terbilang text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text default 'DRAFT'
);

-- 2. Invoice Items Table
create table if not exists invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  row_number int not null,
  date date,
  consignee text,
  vehicle_number text,
  container_number text,
  destination text,
  depo text,
  status text,
  size text,
  pickup_location text,
  price numeric default 0,
  gate_pass numeric default 0,
  lift_off numeric default 0,
  bongkar numeric default 0,
  cleaning numeric default 0,
  stuffing numeric default 0,
  storage numeric default 0,
  demurrage numeric default 0,
  seal numeric default 0,
  others numeric default 0,
  created_at timestamptz default now()
);

-- 3. Invoice Counter Table (for Auto-Increment)
create table if not exists invoice_counters (
  year int not null,
  month int not null,
  last_sequence int default 0,
  primary key (year, month)
);

-- Indexes
create index if not exists idx_invoices_date on invoices(invoice_date);
create index if not exists idx_invoices_customer on invoices(customer_name);
create index if not exists idx_items_invoice_id on invoice_items(invoice_id);

-- 4. Function to Generate Invoice Number
-- Format: INV/TML/IMP/{Year}/{RomanMonth}/{Sequence}
create or replace function generate_invoice_number(p_date date)
returns text
language plpgsql
as $$
declare
  v_year int;
  v_month int;
  v_roman text;
  v_seq int;
  v_result text;
begin
  v_year := extract(year from p_date);
  v_month := extract(month from p_date);
  
  -- Roman Numeral Conversion
  v_roman := case v_month
    when 1 then 'I' when 2 then 'II' when 3 then 'III' when 4 then 'IV'
    when 5 then 'V' when 6 then 'VI' when 7 then 'VII' when 8 then 'VIII'
    when 9 then 'IX' when 10 then 'X' when 11 then 'XI' when 12 then 'XII'
  end;

  -- Upsert Counter
  insert into invoice_counters (year, month, last_sequence)
  values (v_year, v_month, 0)
  on conflict (year, month) do nothing;

  -- Increment sequence atomically
  update invoice_counters
  set last_sequence = last_sequence + 1
  where year = v_year and month = v_month
  returning last_sequence into v_seq;

  -- Format: INV/TML/IMP/2026/II/001
  v_result := 'INV/TML/IMP/' || v_year || '/' || v_roman || '/' || lpad(v_seq::text, 3, '0');
  
  return v_result;
end;
$$;

-- 5. RLS Policies
alter table invoices enable row level security;
alter table invoice_items enable row level security;

-- Allow Authenticated Users to ALL operations (Internal Tool)
create policy "Enable all for authenticated users" on invoices
  for all using (auth.role() = 'authenticated');

create policy "Enable all for authenticated users" on invoice_items
  for all using (auth.role() = 'authenticated');

-- Also allow public read for now if auth is not strictly enforced in Phase 1
-- (Optional: remove this if strict auth is preferred)
create policy "Enable read for public" on invoices for select using (true);
create policy "Enable read for public" on invoice_items for select using (true);
