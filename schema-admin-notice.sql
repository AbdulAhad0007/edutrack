create table public.admin_notices (
  id uuid not null default gen_random_uuid (),
  title text not null,
  message text not null,
  priority text null default 'medium'::text,
  target_audience text null default 'all'::text,
  specific_class text null,
  specific_section text null,
  scheduled_for timestamp with time zone null,
  sent_by text null default 'admin'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint admin_notices_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_admin_notices_created_at on public.admin_notices using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_admin_notices_priority on public.admin_notices using btree (priority) TABLESPACE pg_default;

create index IF not exists idx_admin_notices_target_audience on public.admin_notices using btree (target_audience) TABLESPACE pg_default;