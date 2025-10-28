create table public.timetable (
  id serial not null,
  class character varying(255) not null,
  section character varying(255) null,
  day_of_week character varying(50) not null,
  period integer not null,
  subject character varying(255) not null,
  teacher_name character varying(255) not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  room_number character varying(50) null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint timetable_pkey primary key (id),
  constraint timetable_class_section_day_of_week_period_key unique (class, section, day_of_week, period)
) TABLESPACE pg_default;

create index IF not exists idx_timetable_class on public.timetable using btree (class) TABLESPACE pg_default;

create index IF not exists idx_timetable_section on public.timetable using btree (section) TABLESPACE pg_default;

create index IF not exists idx_timetable_day_of_week on public.timetable using btree (day_of_week) TABLESPACE pg_default;

create index IF not exists idx_timetable_period on public.timetable using btree (period) TABLESPACE pg_default;

create index IF not exists idx_timetable_subject on public.timetable using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_timetable_class_section on public.timetable using btree (class, section) TABLESPACE pg_default;

create index IF not exists idx_timetable_class_day_period on public.timetable using btree (class, day_of_week, period) TABLESPACE pg_default;

create index IF not exists idx_timetable_class_section_day on public.timetable using btree (class, section, day_of_week) TABLESPACE pg_default;