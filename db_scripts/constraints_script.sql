create or replace function nonempty_string(arg varchar)
    returns boolean
    language plpgsql
as
$$
begin
    return length(trim(arg)) > 0;
end
$$;


/* action */
alter table public.action
    add  constraint nonempty_description check ( nonempty_string(description));

/* address */
alter table public.address
    add constraint nonempty_street_name check (nonempty_string(street)),
    add constraint nonempty_city_name check (nonempty_string(city)),
    add constraint positive_house_number check (number > 0),
    add constraint positive_zip_code check (zip_code > 0),
    add constraint valid_latitude check (latitude >= -90 and latitude <= 90),
    add constraint valid_longitude check (longitude >= -180 and longitude <= 180);

/* building */
alter table public.building
    add constraint nonempty_name check (nonempty_string(name)),
    add constraint nonempty_ivago_id check(nonempty_string(ivago_id));

alter table public.file
    add constraint nonempty_file_path check (nonempty_string(path));

alter table public.image
    add constraint nonempty_file_path check (nonempty_string(path)),
    add constraint no_future_time check (time <= now());

alter table public.progress
    add constraint nonempty_report check (nonempty_string(report)),
    add constraint no_future_arrival check (arrival <= now()),
    add constraint no_future_departure check (departure <= now()),
    add constraint no_arrival_before_departure check (arrival < progress.departure);

alter table public.progress_image
    add constraint nonempty_description check (nonempty_string(description));

alter table public.region
    add constraint nonempty_name check (nonempty_string(name));

alter table public.round
    add constraint nonempty_name check (nonempty_string(name));

alter table public.user
    add constraint nonempty_email check (nonempty_string(email)),
    add constraint nonempty_first_name check (nonempty_string(first_name)),
    add constraint nonempty_last_name check (nonempty_string(last_name)),
    add constraint date_added_in_the_past check (date_added <= now()),
    add constraint last_login_in_the_past check (last_login <= now()),
    add constraint nonempty_phone check (nonempty_string(phone));
    -- TODO: is phone number only numbers?
