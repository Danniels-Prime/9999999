-- Æthermind initial schema
-- Run this in the Supabase SQL Editor (Database > SQL Editor)

-- Enable pgvector for semantic search
create extension if not exists vector;

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users. Created automatically via trigger on sign-up.

create table public.profiles (
  id             uuid references auth.users(id) on delete cascade primary key,
  display_name   text,
  native_language   text,
  target_languages  text[] default '{}',
  avatar_url     text,
  created_at     timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Vocabulary Items ─────────────────────────────────────────────────────────
-- Shared across users; keyed by (word, language_code).

create table public.vocabulary_items (
  id              uuid primary key default gen_random_uuid(),
  word            text not null,
  language_code   text not null,
  part_of_speech  text,
  definitions     jsonb default '[]',
  examples        jsonb default '[]',
  created_at      timestamptz default now(),
  unique(word, language_code)
);

alter table public.vocabulary_items enable row level security;

create policy "Vocabulary items readable by authenticated users"
  on public.vocabulary_items for select
  to authenticated
  using (true);

create policy "Authenticated users can insert vocabulary items"
  on public.vocabulary_items for insert
  to authenticated
  with check (true);

-- ─── User Vocabulary (SRS state) ─────────────────────────────────────────────

create table public.user_vocabulary (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  item_id        uuid references public.vocabulary_items(id) on delete cascade not null,
  next_review    timestamptz default now(),
  interval_days  integer default 1,
  ease_factor    real default 2.5,
  reps           integer default 0,
  created_at     timestamptz default now(),
  unique(user_id, item_id)
);

alter table public.user_vocabulary enable row level security;

create policy "Users can manage own vocabulary"
  on public.user_vocabulary for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Chat Sessions ────────────────────────────────────────────────────────────

create table public.chat_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  language_code  text not null default 'en',
  title          text not null default 'New conversation',
  created_at     timestamptz default now()
);

alter table public.chat_sessions enable row level security;

create policy "Users can manage own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Chat Messages ────────────────────────────────────────────────────────────

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references public.chat_sessions(id) on delete cascade not null,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  created_at  timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "Users can access messages in own sessions"
  on public.chat_messages for all
  using (
    exists (
      select 1 from public.chat_sessions
      where id = session_id and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_sessions
      where id = session_id and user_id = auth.uid()
    )
  );

-- ─── Embeddings (pgvector) ────────────────────────────────────────────────────

create table public.item_embeddings (
  id       uuid primary key default gen_random_uuid(),
  item_id  uuid references public.vocabulary_items(id) on delete cascade not null unique,
  embedding vector(1536)
);

alter table public.item_embeddings enable row level security;

create policy "Embeddings readable by authenticated users"
  on public.item_embeddings for select
  to authenticated
  using (true);

-- IVFFlat index for approximate nearest-neighbour search
create index on public.item_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
