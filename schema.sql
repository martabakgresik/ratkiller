-- Create config_table for RatKiller landing page
CREATE TABLE IF NOT EXISTS config_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  waNumber TEXT,
  headline TEXT,
  subheadline TEXT,
  maintenance BOOLEAN DEFAULT 0,
  price TEXT,
  waMessage TEXT,
  promoBadge TEXT,
  heroImage TEXT,
  footerText TEXT,
  footerYear TEXT,
  featuresList TEXT,
  heroImagePosition TEXT,
  themeColor TEXT
);

-- Insert default configuration
INSERT INTO config_table (waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor)
VALUES (
  '6281234567890',
  'RatKiller',
  'Tikus mati kering, tanpa meninggalkan bau',
  0,
  '250 GRAM',
  'Halo Admin, saya tertarik untuk membeli RatKiller ukuran 250gr beserta bonusnya. Apakah stoknya masih tersedia?',
  'AMPUH !',
  '',
  'RatKiller. All rights reserved.',
  '2024',
  'Tikus Rumah
Tikus Semak
Tikus Got
Tikus Sawah',
  'top',
  'black-red'
);
