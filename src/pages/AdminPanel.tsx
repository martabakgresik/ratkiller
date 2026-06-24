import React, { useState } from 'react';
import { Save, AlertCircle, ArrowLeft, Loader2, Image as ImageIcon, Lock } from 'lucide-react';
import { AppConfig } from '../App';
import { Link } from 'react-router-dom';

export default function AdminPanel({ config: initialConfig }: { config: AppConfig | null }) {
  const [config, setConfig] = useState<Partial<AppConfig>>(initialConfig || {
    waNumber: "",
    headline: "",
    subheadline: "",
    maintenance: false,
    price: "",
    waMessage: "",
    promoBadge: "",
    heroImage: "",
    footerText: "",
    footerYear: "",
    featuresList: "",
    heroImagePosition: "top",
    themeColor: "black-red"
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Password salah!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const valueToSet = type === 'checkbox' ? checked : value;
    
    setConfig(prev => ({
      ...prev,
      [name]: valueToSet
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      setMessage({ type: 'success', text: 'Konfigurasi berhasil disimpan. Perubahan sudah sinkron dengan server.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan konfigurasi.' });
    } finally {
      setSaving(false);
    }
  };

  // Minimal file upload logic for R2 (mock or real)
  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files || e.target.files.length === 0) return;
     const file = e.target.files[0];
     setUploading(true);
     
     const formData = new FormData();
     formData.append('image', file);
     
     try {
       const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
       });
       if (res.ok) {
         const data = await res.json();
         alert(`Gambar berhasil diunggah ke R2. URL: ${data.url}\n(Gunakan URL ini di konten jika diperlukan)`);
       } else {
         alert("Gagal mengunggah gambar");
       }
     } catch (err) {
        alert("Gagal mengunggah gambar");
     } finally {
        setUploading(false);
     }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Login Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold flex items-center gap-2">
             Admin Panel
           </h1>
           <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
             <ArrowLeft className="w-4 h-4" /> Lihat Website
           </Link>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nomor WhatsApp</label>
                <input 
                  type="text" 
                  name="waNumber"
                  value={config.waNumber || ""}
                  onChange={handleChange}
                  placeholder="62812... (Tanpa +)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Teks Tombol/Pesan WhatsApp</label>
                <input 
                  type="text" 
                  name="waMessage"
                  value={config.waMessage || ""}
                  onChange={handleChange}
                  placeholder="Halo Admin..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Headline (Judul Utama)</label>
              <input 
                type="text" 
                name="headline"
                value={config.headline || ""}
                onChange={handleChange}
                placeholder="RatKiller"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Subheadline</label>
              <textarea 
                name="subheadline"
                value={config.subheadline || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Tikus mati kering..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">Gunakan baris baru untuk membuat baris baru di tampilan website.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Daftar Fitur / Target (Pisahkan dengan baris baru)</label>
              <textarea 
                name="featuresList"
                value={config.featuresList || ""}
                onChange={handleChange}
                rows={5}
                placeholder="Tikus Rumah&#10;Tikus Semak..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Harga / Berat (Badge)</label>
              <input 
                type="text" 
                name="price"
                value={config.price || ""}
                onChange={handleChange}
                placeholder="250 GRAM"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Teks Promo (Badge)</label>
              <input 
                type="text" 
                name="promoBadge"
                value={config.promoBadge || ""}
                onChange={handleChange}
                placeholder="AMPUH !"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">URL Gambar (Hero Image)</label>
              <input 
                type="text" 
                name="heroImage"
                value={config.heroImage || ""}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">Anda dapat menggunakan fitur Media Manager di bawah untuk mengunggah gambar dan menempelkan URL-nya ke sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Teks Footer</label>
                <input 
                  type="text" 
                  name="footerText"
                  value={config.footerText || ""}
                  onChange={handleChange}
                  placeholder="RatKiller. All rights reserved."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tahun Footer</label>
                <input 
                  type="text" 
                  name="footerYear"
                  value={config.footerYear || ""}
                  onChange={handleChange}
                  placeholder="2024"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Posisi Gambar (Hero Image)</label>
                <select
                  name="heroImagePosition"
                  value={config.heroImagePosition || "top"}
                  onChange={handleChange as any}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="top">Di Bawah Subheadline (Atas)</option>
                  <option value="left-above">Di Kolom Kiri (Di Atas Fitur)</option>
                  <option value="left-replace">Di Kolom Kiri (Sembunyikan Fitur)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tema Warna</label>
                <select
                  name="themeColor"
                  value={config.themeColor || "black-red"}
                  onChange={handleChange as any}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="black-red">Hitam (Aksen Merah)</option>
                  <option value="red-black">Merah (Aksen Hitam)</option>
                  <option value="white-black">Putih (Aksen Hitam)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Pengaturan Sistem</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="maintenance"
                    checked={!!config.maintenance}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">Aktifkan Mode Maintenance (Perbaikan)</span>
              </label>
            </div>

            <div className="pt-6 flex justify-end gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Menyimpan...' : 'Simpan Konfigurasi (Sync to D1)'}
              </button>
            </div>
          </form>
        </div>

        {/* Media Manager Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-gray-600" /> Media Manager (R2 Cloudflare)</h2>
           <p className="text-sm text-gray-600 mb-6">Unggah gambar ke Cloudflare R2 untuk digunakan di website.</p>
           
           <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                         <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                      ) : (
                         <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                         </svg>
                      )}
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{uploading ? 'Mengunggah...' : 'Klik untuk mengunggah'}</span> atau drag and drop</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
           </div>
        </div>

      </div>
    </div>
  );
}
