-- Binalar tablosu
create table buildings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Katlar tablosu
create table floors (
  id uuid default gen_random_uuid() primary key,
  building_id uuid references buildings(id) on delete cascade not null,
  name text not null,
  level int not null default 0,
  intro_message text,
  zones jsonb default '[]'::jsonb, -- 4 bölgeyi JSON olarak tutacağız
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Güvenlik Politikaları (RLS) - Herkese açık okuma/yazma (Prototip için)
alter table buildings enable row level security;
alter table floors enable row level security;

create policy "Public Access Buildings" on buildings for all using (true) with check (true);
create policy "Public Access Floors" on floors for all using (true) with check (true);
