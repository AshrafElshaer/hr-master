

create table
  departments (
    id uuid primary key default uuid_generate_v4 (),
    department_name text,
    organization_id uuid references organizations (id)
  );

create policy department_insert_policy on departments for insert
with
  check (
    (
      select
        role
      from
        auth.users
      where
        id = auth.uid ()
    ) = 'owner'
    or (
      select
        role
      from
        auth.users
      where
        id = auth.uid ()
    ) = 'manager'
  );

create policy update_department_policy on departments
for update
with
  check (
    (
      select
        role
      from
        auth.users
      where
        id = auth.uid ()
    ) = 'owner'
    or (
      select
        role
      from
        auth.users
      where
        id = auth.uid ()
    ) = 'manager'
  );

create policy read_department_policy on departments for
select
  using (
    (
      select
        raw_user_meta_data ->> 'organization_id'
      from
        auth.users
      where
        id = auth.uid ()
    ) = organization_id::text
  );

create policy delete_department_policy on departments for delete using (
  (
    select
      role
    from
      auth.users
    where
      id = auth.uid ()
  ) = 'owner'
  and (
    select
      raw_user_meta_data ->> 'organization_id'
    from
      auth.users
    where
      id = auth.uid ()
  ) = organization_id::text
);