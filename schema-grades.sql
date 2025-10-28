create table public.grades (
  id uuid not null default gen_random_uuid (),
  student_id text not null,
  student_name text not null,
  student_class text not null,
  student_section text null,
  subject text not null,
  teacher_uid text not null,
  teacher_name text not null,
  marks_obtained numeric(5, 2) not null,
  total_marks numeric(5, 2) not null,
  percentage numeric GENERATED ALWAYS as (((marks_obtained / total_marks) * (100)::numeric)) STORED (5, 2) null,
  grade character varying(2) null,
  academic_year text not null,
  semester text null,
  exam_type text not null,
  exam_date date not null,
  remarks text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  student_uid character varying null,
  constraint grades_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_grades_student_id on public.grades using btree (student_id) TABLESPACE pg_default;

create index IF not exists idx_grades_teacher_id on public.grades using btree (teacher_uid) TABLESPACE pg_default;

create index IF not exists idx_grades_subject on public.grades using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_grades_academic_year on public.grades using btree (academic_year) TABLESPACE pg_default;

create index IF not exists idx_grades_exam_type on public.grades using btree (exam_type) TABLESPACE pg_default;

create index IF not exists idx_grades_exam_date on public.grades using btree (exam_date) TABLESPACE pg_default;

create index IF not exists idx_grades_percentage on public.grades using btree (percentage) TABLESPACE pg_default;

create index IF not exists idx_grades_student_subject on public.grades using btree (student_id, subject) TABLESPACE pg_default;

create index IF not exists idx_grades_student_exam_date on public.grades using btree (student_id, exam_date) TABLESPACE pg_default;

create index IF not exists idx_grades_student_exam_type on public.grades using btree (student_id, exam_type) TABLESPACE pg_default;

create index IF not exists idx_grades_subject_exam_date on public.grades using btree (subject, exam_date) TABLESPACE pg_default;

create index IF not exists idx_grades_student_uid on public.grades using btree (student_uid) TABLESPACE pg_default;

create trigger calculate_grade_trigger BEFORE INSERT
or
update on grades for EACH row
execute FUNCTION calculate_grade ();

create trigger update_grades_updated_at BEFORE
update on grades for EACH row
execute FUNCTION update_updated_at_column ();