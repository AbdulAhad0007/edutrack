create table public.exam_results (
  id uuid not null default gen_random_uuid (),
  exam_id uuid null,
  student_id text not null,
  student_name text not null,
  marks_obtained numeric(5, 2) not null,
  total_marks numeric(5, 2) not null,
  percentage numeric GENERATED ALWAYS as (((marks_obtained / total_marks) * (100)::numeric)) STORED (5, 2) null,
  grade character varying(2) null,
  remarks text null,
  is_absent boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint exam_results_pkey primary key (id),
  constraint exam_results_exam_id_fkey foreign KEY (exam_id) references exams (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_exam_results_exam_id on public.exam_results using btree (exam_id) TABLESPACE pg_default;

create index IF not exists idx_exam_results_student_id on public.exam_results using btree (student_id) TABLESPACE pg_default;

create trigger calculate_exam_result_grade_trigger BEFORE INSERT
or
update on exam_results for EACH row
execute FUNCTION calculate_grade ();

create trigger update_exam_results_updated_at BEFORE
update on exam_results for EACH row
execute FUNCTION update_updated_at_column ();