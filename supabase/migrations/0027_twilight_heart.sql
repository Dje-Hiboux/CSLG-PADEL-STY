/*
  # Gestion des actualités

  1. Nouvelle Table
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `image_url` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admins to manage news
    - Add policies for authenticated users to read news
*/

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  published_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read news"
  ON news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage news"
  ON news FOR ALL
  TO authenticated
  USING (check_is_admin());

-- Create trigger for updated_at
CREATE TRIGGER set_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial news items
INSERT INTO news (title, content, image_url, published_at) VALUES
  (
    'Journée d''inauguration des courts de Padel',
    'Nous sommes ravis de vous convier à l''inauguration officielle des courts de Padel du CSLG Satory. Au programme : démonstrations par des joueurs confirmés, initiations gratuites, et tournoi amical. Venez découvrir ce sport passionnant dans une ambiance conviviale !',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000',
    '2024-03-30 10:00:00+00'
  ),
  (
    'Premier tournoi de Padel du complexe',
    'Le CSLG Satory organise son premier tournoi de Padel ! Une occasion unique de participer à une compétition amicale et de rencontrer d''autres passionnés. Plusieurs catégories seront proposées pour permettre à tous les niveaux de participer. Inscriptions limitées, réservez vite votre place !',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000',
    '2024-04-15 09:00:00+00'
  );