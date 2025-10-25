-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";

-- Create function to handle updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create function to get current user ID (since we're not using Supabase Auth)
create or replace function public.current_user_id()
returns bigint
language sql stable
as $$
  select nullif(current_setting('app.current_user_id', true), '')::bigint;
$$;

-- Create users table
create table public.users (
  id bigserial primary key,
  username text not null unique,
  email text not null unique,
  password text not null,
  full_name text,
  avatar_url text,
  bio text,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone
);

-- Create an admin user
insert into public.users (
  username,
  email,
  password,
  full_name,
  role
) values (
  'admin',
  'admin@time2thrive.health',
  '$2a$10$vXxq5UGQsH3Hy5bF1JGrn.gTT1FW5zxMr7WrXpJKr1QnK1GIHsXpu', -- hashed password: admin123
  'System Administrator',
  'admin'
);

-- Create reference tables for categories
create table public.content_categories (
  id serial primary key,
  name text not null unique,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reference table for content statuses
create table public.content_statuses (
  id serial primary key,
  name text not null unique,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reference table for document types
create table public.document_types (
  id serial primary key,
  name text not null unique,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reference table for video types
create table public.video_types (
  id serial primary key,
  name text not null unique,
  description text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create base content table (shared fields between documents and videos)
create table public.content_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category_id integer references public.content_categories(id) not null,
  status_id integer references public.content_statuses(id) not null,
  thumbnail_url text,
  author_id bigint references public.users(id) not null,
  tags text[] default array[]::text[],
  views_count bigint default 0,
  likes_count bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

-- Create documents table
create table public.documents (
  id uuid primary key references public.content_items(id) on delete cascade,
  document_type_id integer references public.document_types(id) not null,
  file_url text not null,
  file_size bigint not null, -- in bytes
  page_count integer,
  language text default 'en',
  doi text, -- Digital Object Identifier for research papers
  citation_count integer default 0,
  download_count bigint default 0,
  preview_url text, -- URL to thumbnail/preview of first page
  keywords text[] default array[]::text[],
  contributors text[] default array[]::text[], -- List of contributing authors
  institution text -- Associated medical institution
);

-- Create videos table
create table public.videos (
  id uuid primary key references public.content_items(id) on delete cascade,
  video_type_id integer references public.video_types(id) not null,
  video_url text not null,
  duration interval not null, -- Video duration
  transcript text, -- Full video transcript
  resolution text, -- e.g., '1920x1080'
  language text default 'en',
  subtitles_url text[], -- Array of subtitle file URLs
  chapters jsonb, -- Video chapters/segments with timestamps
  related_resources text[], -- URLs to related materials
  equipment_used text[], -- Medical equipment featured in video
  certification_eligible boolean default false -- If video counts for CME credits
);

-- Add indexes for common queries
create index content_items_category_id_idx on public.content_items(category_id);
create index content_items_status_id_idx on public.content_items(status_id);
create index content_items_author_id_idx on public.content_items(author_id);
create index documents_document_type_id_idx on public.documents(document_type_id);
create index videos_video_type_id_idx on public.videos(video_type_id);
create index content_items_tags_idx on public.content_items using gin(tags);
create index documents_keywords_idx on public.documents using gin(keywords);

-- Add full-text search
alter table public.content_items add column search_vector tsvector;

-- Insert initial content categories
insert into public.content_categories (name, description) values
  ('Cancer Information', 'Educational content about various types of cancer'),
  ('Prevention', 'Content focused on cancer prevention strategies'),
  ('Treatment', 'Information about cancer treatment options'),
  ('Research', 'Latest cancer research and clinical trials'),
  ('Support', 'Support resources and coping strategies'),
  ('Genetics', 'Information about genetic factors in cancer'),
  ('Lifestyle', 'Content about lifestyle changes and cancer prevention'),
  ('Nutrition', 'Diet and nutritional information related to cancer');

-- Insert initial content statuses
insert into public.content_statuses (name, description) values
  ('Draft', 'Content is in draft state'),
  ('Under Review', 'Content is being reviewed'),
  ('Published', 'Content is publicly available'),
  ('Archived', 'Content is no longer actively maintained'),
  ('Scheduled', 'Content scheduled for future publication');

-- Insert initial document types
insert into public.document_types (name, description) values
  ('Research Paper', 'Academic research papers and publications'),
  ('Guide', 'Educational guides and tutorials'),
  ('Fact Sheet', 'Quick reference fact sheets'),
  ('Infographic', 'Visual information documents'),
  ('Case Study', 'Medical case studies'),
  ('FAQ', 'Frequently asked questions document'),
  ('Newsletter', 'Periodic newsletters'),
  ('Report', 'Medical reports and analyses');

-- Insert initial video types
insert into public.video_types (name, description) values
  ('Educational', 'Educational and instructional videos'),
  ('Interview', 'Expert interviews and discussions'),
  ('Lecture', 'Medical lectures and presentations'),
  ('Tutorial', 'Step-by-step tutorial videos'),
  ('Documentary', 'Documentary-style content'),
  ('Patient Story', 'Patient experiences and testimonials'),
  ('Expert Opinion', 'Medical expert opinions and insights'),
  ('Research Overview', 'Research findings and updates');
create index content_search_idx on public.content_items using gin(search_vector);

-- Update trigger for search vector
create function public.content_search_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.tags, ' ')), 'C');
  return new;
end;
$$ language plpgsql;

create trigger content_search_update_trigger
  before insert or update on public.content_items
  for each row
  execute function public.content_search_update();

-- Update timestamp trigger
create trigger handle_updated_at_content
  before update on public.content_items
  for each row
  execute function public.handle_updated_at();

-- RLS Policies
alter table public.content_items enable row level security;
alter table public.documents enable row level security;
alter table public.videos enable row level security;

-- View policies (public can view published content)
create policy "Public can view published content"
  on public.content_items for select
  using (exists (
    select 1 from public.content_statuses
    where content_statuses.id = status_id
    and content_statuses.name = 'Published'
  ));

create policy "Public can view published documents"
  on public.documents for select
  using (
    exists (
      select 1 from public.content_items
      join public.content_statuses on content_statuses.id = content_items.status_id
      where content_items.id = documents.id
      and content_statuses.name = 'Published'
    )
  );

create policy "Public can view published videos"
  on public.videos for select
  using (
    exists (
      select 1 from public.content_items
      join public.content_statuses on content_statuses.id = content_items.status_id
      where content_items.id = videos.id
      and content_statuses.name = 'Published'
    )
  );

-- Author policies (authors can CRUD their own content)
create policy "Authors can manage own content"
  on public.content_items for all
  using (author_id = current_user_id());

create policy "Authors can manage own documents"
  on public.documents for all
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = documents.id
      and content_items.author_id = current_user_id()
    )
  );

create policy "Authors can manage own videos"
  on public.videos for all
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = videos.id
      and content_items.author_id = current_user_id()
    )
  );

-- Admin policies (admins can manage all content)
create policy "Admins can manage all content"
  on public.content_items for all
  using (
    exists (
      select 1 from public.users
      where users.id = current_user_id() -- This needs to be implemented as a function
      and users.role = 'admin'
    )
  );

create policy "Admins can manage all documents"
  on public.documents for all
  using (
    exists (
      select 1 from public.users
      where users.id = current_user_id() -- This needs to be implemented as a function
      and users.role = 'admin'
    )
  );

create policy "Admins can manage all videos"
  on public.videos for all
  using (
    exists (
      select 1 from public.users
      where users.id = current_user_id() -- This needs to be implemented as a function
      and users.role = 'admin'
    )
  );

-- Insert sample content
with doc_content as (
  insert into public.content_items (
    title,
    description,
    category_id,
    status_id,
    author_id,
    tags
  ) values (
    'Introduction to Cancer Prevention',
    'Comprehensive guide to modern cancer prevention strategies',
    (select id from public.content_categories where name = 'Prevention'),
    (select id from public.content_statuses where name = 'Published'),
    (select id from public.users where email = 'admin@time2thrive.health'),
    array['cancer', 'prevention', 'healthcare', 'guide']
  ) returning id
)
insert into public.documents (
  id,
  document_type_id,
  file_url,
  file_size,
  page_count,
  keywords
) values (
  (select id from doc_content),
  (select id from public.document_types where name = 'Guide'),
  'https://storage.example.com/documents/intro-cancer-prevention.pdf',
  1048576, -- 1MB
  24,
  array['cancer prevention', 'early detection', 'lifestyle factors']
);

-- Sample video content
with video_content as (
  insert into public.content_items (
    title,
    description,
    category_id,
    status_id,
    author_id,
    tags
  ) values (
    'Modern Cancer Treatment Methods',
    'Expert discussion on the latest cancer treatment approaches',
    (select id from public.content_categories where name = 'Treatment'),
    (select id from public.content_statuses where name = 'Published'),
    (select id from public.users where email = 'admin@time2thrive.health'),
    array['cancer', 'treatment', 'oncology', 'medical']
  ) returning id
)
insert into public.videos (
  id,
  video_type_id,
  video_url,
  duration,
  resolution,
  equipment_used,
  certification_eligible
) values (
  (select id from video_content),
  (select id from public.video_types where name = 'Lecture'),
  'https://storage.example.com/videos/cancer-treatment-methods.mp4',
  interval '45 minutes',
  '1920x1080',
  array['Linear Accelerator', 'PET Scanner'],
  true
);