-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing
create table
  organizations (
    id uuid primary key default uuid_generate_v4 (),
    name text not null,
    type text not null,
    address text not null,
    city text not null,
    state text not null,
    country text not null,
    zip_code text not null,
    employees_count integer not null,
    contact_name text not null,
    contact_email text not null,
    contact_number text not null,
    owner_id uuid references users (id) on delete cascade
  );

alter table users
add column organization_id uuid references organizations (id) on delete set null;

-- Create a function to update the organization_id column in the users table
CREATE FUNCTION on_organization_insert () RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET organization_id = NEW.id
    WHERE id = NEW.owner_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get the current user organization_id
CREATE FUNCTION current_user_organization_id()  RETURNS UUID AS $$
BEGIN
    RETURN (SELECT organization_id FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the on_organization_insert function after an INSERT or UPDATE on the organizations table
CREATE TRIGGER on_organization_insert_trigger
AFTER INSERT ON public.organizations FOR EACH ROW
EXECUTE FUNCTION on_organization_insert ();

create policy organization_select_policy on organizations for
select
  using (
    -- authanticated user
    auth.uid () is not null
    -- belong to organization
    and current_user_organization_id() = id
  );

create policy organization_insert_policy on organizations for insert
with
  check (
    (auth.uid () is not null)
    and (
     current_user_role() = 'owner'
    )
  );

create policy organization_update_policy on organizations
for update
  using (
    auth.uid () = owner_id
    or (
      current_user_role() = 'manager'
    and
     current_user_organization_id() = id
     )
  );

create policy organization_delete_policy on organizations for delete using (auth.uid () = owner_id);

