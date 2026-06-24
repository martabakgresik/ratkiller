import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

const upload = multer({ storage: multer.memoryStorage() });

async function queryD1(sql: string, params: any[] = []) {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_D1_DATABASE_ID } = process.env;
  
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !CLOUDFLARE_D1_DATABASE_ID) {
    console.warn("Cloudflare D1 credentials missing, using local fallback.");
    return null;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });

  if (!response.ok) {
    throw new Error(`D1 Query failed: ${response.statusText}`);
  }

  return response.json();
}

async function uploadToR2(file: Express.Multer.File, key: string) {
  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME } = process.env;

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET_NAME) {
    console.warn("Cloudflare R2 credentials missing, using local mock.");
    return `/mock-uploads/${key}`;
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  const publicUrl = process.env.R2_PUBLIC_URL || R2_ENDPOINT;
  return `${publicUrl}/${key}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/config", async (req, res) => {
    try {
      const d1Data = await queryD1("SELECT * FROM config_table LIMIT 1");
      if (d1Data && d1Data.result[0].results.length > 0) {
        res.json(d1Data.result[0].results[0]);
      } else {
        res.json(localConfig);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const { waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor } = req.body;
      localConfig = { ...localConfig, ...req.body };

      // Try updating D1 if configured
      const { CLOUDFLARE_ACCOUNT_ID } = process.env;
      if (CLOUDFLARE_ACCOUNT_ID) {
         // Create table if not exists (simple approach)
         await queryD1(`CREATE TABLE IF NOT EXISTS config_table (id INTEGER PRIMARY KEY, waNumber TEXT, headline TEXT, subheadline TEXT, maintenance BOOLEAN, price TEXT, waMessage TEXT, promoBadge TEXT, heroImage TEXT, footerText TEXT, footerYear TEXT, featuresList TEXT, heroImagePosition TEXT, themeColor TEXT)`);
         await queryD1(`DELETE FROM config_table`);
         await queryD1(`INSERT INTO config_table (waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
           [waNumber, headline, subheadline, maintenance, price, waMessage, promoBadge, heroImage, footerText, footerYear, featuresList, heroImagePosition, themeColor]);
      }

      res.json({ success: true, config: localConfig });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filename = `${Date.now()}-${req.file.originalname}`;
      const url = await uploadToR2(req.file, filename);
      res.json({ url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
