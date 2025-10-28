create table public.teacher_notifications (
  id uuid not null default gen_random_uuid (),
  title text not null,
  message text not null,
  priority text null default 'medium'::text,
  target_audience text null default 'all_students'::text,
  specific_class text null,
  specific_section text null,
  specific_student_id uuid null,
  teacher_id text not null,
  teacher_name text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  notification_type text null default 'teacher_notification'::text,
  constraint teacher_notifications_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_teacher_notifications_created_at on public.teacher_notifications using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_teacher_notifications_priority on public.teacher_notifications using btree (priority) TABLESPACE pg_default;

create index IF not exists idx_teacher_notifications_target_audience on public.teacher_notifications using btree (target_audience) TABLESPACE pg_default;

create index IF not exists idx_teacher_notifications_teacher_id on public.teacher_notifications using btree (teacher_id) TABLESPACE pg_default;