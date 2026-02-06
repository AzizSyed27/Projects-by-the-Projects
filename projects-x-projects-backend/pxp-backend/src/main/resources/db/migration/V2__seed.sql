INSERT INTO projects (slug, title, hero_blurb, short_desc, long_desc, status, project_tags, card_image_url, main_image_url, display_order)
VALUES
('clean-water-malawi', 'CLEAN WATER FOR MALAWI',
 'A hand-pump well brings clean water, time, and dignity.',
 'A hand pump project bringing safe water to a village in Malawi.',
 'A village in Malawi walked miles each day for water that often made them sick... (replace with your real long description)',
 'ACTIVE',
 'Water, Infrastructure, Malawi',
 NULL,
 NULL,
 1),

('wells-of-access', 'WELLS OF ACCESS',
 'A well restoring access for families in rural communities.',
 'A well restoring clean water access for families.',
 'Long description goes here...',
 'COMPLETED',
 'Water, Niger, Access, Clean Water',
 NULL,
 NULL,
 2);

-- Add a few gallery images for the Malawi project
INSERT INTO project_images (project_id, url, alt, kind, sort_order)
SELECT p.id, 'https://example.com/gallery-1.jpg', 'Field photo 1', 'GALLERY', 1
FROM projects p WHERE p.slug = 'clean-water-malawi';

INSERT INTO project_images (project_id, url, alt, kind, sort_order)
SELECT p.id, 'https://example.com/gallery-2.jpg', 'Field photo 2', 'GALLERY', 2
FROM projects p WHERE p.slug = 'clean-water-malawi';