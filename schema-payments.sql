create table public.payments (
  id uuid not null default gen_random_uuid (),
  order_id character varying(255) not null,
  student_uid character varying(255) not null,
  student_name character varying(255) not null,
  student_class character varying(100) null,
  student_section character varying(10) null,
  course character varying(255) null,
  payment_status character varying(50) not null default 'pending'::character varying,
  amount numeric(10, 2) not null,
  currency character varying(10) not null default 'INR'::character varying,
  fee_ids text[] null,
  payment_gateway character varying(100) not null default 'cashfree'::character varying,
  gateway_order_id character varying(255) null,
  transaction_id character varying(255) null,
  payment_date timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint payments_pkey primary key (id),
  constraint payments_order_id_unique unique (order_id)
) TABLESPACE pg_default;

create index IF not exists idx_payments_student_uid on public.payments using btree (student_uid) TABLESPACE pg_default;

create index IF not exists idx_payments_order_id on public.payments using btree (order_id) TABLESPACE pg_default;

create index IF not exists idx_payments_payment_status on public.payments using btree (payment_status) TABLESPACE pg_default;

create index IF not exists idx_payments_created_at on public.payments using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_payments_student_status on public.payments using btree (student_uid, payment_status) TABLESPACE pg_default;

create trigger update_payments_updated_at BEFORE
update on payments for EACH row
execute FUNCTION update_updated_at_column ();
