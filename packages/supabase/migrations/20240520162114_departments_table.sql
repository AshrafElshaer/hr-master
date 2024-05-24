CREATE TABLE public.departments (
  id uuid primary key default uuid_generate_v4 (),
  name TEXT NOT NULL,
  description text,
  employees_count integer default 0;

organization_id UUID NOT NULL references organizations (id) ON DELETE CASCADE,
person_in_charge_id UUID NOT NULL references users (id) on delete
set
  null
);

-- add department id to usres table
alter table
  public.users
add
  column department_id uuid references departments (id) on delete
set
  null;

-- enable raw level security
ALTER TABLE
  public.departments ENABLE ROW LEVEL SECURITY;

-- insert policy
create policy departments_inser_policy on departments for
insert
  with check (
    (
      current_user_role () = 'owner'
      or current_user_role() = 'manager'
    )
    and current_user_organization_id() = organization_id
    and (auth.uid () is not null)
  );

-- select policy
create policy departments_select_policy on departments for
select
  using (
    CASE
      WHEN (
        (current_user_organization_id() = organization_id)
        AND (current_user_role() = 'owner' :: text)
      ) THEN true
      WHEN (
        (current_user_role() = 'manager' :: text)
        AND (current_user_department_id() = id)
      ) THEN true
      ELSE false
    END
  );

-- update policy
create policy departments_update_policy on departments for
update
  using (
    auth.uid () is not null
    and (
      auth.uid () = person_in_charge_id
      or (
        current_user_role () = 'owner'
        and current_user_organization_id() = organization_id
      )
    )
  );

-- delete policy
create policy departments_delete_policy on departments for delete using (
  current_user_role () = 'owner'
  and current_user_organization_id() = organization_id
);

-- FUNCTIONS  
-- update department employee count when a new employee is added
CREATE
OR REPLACE FUNCTION update_department_employee_count () RETURNS TRIGGER AS $ $ BEGIN IF NEW.department_id IS NOT NULL
AND NEW.role = 'employee' THEN
UPDATE
  departments
SET
  employees_count = employees_count + 1
WHERE
  id = NEW.department_id;

END IF;

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE TRIGGER increment_employee_count
AFTER
INSERT
  ON users FOR EACH ROW EXECUTE FUNCTION update_department_employee_count ();