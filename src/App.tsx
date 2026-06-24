import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./pages/AdminPanel";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export type AppConfig = {
  waNumber: string;
  headline: string;
  subheadline: string;
  maintenance: boolean | number;
  price: string;
  waMessage: string;
  promoBadge: string;
  heroImage: string;
  footerText: string;
  footerYear: string;
  featuresList: string;
  heroImagePosition: "top" | "left-replace" | "left-above";
  themeColor: "black-red" | "red-black" | "white-black";
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
