create table public.exams (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  subject text not null,
  teacher_uid text not null,
  teacher_name text not null,
  class text not null,
  section text null,
  exam_date date not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  total_marks numeric(5, 2) not null,
  passing_marks numeric(5, 2) null,
  instructions text null,
  room_number text null,
  academic_year text not null,
  semester text null,
  exam_type text not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint exams_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_exams_teacher_id on public.exams using btree (teacher_uid) TABLESPACE pg_default;

create index IF not exists idx_exams_class on public.exams using btree (class) TABLESPACE pg_default;

create index IF not exists idx_exams_exam_date on public.exams using btree (exam_date) TABLESPACE pg_default;

create index IF not exists idx_exams_subject on public.exams using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_exams_academic_year on public.exams using btree (academic_year) TABLESPACE pg_default;

create index IF not exists idx_exams_is_active on public.exams using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_exams_exam_date_desc on public.exams using btree (exam_date desc) TABLESPACE pg_default;

create index IF not exists idx_exams_class_date on public.exams using btree (class, exam_date) TABLESPACE pg_default;

create index IF not exists idx_exams_active_date_class on public.exams using btree (is_active, exam_date, class) TABLESPACE pg_default;

create index IF not exists idx_exams_active_subject_date on public.exams using btree (is_active, subject, exam_date) TABLESPACE pg_default;

create index IF not exists idx_exams_active_only on public.exams using btree (exam_date, class, subject) TABLESPACE pg_default
where
  (is_active = true);

create trigger update_exams_updated_at BEFORE
update on exams for EACH row
execute FUNCTION update_updated_at_column ();