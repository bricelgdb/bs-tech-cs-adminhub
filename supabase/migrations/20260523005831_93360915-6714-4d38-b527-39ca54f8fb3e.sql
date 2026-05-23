
-- Roles
CREATE TYPE public.app_role AS ENUM (
  'Platform Owner', 'Brand Design Lead', 'Creative Tech', 'IT Admin', 'Finance Stakeholder', 'Team Member'
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'BESTSELLER Tech',
  initials TEXT NOT NULL DEFAULT '',
  last_active DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer helpers
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('Platform Owner','IT Admin')
  )
$$;

-- Products
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT[] NOT NULL DEFAULT '{}',
  seats INT NOT NULL DEFAULT 0,
  utilisation INT NOT NULL DEFAULT 0,
  cost_monthly INT NOT NULL DEFAULT 0,
  renewal DATE,
  status TEXT NOT NULL DEFAULT 'active',
  description TEXT NOT NULL DEFAULT '',
  admin_url TEXT NOT NULL DEFAULT '',
  logo_key TEXT,
  logo_scale NUMERIC,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Access requests
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  role_requested TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_select_admin" ON public.user_roles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "products_select_authenticated" ON public.products
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "products_admin_manage" ON public.products
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'Platform Owner'))
  WITH CHECK (public.has_role(auth.uid(), 'Platform Owner'));

CREATE POLICY "access_requests_select_own" ON public.access_requests
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "access_requests_insert_own" ON public.access_requests
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "access_requests_admin_select" ON public.access_requests
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "access_requests_admin_manage" ON public.access_requests
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- New user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _name TEXT;
  _initials TEXT;
BEGIN
  _name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  _initials := UPPER(LEFT(_name, 1));

  INSERT INTO public.profiles (id, name, email, initials)
  VALUES (NEW.id, _name, NEW.email, _initials);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'Team Member');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed products
INSERT INTO public.products (id, name, domain, seats, utilisation, cost_monthly, renewal, status, description, admin_url, logo_key, logo_scale, sort_order) VALUES
('ai-studioone','BESTSELLER AI Studio',ARRAY['GenAI','Design'],88,94,0,NULL,'active','BESTSELLER''s proprietary AI-powered creative platform for generating and editing visual content at scale.','https://studioone.bestseller.com/admin','ai-studioone',NULL,0),
('adobe-cc','Adobe Creative Cloud Suite',ARRAY['Design','Photo','Video'],142,89,9240,'2026-09-01','active','Industry-standard creative apps including Photoshop, Illustrator, InDesign, Premiere Pro, and After Effects.','https://adminconsole.adobe.com','adobe-cc',NULL,1),
('capture-one','Capture One Studio',ARRAY['Photo'],37,81,1840,'2026-08-01','active','Professional photo editing and tethered capture software for fashion and product photography.','https://account.captureone.com','capture-one',1.5,2),
('creative-force','Creative Force',ARRAY['Photo','Production'],54,76,3100,'2026-07-01','active','End-to-end content production workflow management for eCommerce photography and video.','https://app.creativeforce.io/admin','creative-force',NULL,3),
('pantone','Pantone Connect',ARRAY['Design','Colour'],22,64,480,'2026-04-28','expiring','Colour matching and palette management tool integrated with Adobe and design workflows.','https://connect.pantone.com','pantone',NULL,4),
('weavy','Weavy AI',ARRAY['GenAI','Collaboration'],88,71,2400,'2026-06-01','active','AI-powered collaboration platform for creative teams with real-time content generation.','https://admin.weavy.com','weavy',NULL,5),
('midjourney','Midjourney AI',ARRAY['GenAI','Design'],12,100,960,'2026-06-01','active','AI image generation for concept art, moodboards, and creative exploration.','https://www.midjourney.com/account','midjourney',NULL,6),
('davinci','DaVinci Resolve Studio',ARRAY['Video','Post'],20,85,1600,'2026-05-03','expiring','Professional video editing, colour grading, VFX, and audio post-production.','https://www.blackmagicdesign.com/account','davinci',2,7),
('ipaper','iPaper',ARRAY['Design','Production'],18,72,720,'2026-10-01','active','Digital catalogue and interactive flipbook platform for marketing and product showcases.','https://admin.ipaper.io','ipaper',1.4,8),
('fonts','Fonts',ARRAY['Design'],65,80,540,'2026-12-01','active','Centralised font licensing and typography management for creative teams.','https://fonts.adobe.com','fonts',NULL,9);
