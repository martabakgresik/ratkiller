// Initial config fallback
let localConfig = {
  waNumber: "6281234567890",
  headline: "RatKiller",
  subheadline: "Tikus mati kering, tanpa meninggalkan bau",
  maintenance: false,
  price: "Rp 75.000",
  weight: "250 GRAM",
  waMessage: "Halo Admin, saya tertarik untuk membeli RatKiller ukuran 250gr beserta bonusnya. Apakah stoknya masih tersedia?",
  promoBadge: "AMPUH !",
  heroImage: "",
  footerText: "RatKiller. All rights reserved.",
  footerYear: new Date().getFullYear().toString(),
  featuresList: "Tikus Rumah\nTikus Semak\nTikus Got\nTikus Sawah",
  heroImagePosition: "top",
  themeColor: "black-red",
  headerType: "text",
  logoUrl: "",
  logoWidth: 150,
  logoHeight: 150
};

export async function onRequestGet(context: any) {
  try {
    const { env } = context;
    const { results } = await env.DB.prepare("SELECT * FROM config_table LIMIT 1").all();
    
    if (results && results.length > 0) {
      return Response.json(results[0]);
    } else {
      return Response.json(localConfig);
    }
  } catch (error) {
    console.error(error);
    // If table doesn't exist, return fallback
    if (String(error).includes("no such table")) {
      return Response.json(localConfig);
    }
    return new Response(JSON.stringify({ error: "Failed to fetch config" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}

import { extractToken, verifyToken } from '../utils/jwt';

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    
    // Auth check
    const token = extractToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing token" }), { status: 401, headers: { "Content-Type": "application/json" }});
    }
    
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401, headers: { "Content-Type": "application/json" }});
    }

    const body = await request.json();
    
    // Default values for all fields to prevent undefined D1 binding errors
    const waNumber = body.waNumber ?? "";
    const headline = body.headline ?? "";
    const subheadline = body.subheadline ?? "";
    const maintenance = body.maintenance ?? false;
    const price = body.price ?? "";
    const weight = body.weight ?? "";
    const waMessage = body.waMessage ?? "";
    const promoBadge = body.promoBadge ?? "";
    const heroImage = body.heroImage ?? "";
    const footerText = body.footerText ?? "";
    const footerYear = body.footerYear ?? "";
    const featuresList = body.featuresList ?? "";
    const bonusItems = body.bonusItems ?? "";
    const heroImagePosition = body.heroImagePosition ?? "top";
    const themeColor = body.themeColor ?? "black-red";
    const maintenanceReason = body.maintenanceReason ?? "";
    const maintenanceContact = body.maintenanceContact ?? "";
    const maintenanceUntil = body.maintenanceUntil ?? "";
    const headerType = body.headerType ?? "text";
    const logoUrl = body.logoUrl ?? "";
    const logoWidth = body.logoWidth ?? 150;
    const logoHeight = body.logoHeight ?? 150;
    
    // Create table if not exists
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS config_table (id INTEGER PRIMARY KEY, waNumber TEXT, headline TEXT, subheadline TEXT, maintenance BOOLEAN, price TEXT, weight TEXT, waMessage TEXT, promoBadge TEXT, heroImage TEXT, footerText TEXT, footerYear TEXT, featuresList TEXT, bonusItems TEXT, heroImagePosition TEXT, themeColor TEXT, maintenanceReason TEXT, maintenanceContact TEXT, maintenanceUntil TEXT, headerType TEXT, logoUrl TEXT, logoWidth INTEGER, logoHeight INTEGER)`).run();
    
    // Try to alter table to add new columns if it was created before this update
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN weight TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN bonusItems TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN maintenanceReason TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN maintenanceContact TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN maintenanceUntil TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN headerType TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN logoUrl TEXT`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN logoWidth INTEGER`).run(); } catch (e) {}
    try { await env.DB.prepare(`ALTER TABLE config_table ADD COLUMN logoHeight INTEGER`).run(); } catch (e) {}
    
    // Clear and insert new config
    await env.DB.prepare(`DELETE FROM config_table`).run();
    
    await env.DB.prepare(
      `INSERT INTO config_table (waNumber, headline, subheadline, maintenance, price, weight, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, bonusItems, heroImagePosition, themeColor, maintenanceReason, maintenanceContact, maintenanceUntil, headerType, logoUrl, logoWidth, logoHeight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      waNumber, headline, subheadline, maintenance, price, weight, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, bonusItems, heroImagePosition, themeColor, maintenanceReason, maintenanceContact, maintenanceUntil, headerType, logoUrl, logoWidth, logoHeight
    ).run();

    return Response.json({ success: true, config: body });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update config" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
