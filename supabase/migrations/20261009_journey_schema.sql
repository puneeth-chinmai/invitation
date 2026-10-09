-- ==============================================================================
-- Migration: 20261009_journey_schema.sql
-- Project: Puneeth & Chinmai Wedding Invitation — Our Journey Persistent Backend
-- Description: Creates relational tables, indexes, constraints, RLS security policies,
--              and storage bucket configuration for persistent event and media management.
-- ==============================================================================

-- 1. Create table: journey_events
create table if not exists public.journey_events (
  id text primary key,
  title text not null,
  event_date text not null,
  iso_date date not null,
  category text,
  location text,
  description text,
  cover_media_id text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for chronological sorting and publication filtering
create index if not exists idx_journey_events_iso_date on public.journey_events (iso_date asc);
create index if not exists idx_journey_events_published on public.journey_events (published);

-- 2. Create table: journey_media
create table if not exists public.journey_media (
  id text primary key,
  event_id text not null references public.journey_events(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null,
  url text not null,
  thumbnail_url text,
  caption text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for event association and sequence order
create index if not exists idx_journey_media_event_id on public.journey_media (event_id);
create index if not exists idx_journey_media_sort_order on public.journey_media (event_id, sort_order asc);

-- 3. Trigger: Automatically update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_journey_events_updated_at
  before update on public.journey_events
  for each row execute function public.update_updated_at_column();

create trigger trigger_journey_media_updated_at
  before update on public.journey_media
  for each row execute function public.update_updated_at_column();

-- 4. Constraint: Validate that cover_media_id belongs to the same event
create or replace function public.check_cover_media_integrity()
returns trigger as $$
begin
  if new.cover_media_id is not null then
    if not exists (
      select 1 from public.journey_media
      where id = new.cover_media_id and event_id = new.id
    ) then
      raise exception 'cover_media_id % does not belong to event %', new.cover_media_id, new.id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_journey_events_cover_integrity
  before insert or update on public.journey_events
  for each row execute function public.check_cover_media_integrity();

-- 5. Row Level Security (RLS) Configuration
alter table public.journey_events enable row level security;
alter table public.journey_media enable row level security;

-- Public Visitors: Can read ONLY published events
create policy "Public can read published events"
  on public.journey_events
  for select
  using (published = true);

-- Public Visitors: Can read media ONLY for published events
create policy "Public can read media of published events"
  on public.journey_media
  for select
  using (
    event_id in (
      select id from public.journey_events where published = true
    )
  );

-- Authenticated Admin: Full access to events (create, read drafts, update, delete)
create policy "Admins have full access to events"
  on public.journey_events
  for all
  to authenticated
  using (true)
  with check (true);

-- Authenticated Admin: Full access to media metadata
create policy "Admins have full access to media"
  on public.journey_media
  for all
  to authenticated
  using (true)
  with check (true);

-- 6. Storage Bucket Setup (Storage bucket: 'journey-media')
-- Run in Supabase SQL editor:
insert into storage.buckets (id, name, public)
values ('journey-media', 'journey-media', true)
on conflict (id) do update set public = true;

-- Storage Policy: Public read for journey media files
create policy "Public can view journey media files"
  on storage.objects
  for select
  using (bucket_id = 'journey-media');

-- Storage Policy: Authenticated admins can upload media files
create policy "Admins can upload journey media files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'journey-media');

-- Storage Policy: Authenticated admins can update media files
create policy "Admins can update journey media files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'journey-media');

-- Storage Policy: Authenticated admins can delete media files
create policy "Admins can delete journey media files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'journey-media');

-- 7. Seed Initial Planned Real Milestones (Drafts ready for real uploads)
insert into public.journey_events (id, title, event_date, iso_date, category, location, description, published)
values
  ('event-families-meet', 'Families Met & Marriage Fixed', 'April 2024', '2024-04-14', 'Family Blessings', 'Karnataka', 'The auspicious day when both families met with warmth, shared blessings, and agreed upon the union of Puneeth & Chinmai.', true),
  ('event-groom-birthday', 'Groom''s Birthday', 'May 2024', '2024-05-18', 'Celebration', 'Bengaluru', 'Celebrating Puneeth''s birthday together with warmth, heartfelt wishes, and joyful moments.', true),
  ('event-bride-birthday', 'Bride''s Birthday Celebration', 'August 2024', '2024-08-22', 'Celebration', 'Bengaluru', 'A cherished day celebrating Chinmai''s birthday filled with sweet memories, smiles, and laughter.', true),
  ('event-cafe-date', 'A Special Café Date', 'September 2024', '2024-09-12', 'Cherished Moments', 'Bengaluru', 'A quiet afternoon over artisanal coffee, heartfelt conversations, and the thousand little moments that deepened their bond.', true),
  ('event-engagement', 'The Engagement Ceremony', 'November 2024', '2024-11-10', 'Sacred Milestone', 'Chikkamagaluru, Karnataka', 'Surrounded by elders, sacred chants, and loved ones, exchanging rings and officially marking the journey to forever.', true),
  ('event-pre-wedding-shoot', 'Pre-Wedding Photoshoot', 'Pre-Wedding', '2026-10-15', 'Upcoming Chapter', 'Chikkamagaluru, Karnataka', 'Pre-wedding memories and photoshoot captures to be added as the wedding date approaches.', false)
on conflict (id) do nothing;
