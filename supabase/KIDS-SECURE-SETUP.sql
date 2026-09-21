-- Run in the SAME Supabase project used by Ethan Hub. Adults are approved manually by a trusted administrator.
create table if not exists public.ethan_kids_adults (user_id uuid primary key references auth.users(id) on delete cascade, enabled boolean not null default true, approved_at timestamptz not null default now());
create table if not exists public.ethan_kids_handoffs (ticket_hash text primary key, user_id uuid not null references auth.users(id) on delete cascade, refresh_token text not null, expires_at timestamptz not null, created_at timestamptz not null default now());
alter table public.ethan_kids_adults enable row level security;
alter table public.ethan_kids_handoffs enable row level security;
revoke all on public.ethan_kids_adults from anon, authenticated;
revoke all on public.ethan_kids_handoffs from anon, authenticated;
create or replace function public.redeem_ethan_kids_handoff(p_hash text)
returns table(user_id uuid,refresh_token text) language plpgsql security definer set search_path=public as $$
begin
 return query delete from public.ethan_kids_handoffs h where h.ticket_hash=p_hash and h.expires_at>now() returning h.user_id,h.refresh_token;
end;$$;
revoke all on function public.redeem_ethan_kids_handoff(text) from public, anon, authenticated;
grant execute on function public.redeem_ethan_kids_handoff(text) to service_role;
-- To approve a verified adult, replace UUID with their auth.users ID, after checking eligibility:
-- insert into public.ethan_kids_adults(user_id) values ('REPLACE-WITH-VERIFIED-ADULT-USER-UUID') on conflict (user_id) do update set enabled=true;
