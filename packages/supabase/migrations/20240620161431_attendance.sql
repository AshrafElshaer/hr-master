

create table
  public.attendance (
     id uuid primary key default uuid_generate_v4 (),
    user_id uuid not null,
    organization_id uuid not null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    check_in timestamp with time zone not null,
    check_out timestamp with time zone,
    total_time double precision,
    status text not null,
    note text,
    constraint attendance_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade,
    constraint attendance_organization_id_fkey foreign key (organization_id) references public.organizations (id) on delete cascade
  ) tablespace pg_default;

create policy select_attendance_policy on public.attendance for
select
  to public using (
    auth.uid () = user_id
    or current_user_organization_id () = organization_id
  );

create policy insert_attendance_policy on public.attendance for insert to public
with
  check (auth.uid () = user_id);

create policy update_attendance_policy on public.attendance
for update
  to public using (
    auth.uid () = user_id
    or current_user_organization_id () = organization_id
  );