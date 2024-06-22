
CREATE TABLE
  public.events (
    id uuid primary key default uuid_generate_v4 (),
    event_name TEXT NOT NULL,
    event_date text NOT NULL,
    event_description TEXT NULL,
    event_type TEXT NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    LOCATION TEXT NULL,
    organizer_id UUID not null,
    organization_id UUID NOT NULL,
    department_id uuid null,
    CONSTRAINT events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE,
    CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT events_department_id_fkey FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
  ) TABLESPACE pg_default;


CREATE POLICY events_select_policy ON public.events FOR
SELECT
  USING (
    organizer_id = auth.uid ()
    or department_id = current_user_department_id ()
    or (
      current_user_role () = 'owner'
      and organization_id = current_user_organization_id ()
    )
  );


CREATE POLICY events_insert_policy ON public.events FOR INSERT
WITH
  CHECK (
    current_user_role () = 'owner'
    or current_user_role () = 'manager'
  );

CREATE POLICY events_update_policy ON public.events
FOR UPDATE
  USING (
    organizer_id = auth.uid ()
    or (
      current_user_role () = 'owner'
      and organization_id = current_user_organization_id ()
    )
  );

CREATE POLICY events_delete_policy ON public.events FOR DELETE USING (
  organizer_id = auth.uid ()
  or (
    current_user_role () = 'owner'
    and organization_id = current_user_organization_id ()
  )
);
