// Initial config fallback
let localConfig = {
  waNumber: "6281234567890",
  headline: "RatKiller",
  subheadline: "Tikus mati kering, tanpa meninggalkan bau",
  maintenance: false,
  price: "250 GRAM",
  waMessage: "Halo Admin, saya tertarik untuk membeli RatKiller ukuran 250gr beserta bonusnya. Apakah stoknya masih tersedia?",
  promoBadge: "AMPUH !",
  heroImage: "",
  footerText: "RatKiller. All rights reserved.",
  footerYear: new Date().getFullYear().toString(),
  featuresList: "Tikus Rumah\nTikus Semak\nTikus Got\nTikus Sawah",
  heroImagePosition: "top",
  themeColor: "black-red"
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

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    const { waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor } = body;
    
    // Create table if not exists
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS config_table (id INTEGER PRIMARY KEY, waNumber TEXT, headline TEXT, subheadline TEXT, maintenance BOOLEAN, price TEXT, waMessage TEXT, promoBadge TEXT, heroImage TEXT, footerText TEXT, footerYear TEXT, featuresList TEXT, heroImagePosition TEXT, themeColor TEXT)`).run();
    
    // Clear and insert new config
    await env.DB.prepare(`DELETE FROM config_table`).run();
    
    await env.DB.prepare(
      `INSERT INTO config_table (waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor
    ).run();

    return Response.json({ success: true, config: body });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update config" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
