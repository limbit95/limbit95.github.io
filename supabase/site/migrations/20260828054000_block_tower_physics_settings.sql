begin;

create table public.block_tower_physics_settings (
    id text primary key default 'default'
        check (id = 'default'),
    difficulty text not null default 'normal'
        check (difficulty in ('easy', 'normal', 'hard', 'custom')),
    block_density double precision not null
        check (block_density between 0.1 and 2),
    block_friction double precision not null
        check (block_friction between 0 and 2),
    linear_damping double precision not null
        check (linear_damping between 0 and 5),
    angular_damping double precision not null
        check (angular_damping between 0 and 5),
    grab_spring double precision not null
        check (grab_spring between 10 and 500),
    grab_damping double precision not null
        check (grab_damping between 0 and 100),
    pointer_velocity_gain double precision not null
        check (pointer_velocity_gain between 0 and 200),
    max_grab_force double precision not null
        check (max_grab_force between 10 and 2000),
    max_fast_grab_force double precision not null
        check (max_fast_grab_force between 10 and 3000),
    pointer_speed_for_max_boost double precision not null
        check (pointer_speed_for_max_boost between 0.1 and 30),
    max_pointer_target_speed double precision not null
        check (max_pointer_target_speed between 0.1 and 50),
    pointer_velocity_smoothing double precision not null
        check (pointer_velocity_smoothing between 0 and 1),
    pointer_velocity_decay double precision not null
        check (pointer_velocity_decay between 0 and 1),
    max_grab_distance double precision not null
        check (max_grab_distance between 0.1 and 20),
    lower_breakaway_max_level integer not null
        check (lower_breakaway_max_level between 0 and 17),
    breakaway_speed_start double precision not null
        check (breakaway_speed_start between 0.1 and 30),
    breakaway_speed_full double precision not null
        check (breakaway_speed_full between 0.1 and 40),
    lower_breakaway_force_bonus double precision not null
        check (lower_breakaway_force_bonus between 0 and 2500),
    lower_breakaway_velocity_gain double precision not null
        check (lower_breakaway_velocity_gain between 0 and 250),
    center_block_breakaway_multiplier double precision not null
        check (center_block_breakaway_multiplier between 1 and 5),
    updated_at timestamptz not null default now(),
    constraint block_tower_fast_force_check
        check (max_fast_grab_force >= max_grab_force),
    constraint block_tower_breakaway_speed_check
        check (breakaway_speed_full > breakaway_speed_start)
);

create trigger block_tower_physics_settings_set_updated_at
before update on public.block_tower_physics_settings
for each row execute function private.set_updated_at();

alter table public.block_tower_physics_settings enable row level security;

revoke all on table public.block_tower_physics_settings from anon, authenticated;
grant select on table public.block_tower_physics_settings to anon, authenticated;
grant update on table public.block_tower_physics_settings to authenticated;

create policy block_tower_physics_settings_select_policy
on public.block_tower_physics_settings
for select
to anon, authenticated
using (true);

create policy block_tower_physics_settings_update_policy
on public.block_tower_physics_settings
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

insert into public.block_tower_physics_settings (
    id,
    difficulty,
    block_density,
    block_friction,
    linear_damping,
    angular_damping,
    grab_spring,
    grab_damping,
    pointer_velocity_gain,
    max_grab_force,
    max_fast_grab_force,
    pointer_speed_for_max_boost,
    max_pointer_target_speed,
    pointer_velocity_smoothing,
    pointer_velocity_decay,
    max_grab_distance,
    lower_breakaway_max_level,
    breakaway_speed_start,
    breakaway_speed_full,
    lower_breakaway_force_bonus,
    lower_breakaway_velocity_gain,
    center_block_breakaway_multiplier
)
values (
    'default',
    'normal',
    0.5,
    0.56,
    0.24,
    0.38,
    115,
    13,
    24,
    260,
    460,
    6.5,
    9,
    0.45,
    0.82,
    4.2,
    10,
    2.5,
    7,
    360,
    20,
    1.45
);

commit;
