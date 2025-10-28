create table public.notifications (
  id serial not null,
  title character varying(255) not null,
  message text not null,
  target_audience character varying(50) not null default 'all'::character varying,
  specific_class character varying(255) null,
  specific_section character varying(50) null,
  specific_student_id integer null,
  priority character varying(20) not null default 'medium'::character varying,
  notification_type character varying(50) not null default 'general'::character varying,
  scheduled_for timestamp with time zone null,
  sent_by character varying(255) not null default 'admin'::character varying,
  is_read boolean not null default false,
  read_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint notifications_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_notifications_created_at on public.notifications using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_notifications_target_audience on public.notifications using btree (target_audience) TABLESPACE pg_default;

create index IF not exists idx_notifications_priority on public.notifications using btree (priority) TABLESPACE pg_default;

create index IF not exists idx_notifications_sent_by on public.notifications using btree (sent_by) TABLESPACE pg_default;

create index IF not exists idx_notifications_is_read on public.notifications using btree (is_read) TABLESPACE pg_default;

create index IF not exists idx_notifications_specific_student_id on public.notifications using btree (specific_student_id) TABLESPACE pg_default;

create index IF not exists idx_notifications_notification_type on public.notifications using btree (notification_type) TABLESPACE pg_default;