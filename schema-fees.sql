create table public.fees (
  id uuid not null default gen_random_uuid (),
  student_uid character varying(255) not null,
  student_name character varying(255) not null,
  teacher_id character varying(255) not null,
  teacher_name character varying(255) not null,
  fee_type character varying(100) not null,
  amount numeric(10, 2) not null,
  description text null,
  due_date date not null,
  status character varying(50) null default 'pending'::character varying,
  payment_date timestamp with time zone null,
  payment_method character varying(100) null,
  transaction_id character varying(255) null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by character varying(255) not null,
  updated_by character varying(255) null,
  constraint fees_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_fees_student_uid on public.fees using btree (student_uid) TABLESPACE pg_default;

create index IF not exists idx_fees_teacher_id on public.fees using btree (teacher_id) TABLESPACE pg_default;

create index IF not exists idx_fees_status on public.fees using btree (status) TABLESPACE pg_default;

create index IF not exists idx_fees_due_date on public.fees using btree (due_date) TABLESPACE pg_default;

create index IF not exists idx_fees_created_at on public.fees using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_fees_student_uid_status on public.fees using btree (student_uid, status) TABLESPACE pg_default;

create index IF not exists idx_fees_teacher_id_status on public.fees using btree (teacher_id, status) TABLESPACE pg_default;

create index IF not exists idx_fees_due_date_status on public.fees using btree (due_date, status) TABLESPACE pg_default;

create index IF not exists idx_fees_created_at_desc on public.fees using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_fees_student_due_date on public.fees using btree (student_uid, due_date) TABLESPACE pg_default;

create index IF not exists idx_fees_teacher_due_date on public.fees using btree (teacher_id, due_date) TABLESPACE pg_default;