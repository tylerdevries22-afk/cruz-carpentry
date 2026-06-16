-- Cruz Carpentry — distributed rate limiting for the estimate form.
-- Idempotent. The in-process limiter in the Server Action resets per serverless
-- instance, so this shared table is the cross-instance source of truth.

-- ---------------------------------------------------------------------------
-- rate_limit_hits: one row per accepted request, keyed by client IP.
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limit_hits (
  id         bigint generated always as identity primary key,
  key        text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_created_idx
  on public.rate_limit_hits (key, created_at desc);

-- RLS on, NO policies: only the service-role client (which bypasses RLS) and the
-- SECURITY DEFINER function below ever touch this table.
alter table public.rate_limit_hits enable row level security;

-- ---------------------------------------------------------------------------
-- check_rate_limit: atomically prune expired rows, record this hit, and return
-- whether the key is now OVER the limit within the rolling window.
-- ---------------------------------------------------------------------------
create or replace function public.check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from public.rate_limit_hits
    where created_at < now() - make_interval(secs => p_window_seconds);

  insert into public.rate_limit_hits (key) values (p_key);

  select count(*) into v_count
    from public.rate_limit_hits
    where key = p_key
      and created_at >= now() - make_interval(secs => p_window_seconds);

  return v_count > p_max;
end;
$$;

-- Only the service role should be able to call it (it already can; lock out the
-- public roles explicitly for defense in depth).
revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
