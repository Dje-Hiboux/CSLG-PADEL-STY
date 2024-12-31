/*
  # Correction des IDs des courts

  1. Changements
    - Suppression des courts existants
    - Création de nouveaux courts avec des UUIDs fixes
*/

-- Supprimer les courts existants
DELETE FROM courts;

-- Insérer les nouveaux courts avec des UUIDs fixes
INSERT INTO courts (id, name) VALUES
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Court 1'),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Court 2');