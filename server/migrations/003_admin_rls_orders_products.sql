-- Admin access for orders and products via public.users.role = 'admin'
-- Run this in the Supabase SQL editor (or your migration runner) after public.users exists.
--
-- 1) Promote your account (replace email):
--    UPDATE public.users SET role = 'admin' WHERE lower(email) = lower('you@example.com');
--
-- 2) The app uses the Supabase anon key with a logged-in JWT, so Postgres role is "authenticated".

CREATE OR REPLACE FUNCTION public.is_store_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND COALESCE(u.role::text, '') = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO anon;

-- Orders: admins can list/update/delete any order (additive with your existing customer policies).
DROP POLICY IF EXISTS "orders_admin_select" ON public.orders;
CREATE POLICY "orders_admin_select"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_store_admin());

DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
CREATE POLICY "orders_admin_update"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_store_admin())
WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "orders_admin_delete" ON public.orders;
CREATE POLICY "orders_admin_delete"
ON public.orders
FOR DELETE
TO authenticated
USING (public.is_store_admin());

DROP POLICY IF EXISTS "orders_admin_insert" ON public.orders;
CREATE POLICY "orders_admin_insert"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.is_store_admin());

-- Products: admins can insert/update/delete catalog rows.
DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
CREATE POLICY "products_admin_insert"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "products_admin_update" ON public.products;
CREATE POLICY "products_admin_update"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_store_admin())
WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "products_admin_delete" ON public.products;
CREATE POLICY "products_admin_delete"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_store_admin());
