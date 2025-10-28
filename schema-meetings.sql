create table public.meetings (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  meeting_date date not null,
  meeting_time time without time zone not null,
  location text null,
  meeting_type text not null,
  duration integer not null default 60,
  attendees jsonb null default '[]'::jsonb,
  scheduled_by text not null default 'admin'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint meetings_pkey primary key (id),
  constraint meetings_meeting_type_check check (
    (
      meeting_type = any (
        array['online'::text, 'offline'::text, 'hybrid'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_meetings_date on public.meetings using btree (meeting_date) TABLESPACE pg_default;

create index IF not exists idx_meetings_type on public.meetings using btree (meeting_type) TABLESPACE pg_default;

create index IF not exists idx_meetings_scheduled_by on public.meetings using btree (scheduled_by) TABLESPACE pg_default;

create index IF not exists idx_meetings_attendees on public.meetings using gin (attendees) TABLESPACE pg_default;

create trigger update_meetings_updated_at BEFORE
update on meetings for EACH row
execute FUNCTION update_updated_at_column ();