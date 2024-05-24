
-- Create a role enum type for users
create type role_enum as enum('owner', 'manager', 'employee');

-- Create a table for public users
create table
  users (
    id uuid references auth.users on delete cascade not null primary key,
    updated_at timestamp with time zone,
    email text not null unique,
    first_name text,
    last_name text,
    role role_enum,
    address text ,
    city text,
    state text,
    country text,
    zip_code text,
    phone_number text,
    date_of_birth text,
    avatar_url text
    position text,
    hire_date text,
    salary integer default 0,
    gender text,
    employment_status text default 'active';
  );

    -- create function to get the current user role

  CREATE FUNCTION current_user_role() RETURNS text AS $$
    DECLARE
      role text;
    BEGIN
      SELECT role INTO role
      FROM users
      WHERE id = auth.uid();
      RETURN role;
  END;
  $$ LANGUAGE plpgsql;

  -- function to get current user department id 

  CREATE FUNCTION current_user_department_id () RETURNS UUID AS $$
DECLARE
    current_user_department_id UUID;
BEGIN
    SELECT department_id INTO current_user_department_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN current_user_department_id;
END;
$$ LANGUAGE plpgsql;


  -- function to get current user organization id

  CREATE FUNCTION current_user_organization_id () RETURNS UUID AS $$
DECLARE
    current_user_organization_id UUID;
BEGIN
    SELECT organization_id INTO current_user_organization_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN current_user_organization_id;
END;
$$ LANGUAGE plpgsql;




-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.

alter table users enable row level security;

create policy "Public users are viewable by everyone." on users for
select
  using (auth.uid () is not null);

create policy "Users or owner or manager can insert their own profile." on users for insert
with
  check (
    (
      select
        auth.uid ()
    ) = id
    or current_user_role() = 'owner'
    or current_user_role() = 'manager'
  );

create policy "Users or owner or manager can update own profile." on users
for update
  using (
    auth.uid () = id
    or current_user_role() = 'owner'
    or current_user_role() = 'manager'
  );

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user () returns trigger as $$
begin
  insert into public.users (id, email, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- Set up Storage!
insert into
  storage.buckets (id, name)
values
  ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects for
select
  using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects for insert
with
  check (bucket_id = 'avatars');
