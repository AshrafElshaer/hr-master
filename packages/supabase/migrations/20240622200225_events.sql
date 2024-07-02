CREATE TYPE event_type_enum AS ENUM(
    'meeting',
    'conference',
    'birthday',
    'anniversary'
);

CREATE TYPE recurrence_pattern_enum AS ENUM('daily', 'weekly', 'monthly', 'yearly');

create table
  public.events (
    id uuid not null default gen_random_uuid (),
    event_name text not null,
    event_date date not null,
    event_description text null,
    event_type public.event_type_enum not null,
    location text null,
    organizer_id uuid not null,
    organization_id uuid not null,
    department_id uuid null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    start_time text not null,
    end_time text not null,
    constraint events_pkey primary key (id),
    constraint events_department_id_fkey foreign key (department_id) references departments (id) on delete set null,
    constraint events_organization_id_fkey foreign key (organization_id) references organizations (id) on delete cascade,
    constraint events_organizer_id_fkey foreign key (organizer_id) references users (id) on delete set null
  ) tablespace pg_default;

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

CREATE POLICY events_insert_policy ON public.events FOR
INSERT
    WITH CHECK (
        current_user_role () = 'owner'
        or current_user_role () = 'manager'
    );

CREATE POLICY events_update_policy ON public.events FOR
UPDATE
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