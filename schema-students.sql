create table public.students (
  id serial not null,
  uid character varying(255) not null,
  password character varying(255) not null,
  name character varying(255) not null,
  age integer null,
  dob date null,
  address text null,
  gender character varying(50) null,
  class character varying(255) null,
  course character varying(255) null,
  section character varying(255) null,
  class_teacher_name character varying(255) null,
  role character varying(50) null default 'student'::character varying,
  constraint students_pkey primary key (id),
  constraint students_uid_key unique (uid)
) TABLESPACE pg_default;