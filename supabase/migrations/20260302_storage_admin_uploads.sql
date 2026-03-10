-- Allow admin users to manage Storage objects (uploads from Admin UI).
-- This relies on the `is_admin()` helper defined in earlier migrations.

create policy "admin_storage_objects_all"
on storage.objects
for all
to authenticated
using (is_admin())
with check (is_admin());

