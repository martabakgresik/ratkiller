import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./pages/AdminPanel";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export interface AppConfig {
  waNumber: string;
  headline: string;
  subheadline: string;
  maintenance: boolean;
  price: string;
  weight: string;
  waMessage: string;
  promoBadge: string;
  heroImage: string;
  footerText: string;
  footerYear: string;
  featuresList: string;
  bonusItems: string;
  heroImagePosition: 'top' | 'left-above' | 'left-replace';
  headerType: 'text' | 'logo';
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  themeColor: 'black-white' | 'black-yellow' | 'black-red' | 'blue-white' | 'green-white';
  maintenanceReason?: string;
  maintenanceContact?: string;
  maintenanceUntil?: string;
}

// Ensure default fallback config
export const initialConfig: AppConfig = {
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
  bonusItems: "Kaos Tangan Plastik|Keamanan ekstra saat menyebar umpan.\nTempat Umpan|Wadah khusus agar area tetap bersih.",
  heroImagePosition: "top",
  headerType: "text",
  logoUrl: "",
  logoWidth: 150,
  logoHeight: 150,
  themeColor: "black-red",
  maintenanceReason: "Kami sedang melakukan pembaruan sistem dan penambahan fitur baru.",
  maintenanceContact: "6281234567890",
  maintenanceUntil: ""
};

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        // Convert integer boolean from sqlite to real boolean
        if (typeof data.maintenance === 'number') {
           data.maintenance = data.maintenance === 1;
        }
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch config", err);
        setConfig(initialConfig);
        setLoading(false);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage config={config} isLoading={loading} />} />
        <Route path="/admin-panel" element={
          loading ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : (
            <AdminPanel config={config} />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}
