-- Runs the sync-catalogue Edge Function every 10 minutes from the database,
-- so chapters the fetcher mirrors show up on the site without anyone running
-- `npm run sync:catalogue` (INTEGRATION_PLAN.md, step 7).
--
-- The function only accepts one of the project's secret keys, which must not
-- live in a migration. It is read from Supabase Vault at run time. Until the
-- secret exists, each run logs a warning and sends nothing. To set it, run
-- once in the SQL editor:
--
--   select vault.create_secret('<sb_secret_... key>', 'sync_catalogue_secret_key');
--
-- To trigger a run by hand:  select private.invoke_sync_catalogue();
-- To see results:            select * from public.sync_state;
--                            select * from net._http_response order by created desc limit 5;

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- Not exposed through the Data API (only public is), so nothing here is
-- callable by site visitors.
create schema if not exists private;
revoke all on schema private from public;

create or replace function private.invoke_sync_catalogue(full_sync boolean default false)
returns bigint
language plpgsql
set search_path = ''
as $$
declare
  secret_key text;
begin
  select decrypted_secret into secret_key
  from vault.decrypted_secrets
  where name = 'sync_catalogue_secret_key';

  if secret_key is null then
    raise warning 'sync-catalogue skipped: Vault secret "sync_catalogue_secret_key" is not set';
    return null;
  end if;

  -- Asynchronous: returns a request id at once; the response lands in
  -- net._http_response. The project URL is not a secret.
  return net.http_post(
    url := 'https://umrsyqqpkdpespixhjed.supabase.co/functions/v1/sync-catalogue',
    headers := jsonb_build_object('Content-Type', 'application/json', 'apikey', secret_key),
    body := jsonb_build_object('full', full_sync),
    timeout_milliseconds := 60000
  );
end;
$$;

revoke execute on function private.invoke_sync_catalogue(boolean) from public, anon, authenticated;

-- cron.schedule replaces a job with the same name, so re-running is safe.
select cron.schedule('sync-catalogue', '*/10 * * * *', $$select private.invoke_sync_catalogue()$$);
