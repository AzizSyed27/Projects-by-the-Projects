-- =========================
-- Seed: 1 ACTIVE + 1 COMPLETED project
-- =========================

-- Project 01 (COMPLETED)
WITH p AS (
  INSERT INTO projects (
    slug, title, hero_blurb, short_desc, long_desc,
    status, card_image_url, main_image_url, display_order,
    created_at, updated_at, completed_at
  )
  VALUES (
    'water-changes-everything-zanzibar',
    'Water Changes Everything',
    'In 2020, we completed a community well in Donge-Mchangani, Zanzibar—bringing clean, safe water to 1,000+ residents.',
    'A life-changing community well dedicated in memory of Brother Daarshaan—improving health, hygiene, and daily living for 1,000+ residents.',
    'Donge-Mchangani, Zanzibar, Tanzania (2020)\n\n“From our struggle to yours, transforming pain into smiles.”\n\nTransforming Lives Through Water\n• Built a community well for 1,000+ residents\n• Improved health, hygiene, and daily living\n• Dedicated in memory of Brother Daarshaan\n\nThis project exists to reduce the daily burden of searching for safe water and to restore time, health, and dignity to families. Clean water changes everything—today and for years to come.',
    'COMPLETED',
    '/projects/zanzibar/card.jpg',
    '/projects/zanzibar/main.jpg',
    1,
    NOW(), NOW(), NOW()
  )
  RETURNING id
)
INSERT INTO project_tags (project_id, tag)
SELECT p.id, t.tag
FROM p
JOIN (VALUES
  ('Water'),
  ('Infrastructure'),
  ('Zanzibar'),
  ('Tanzania'),
  ('Community Impact')
) AS t(tag) ON TRUE;

-- Gallery for Project 01
WITH p AS (
  SELECT id FROM projects WHERE slug = 'water-changes-everything-zanzibar'
)
INSERT INTO project_images (project_id, url, alt, kind, sort_order)
SELECT p.id, g.url, g.alt, 'GALLERY', g.sort_order
FROM p
JOIN (VALUES
  ('/projects/zanzibar/gallery-1.jpg', 'Community well in Donge-Mchangani', 1),
  ('/projects/zanzibar/gallery-2.jpg', 'Well installation and site work', 2),
  ('/projects/zanzibar/gallery-3.jpg', 'Residents benefiting from clean water', 3)
) AS g(url, alt, sort_order) ON TRUE;


-- Project 02 (ACTIVE)
-- Note: your caption says the well was completed in 2021.
-- For demo/testing of “Current Projects”, we’re treating this as ACTIVE for the *ongoing support/expansion phase*.
WITH p AS (
  INSERT INTO projects (
    slug, title, hero_blurb, short_desc, long_desc,
    status, card_image_url, main_image_url, display_order,
    created_at, updated_at
  )
  VALUES (
    'for-the-ummah-uganda',
    'For the Ummah',
    'Clean water access for families and schools in Matuga, Wakiso, Uganda—supported with our partners and community.',
    'A well of support for the Ummah—sustainable clean water access for families, schools, and the wider community (in partnership with Deham Foundation & Smile Project).',
    'Matuga, Wakiso, Uganda (2021)\n\n“From our struggle to yours, transforming pain into smiles.”\n\nFor the Ummah – A Well of Support\n• Installed a water well for families, schools, and the wider community\n• Provided sustainable clean water access\n• Partnered with Deham Foundation & Smile Project\n\nThis project represents ongoing care and continued impact—ensuring clean water remains accessible and maintained for the people it serves.',
    'ACTIVE',
    '/projects/uganda/card.jpg',
    '/projects/uganda/main.jpg',
    2,
    NOW(), NOW()
  )
  RETURNING id
)
INSERT INTO project_tags (project_id, tag)
SELECT p.id, t.tag
FROM p
JOIN (VALUES
  ('Water'),
  ('Uganda'),
  ('Wakiso'),
  ('Partnership'),
  ('Community Impact')
) AS t(tag) ON TRUE;

-- Gallery for Project 02
WITH p AS (
  SELECT id FROM projects WHERE slug = 'for-the-ummah-uganda'
)
INSERT INTO project_images (project_id, url, alt, kind, sort_order)
SELECT p.id, g.url, g.alt, 'GALLERY', g.sort_order
FROM p
JOIN (VALUES
  ('/projects/uganda/gallery-1.jpg', 'Water well site in Matuga, Wakiso', 1),
  ('/projects/uganda/gallery-2.jpg', 'Community access to clean water', 2),
  ('/projects/uganda/gallery-3.jpg', 'Partners and local support on-site', 3)
) AS g(url, alt, sort_order) ON TRUE;
