Exit code: 0
Wall time: 0.4 seconds
Output:
-- SAS Personnel Evaluator v4.0 shared database
create extension if not exists pgcrypto;

create table if not exists teams(id uuid primary key default gen_random_uuid(),name text not null,season integer not null,created_at timestamptz default now());
create table if not exists coach_directory(id uuid primary key default gen_random_uuid(),team_id uuid references teams(id) on delete cascade,name text not null,role text not null,email text not null unique,user_id uuid unique,is_admin boolean default false,active boolean default true);
create table if not exists players(id uuid primary key default gen_random_uuid(),team_id uuid references teams(id) on delete cascade,name text not null,jersey text,grade text,height text,weight numeric,off_position text,off_secondary text,def_position text,def_secondary text,pushups numeric,squats numeric,cone3 numeric,cone4 numeric,shuttle numeric,notes text,confirmation_status text not null default 'confirmed' check(confirmation_status in('confirmed','unconfirmed','removed')),availability text not null default 'Available' check(availability in('Available','Limited','Out')),availability_reason text,clearance_required boolean default false,expected_return date,updated_at timestamptz default now());
create table if not exists practices(id uuid primary key default gen_random_uuid(),team_id uuid references teams(id) on delete cascade,practice_date date not null,title text not null default 'Practice',status text default 'open',created_at timestamptz default now(),unique(team_id,practice_date));
create table if not exists evaluations(id uuid primary key default gen_random_uuid(),team_id uuid references teams(id) on delete cascade,practice_id uuid references practices(id) on delete cascade,player_id uuid references players(id) on delete set null,evaluator_user_id uuid not null,evaluator_name text not null,evaluator_role text not null,evaluation_type text not null check(evaluation_type in('individual','unit','team')),context text,unit_name text,team_level text,criterion text not null,rating text not null check(rating in('plus','check','minus')),note text,created_at timestamptz default now());
create table if not exists reminders(id uuid primary key default gen_random_uuid(),team_id uuid references teams(id) on delete cascade,coach_user_id uuid not null,player_id uuid references players(id) on delete cascade,evaluation_id uuid references evaluations(id) on delete set null,reason text not null,status text default 'open' check(status in('open','resolved','dismissed','archived')),safety boolean default false,created_at timestamptz default now());
create table if not exists status_history(id uuid primary key default gen_random_uuid(),player_id uuid references players(id) on delete cascade,changed_by uuid not null,old_status text,new_status text not null,reason text,created_at timestamptz default now());

create or replace function public.link_current_coach() returns void language plpgsql security definer set search_path = '' as $$ begin if (select auth.uid()) is null or nullif((select auth.jwt()->>'email'),'') is null then raise exception 'Authentication required'; end if; update public.coach_directory set user_id=(select auth.uid()) where lower(email)=lower((select auth.jwt()->>'email')) and user_id is null and active=true; end $$;
create or replace function public.current_team_id() returns uuid language sql stable security definer set search_path = '' as $$ select team_id from public.coach_directory where user_id=(select auth.uid()) and active=true limit 1 $$;
create or replace function public.current_is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select coalesce((select is_admin from public.coach_directory where user_id=(select auth.uid()) and active=true limit 1),false) $$;

alter table teams enable row level security;alter table coach_directory enable row level security;alter table players enable row level security;alter table practices enable row level security;alter table evaluations enable row level security;alter table reminders enable row level security;alter table status_history enable row level security;

do $$ begin create policy team_read on teams for select using(id=current_team_id()); exception when duplicate_object then null; end $$;
do $$ begin create policy coaches_read on coach_directory for select using(team_id=current_team_id()); exception when duplicate_object then null; end $$;
do $$ begin create policy players_read on players for select using(team_id=current_team_id()); exception when duplicate_object then null; end $$;
do $$ begin create policy players_admin_write on players for update using(team_id=current_team_id() and current_is_admin()) with check(team_id=current_team_id() and current_is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy practices_read on practices for select using(team_id=current_team_id()); exception when duplicate_object then null; end $$;
do $$ begin create policy practices_admin_write on practices for all using(team_id=current_team_id() and current_is_admin()) with check(team_id=current_team_id() and current_is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy evaluations_read on evaluations for select using(team_id=current_team_id()); exception when duplicate_object then null; end $$;
do $$ begin create policy evaluations_insert on evaluations for insert with check(team_id=current_team_id() and evaluator_user_id=auth.uid()); exception when duplicate_object then null; end $$;
do $$ begin create policy reminders_own on reminders for all using(team_id=current_team_id() and (coach_user_id=auth.uid() or current_is_admin())) with check(team_id=current_team_id() and coach_user_id=auth.uid()); exception when duplicate_object then null; end $$;
do $$ begin create policy history_read on status_history for select using(player_id in(select id from players where team_id=current_team_id())); exception when duplicate_object then null; end $$;
do $$ begin create policy history_admin_insert on status_history for insert with check(current_is_admin()); exception when duplicate_object then null; end $$;

-- v4.2 pilot hardening: application data and helper functions are authenticated-only.
alter function public.link_current_coach() set search_path = '';
alter function public.current_team_id() set search_path = '';
alter function public.current_is_admin() set search_path = '';
revoke all on function public.link_current_coach() from public, anon;
revoke all on function public.current_team_id() from public, anon;
revoke all on function public.current_is_admin() from public, anon;
grant execute on function public.link_current_coach() to authenticated;
grant execute on function public.current_team_id() to authenticated;
grant execute on function public.current_is_admin() to authenticated;
revoke all on all tables in schema public from anon;
grant select on teams, coach_directory, players, practices, evaluations, reminders, status_history to authenticated;
grant update on players to authenticated;
grant insert, update, delete on practices to authenticated;
grant insert on evaluations to authenticated;
grant insert, update, delete on reminders to authenticated;
grant insert on status_history to authenticated;
alter policy team_read on teams to authenticated;
alter policy coaches_read on coach_directory to authenticated;
alter policy players_read on players to authenticated;
alter policy players_admin_write on players to authenticated;
alter policy practices_read on practices to authenticated;
alter policy practices_admin_write on practices to authenticated;
alter policy evaluations_read on evaluations to authenticated;
alter policy evaluations_insert on evaluations to authenticated;
alter policy reminders_own on reminders to authenticated;
alter policy history_read on status_history to authenticated;
alter policy history_admin_insert on status_history to authenticated;

