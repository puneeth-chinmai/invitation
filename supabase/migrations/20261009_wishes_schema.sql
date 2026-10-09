-- ==============================================================================
-- Migration: 20261009_wishes_schema.sql
-- Project: Puneeth & Chinmai Wedding Invitation — Blessings & Wishes
-- Description: Creates the private wedding_wishes table, indexes, constraints,
--              and Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Create table: wedding_wishes
create table if not exists public.wedding_wishes (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) >= 2 and char_length(guest_name) <= 100),
  message text not null check (char_length(trim(message)) >= 3 and char_length(message) <= 2000),
  language text not null default 'kannada' check (language in ('kannada', 'english')),
  status text not null default 'unread' check (status in ('unread', 'read', 'archived', 'rejected')),
  read_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for sorting and filtering in the admin inbox
create index if not exists idx_wedding_wishes_created_at on public.wedding_wishes (created_at desc);
create index if not exists idx_wedding_wishes_status on public.wedding_wishes (status);
create index if not exists idx_wedding_wishes_language on public.wedding_wishes (language);

-- 3. Automatic updated_at trigger (reuses update_updated_at_column from journey migration)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trigger_wedding_wishes_updated_at') then
    create trigger trigger_wedding_wishes_updated_at
      before update on public.wedding_wishes
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

-- 4. Enable Row Level Security (RLS)
alter table public.wedding_wishes enable row level security;

-- 5. Row Level Security Policies:

-- A. Public Guests: RESTRICTED INSERT ONLY
--    - Guests can submit their blessing anonymously
--    - Restricts status to 'unread' only (prevents unauthorized status elevation)
--    - Validates minimum name and message lengths
--    - ZERO public read/update/delete permissions are granted
drop policy if exists "Public guests can submit blessings" on public.wedding_wishes;
create policy "Public guests can submit blessings"
  on public.wedding_wishes
  for insert
  to anon, authenticated
  with check (
    status = 'unread' and
    char_length(trim(guest_name)) >= 2 and
    char_length(trim(message)) >= 3
  );

-- B. Authenticated Administrators: SELECT all wishes (Inbox)
drop policy if exists "Admins can view all wishes" on public.wedding_wishes;
create policy "Admins can view all wishes"
  on public.wedding_wishes
  for select
  to authenticated
  using (true);

-- C. Authenticated Administrators: UPDATE status and read_at
drop policy if exists "Admins can update wishes" on public.wedding_wishes;
create policy "Admins can update wishes"
  on public.wedding_wishes
  for update
  to authenticated
  using (true)
  with check (true);

-- D. Authenticated Administrators: DELETE wishes if spam/abuse
drop policy if exists "Admins can delete wishes" on public.wedding_wishes;
create policy "Admins can delete wishes"
  on public.wedding_wishes
  for delete
  to authenticated
  using (true);
