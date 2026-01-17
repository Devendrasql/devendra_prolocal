/*
  # Add Portfolio Content Sections

  ## New Tables
  
  ### case_studies
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Case study title
  - `slug` (text, unique) - URL-friendly slug
  - `company` (text) - Company name
  - `role` (text) - Your role in the project
  - `duration` (text) - Project duration (e.g., "6 months")
  - `overview` (text) - Brief overview
  - `challenge` (text) - Problem statement
  - `solution` (text) - Solution approach
  - `impact` (text) - Results and metrics
  - `image_url` (text) - Hero image
  - `tags` (text[]) - Technology/methodology tags
  - `metrics` (jsonb) - Key metrics (e.g., {revenue: "+40%", users: "50K+"})
  - `featured` (boolean) - Whether to feature on homepage
  - `published` (boolean) - Publish status
  - `order` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### testimonials
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Person's name
  - `role` (text) - Their role/title
  - `company` (text) - Company name
  - `content` (text) - Testimonial text
  - `avatar_url` (text) - Profile photo
  - `rating` (integer) - Optional rating 1-5
  - `featured` (boolean) - Show on homepage
  - `order` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  
  ### blog_posts
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly slug
  - `excerpt` (text) - Short description
  - `content` (text) - Full content (markdown)
  - `cover_image` (text) - Cover image URL
  - `author` (text) - Author name
  - `tags` (text[]) - Category tags
  - `published` (boolean) - Publish status
  - `views` (integer) - View count
  - `read_time` (integer) - Estimated read time in minutes
  - `created_at` (timestamptz) - Publication date
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### certifications
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Certification name
  - `issuer` (text) - Issuing organization
  - `date` (text) - Date obtained
  - `credential_url` (text) - Link to credential
  - `image_url` (text) - Badge/logo image
  - `order` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Admin-only write access
*/

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  duration text NOT NULL,
  overview text NOT NULL,
  challenge text NOT NULL,
  solution text NOT NULL,
  impact text NOT NULL,
  image_url text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  metrics jsonb DEFAULT '{}'::jsonb,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published case studies"
  ON case_studies FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  content text NOT NULL,
  avatar_url text DEFAULT '',
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text DEFAULT '',
  author text DEFAULT 'Admin',
  tags text[] DEFAULT ARRAY[]::text[],
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  read_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  credential_url text DEFAULT '',
  image_url text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certifications"
  ON certifications FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);