-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

create table
  organizations (
    id uuid primary key default uuid_generate_v4 (),
    organization_name text not null,
    organization_type text not null,
    address text not null,
    city text not null,
    state text not null,
    country text not null,
    zip_code text not null,
    employees_count integer not null,
    contact_name text not null,
    contact_email text not null,
    contact_number text not null,
    owner_id uuid references auth.users(id) on delete cascade
  );

create policy organization_select_policy on organizations for
select
  using (auth.uid () is not null);

create policy organization_insert_policy on organizations for insert
with
  check (auth.uid () is not null);

create policy organization_update_policy on organizations
for update
  using (
    auth.uid () = owner_id
    or (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) = 'manager'
  );

create policy organization_delete_policy on organizations for delete using (auth.uid () = owner_id);