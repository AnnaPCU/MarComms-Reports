-- ════════════════════════════════════════════════════════════════
--  0007_imports_bucket.sql — bucket de Storage para el import autónomo
--  Los archivos se suben a `imports/inbox/...`; la función /api/process-imports
--  los procesa (con service role) y los mueve a processed/ o failed/.
--  Bucket privado: solo service role (la función) y usuarios autenticados lo tocan.
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('imports', 'imports', false)
on conflict (id) do nothing;
