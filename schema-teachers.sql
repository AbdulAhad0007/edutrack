create table public.teachers (
  id serial not null,
  uid character varying(255) not null,
  password character varying(255) not null,
  name character varying(255) not null,
  age integer null,
  dob date null,
  address text null,
  department character varying(255) null,
  experience integer null,
  jobrole character varying(255) null,
  profession character varying(255) null,
  hobbies text null,
  role character varying(50) null,
  constraint teachers_pkey primary key (id),
  constraint teachers_uid_key unique (uid)
) TABLESPACE pg_default;