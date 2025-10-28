create table public.attendance (
  id serial not null,
  student_id integer not null,
  student_name character varying(255) not null,
  roll_number character varying(50) not null,
  class character varying(100) not null,
  section character varying(10) not null,
  subject character varying(100) null,
  status character varying(20) not null,
  date date not null,
  marked_by character varying(255) not null,
  marked_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  period character varying(50) null,
  teacher_uid character varying(50) null,
  constraint attendance_pkey primary key (id),
  constraint attendance_status_check check (
    (
      (status)::text = any (
        (
          array[
            'present'::character varying,
            'absent'::character varying,
            'late'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_attendance_student_date on public.attendance using btree (student_id, date) TABLESPACE pg_default;

create index IF not exists idx_attendance_class_section_date on public.attendance using btree (class, section, date) TABLESPACE pg_default;

create index IF not exists idx_attendance_date on public.attendance using btree (date) TABLESPACE pg_default;

create trigger update_attendance_updated_at BEFORE
update on attendance for EACH row
execute FUNCTION update_updated_at_column ();