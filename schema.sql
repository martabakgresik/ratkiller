-- Create config_table for RatKiller landing page
CREATE TABLE IF NOT EXISTS config_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  waNumber TEXT,
  headline TEXT,
  subheadline TEXT,
  maintenance BOOLEAN DEFAULT 0,
  price TEXT,
  weight TEXT,
  waMessage TEXT,
  promoBadge TEXT,
  heroImage TEXT,
  footerText TEXT,
  footerYear TEXT,
  featuresList TEXT,
  bonusItems TEXT,
  heroImagePosition TEXT,
  themeColor TEXT,
  maintenanceReason TEXT,
  maintenanceContact TEXT,
  maintenanceUntil TEXT,
  headerType TEXT,
  logoUrl TEXT,
  logoWidth INTEGER,
  logoHeight INTEGER
);

-- Insert default configuration
INSERT INTO config_table (waNumber, headline, subheadline, maintenance, price, weight, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, bonusItems, heroImagePosition, themeColor, maintenanceReason, maintenanceContact, maintenanceUntil, headerType, logoUrl, logoWidth, logoHeight)
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
