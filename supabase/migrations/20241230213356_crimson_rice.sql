-- Create a bucket for news images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Admins can manage news images"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'news' AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Anyone can view news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news');