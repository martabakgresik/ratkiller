import React, { useState } from 'react';
import { Save, AlertCircle, ArrowLeft, Loader2, Image as ImageIcon, Lock, Eye, EyeOff, LayoutTemplate, CheckCircle } from 'lucide-react';
import { AppConfig } from '../App';
import { Link } from 'react-router-dom';

export default function AdminPanel({ config: initialConfig }: { config: AppConfig | null }) {
  const [config, setConfig] = useState<Partial<AppConfig>>(initialConfig || {
    waNumber: "",
    headline: "",
    subheadline: "",
    maintenance: false,
    price: "",
    weight: "250 GRAM",
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

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        const errorData = await res.json();
        alert(`Login gagal: ${errorData.error}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat login.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let valueToSet: string | boolean | number = value;
    if (type === 'checkbox') valueToSet = checked;
    if (type === 'range' || type === 'number') valueToSet = Number(value);
    
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
      const token = localStorage.getItem('admin_token');
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
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
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField?: 'logoUrl' | 'heroImage') => {
     if (!e.target.files || e.target.files.length === 0) return;
     const file = e.target.files[0];
     setUploading(true);
     setUploadedUrl(null);
     
     const formData = new FormData();
     formData.append('image', file);
     
     try {
       const token = localStorage.getItem('admin_token');
       const res = await fetch('/api/upload', {
         method: 'POST',
         headers: {
           "Authorization": token ? `Bearer ${token}` : ""
         },
         body: formData
       });
       if (res.ok) {
         const data = await res.json();
         setUploadedUrl(data.url);
         
         if (targetField) {
           setConfig(prev => {
             const newConfig = { ...prev, [targetField]: data.url };
             if (targetField === 'logoUrl') {
               newConfig.headerType = 'logo';
             }
             return newConfig;
           });
           setMessage({ type: 'success', text: `Gambar berhasil diunggah! Jangan lupa klik 'Simpan Perubahan' di bawah.` });
         }
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans relative">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        <div className="relative z-10">
          <div className="bg-neutral-900 p-8 rounded-3xl shadow-2xl border border-neutral-800 max-w-sm w-full">
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/10 p-4 rounded-full text-red-500 border border-red-500/20">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6 text-white">Login Admin</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-600/20">
                Masuk
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium text-sm">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 font-sans text-white relative pb-28">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold flex items-center gap-2">
             Admin Panel
           </h1>
           <div className="flex items-center gap-4">
             <Link to="/" className="flex items-center gap-2 text-red-600 hover:underline font-medium">
               <ArrowLeft className="w-4 h-4" /> Lihat Website
             </Link>
             <button 
               onClick={() => {
                 localStorage.removeItem('admin_token');
                 setIsAuthenticated(false);
               }} 
               className="text-red-500 hover:underline text-sm font-medium"
             >
               Logout
             </button>
           </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Nomor WhatsApp</label>
                <input 
                  type="text" 
                  name="waNumber"
                  value={config.waNumber || ""}
                  onChange={handleChange}
                  placeholder="62812... (Tanpa +)"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Teks Tombol/Pesan WhatsApp</label>
                <input 
                  type="text" 
                  name="waMessage"
                  value={config.waMessage || ""}
                  onChange={handleChange}
                  placeholder="Halo Admin..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-red-500" /> Pengaturan Header
                </h3>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-300">Tipe Header</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="headerType" 
                      value="text" 
                      checked={config.headerType === 'text' || !config.headerType}
                      onChange={handleChange}
                      className="text-red-500 focus:ring-red-500 bg-neutral-900 border-neutral-700" 
                    />
                    <span>Gunakan Teks (Headline)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="headerType" 
                      value="logo" 
                      checked={config.headerType === 'logo'}
                      onChange={handleChange}
                      className="text-red-500 focus:ring-red-500 bg-neutral-900 border-neutral-700" 
                    />
                    <span>Gunakan Logo Khusus</span>
                  </label>
                </div>
              </div>

              {config.headerType === 'logo' && (
                <div className="space-y-6 pt-4 border-t border-neutral-800/50">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300">URL Gambar Logo</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="logoUrl"
                        value={config.logoUrl || ""}
                        onChange={handleChange}
                        placeholder="https://... atau /logo.png"
                        className="flex-1 w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      />
                      <label className="flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl px-4 cursor-pointer transition-colors" title="Unggah Logo">
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : <ImageIcon className="w-5 h-5 text-neutral-400" />}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} disabled={uploading} />
                      </label>
                    </div>
                    <p className="text-xs text-neutral-500">Klik ikon gambar di sebelah kanan untuk langsung mengunggah foto logo.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-sm font-semibold text-neutral-300">Lebar Logo (Maksimal)</label>
                        <span className="text-sm text-red-400 font-mono">{config.logoWidth || 150}px</span>
                      </div>
                      <input 
                        type="range" 
                        name="logoWidth"
                        min="50" max="400" step="10"
                        value={config.logoWidth || 150}
                        onChange={handleChange}
                        className="w-full accent-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-sm font-semibold text-neutral-300">Tinggi Logo (Maksimal)</label>
                        <span className="text-sm text-red-400 font-mono">{config.logoHeight || 150}px</span>
                      </div>
                      <input 
                        type="range" 
                        name="logoHeight"
                        min="30" max="300" step="10"
                        value={config.logoHeight || 150}
                        onChange={handleChange}
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">Headline (Judul Utama)</label>
              <input 
                type="text" 
                name="headline"
                value={config.headline || ""}
                onChange={handleChange}
                placeholder="RatKiller"
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">Subheadline</label>
              <textarea 
                name="subheadline"
                value={config.subheadline || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Tikus mati kering..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <p className="text-xs text-neutral-500">Gunakan baris baru untuk membuat baris baru di tampilan website.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">Daftar Fitur / Target (Pisahkan dengan baris baru)</label>
              <textarea 
                name="featuresList"
                value={config.featuresList || ""}
                onChange={handleChange}
                rows={5}
                placeholder="Tikus Rumah&#10;Tikus Semak..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">Daftar Bonus (Format: Nama|Deskripsi, pisahkan baris baru)</label>
              <textarea 
                name="bonusItems"
                value={config.bonusItems || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Kaos Tangan|Keamanan ekstra...&#10;Tempat Umpan|Wadah khusus..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Harga (Rp)</label>
                <input 
                  type="text" 
                  name="price"
                  value={config.price || ""}
                  onChange={handleChange}
                  placeholder="Rp 75.000"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Ukuran / Berat (Badge)</label>
                <select
                  name="weight"
                  value={config.weight || "250 GRAM"}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none"
                >
                  <option value="100 GRAM">100 GRAM</option>
                  <option value="250 GRAM">250 GRAM</option>
                  <option value="500 GRAM">500 GRAM</option>
                  <option value="1 KG">1 KG</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">Teks Promo (Badge)</label>
              <input 
                type="text" 
                name="promoBadge"
                value={config.promoBadge || ""}
                onChange={handleChange}
                placeholder="AMPUH !"
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-300">URL Gambar (Hero Image)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="heroImage"
                  value={config.heroImage || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
                <label className="flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl px-4 cursor-pointer transition-colors" title="Unggah Hero Image">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : <ImageIcon className="w-5 h-5 text-neutral-400" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage')} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-neutral-500">Kosongkan jika tidak butuh hero image, atau klik ikon gambar untuk mengunggah.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Teks Footer</label>
                <input 
                  type="text" 
                  name="footerText"
                  value={config.footerText || ""}
                  onChange={handleChange}
                  placeholder="RatKiller. All rights reserved."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Tahun Footer</label>
                <input 
                  type="text" 
                  name="footerYear"
                  value={config.footerYear || ""}
                  onChange={handleChange}
                  placeholder="2024"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Posisi Gambar (Hero Image)</label>
                <select
                  name="heroImagePosition"
                  value={config.heroImagePosition || "top"}
                  onChange={handleChange as any}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                >
                  <option value="top">Di Bawah Subheadline (Atas)</option>
                  <option value="left-above">Di Kolom Kiri (Di Atas Fitur)</option>
                  <option value="left-replace">Di Kolom Kiri (Sembunyikan Fitur)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-300">Tema Warna</label>
                <select
                  name="themeColor"
                  value={config.themeColor || "black-red"}
                  onChange={handleChange as any}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                >
                  <option value="black-red">Hitam (Aksen Merah)</option>
                  <option value="red-black">Merah (Aksen Hitam)</option>
                  <option value="white-black">Putih (Aksen Hitam)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-6">
              <h3 className="text-sm font-semibold text-neutral-300 mb-4">Pengaturan Sistem</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="maintenance"
                    checked={!!config.maintenance}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-900 after:border-neutral-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </div>
                <span className="text-sm font-medium text-white">Aktifkan Mode Maintenance (Perbaikan)</span>
              </label>
              
              {config.maintenance && (
                <div className="mt-6 space-y-4 border-l-2 border-yellow-500 pl-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300">Pesan/Alasan Maintenance</label>
                    <textarea 
                      name="maintenanceReason"
                      value={config.maintenanceReason || ""}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Kami sedang melakukan pembaruan sistem..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-300">Batas Waktu (Hitung Mundur)</label>
                      <input 
                        type="datetime-local" 
                        name="maintenanceUntil"
                        value={config.maintenanceUntil || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                      />
                      <p className="text-xs text-neutral-500">Kosongkan jika tidak ingin ada hitung mundur.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-300">Nomor Kontak Darurat</label>
                      <input 
                        type="text" 
                        name="maintenanceContact"
                        value={config.maintenanceContact || ""}
                        onChange={handleChange}
                        placeholder="6281234567890"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
             <div className="text-sm font-medium text-neutral-400 hidden sm:block">
                {uploading ? <span className="text-red-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Mengunggah gambar...</span> : 'Jangan lupa simpan perubahan'}
             </div>
             <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setConfig(initialConfig)}
                  className="px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex-1 sm:flex-none text-center"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 py-2.5 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 flex-1 sm:flex-none text-center"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
             </div>
          </div>
        </div>

        {/* Developer Guide Section */}
        <div className="mt-8 bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6 md:p-8 text-neutral-200">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📖 Panduan Singkat (Cara Menjalankan Web)</h2>
           <div className="space-y-4 text-sm leading-relaxed">
             <p>Berikut adalah catatan perintah yang bisa Anda gunakan di terminal komputer Anda:</p>
             <ul className="list-disc pl-5 space-y-3">
               <li>
                 <strong>Mendesain Tampilan Cepat (Frontend Mode):</strong><br/>
                 Jalankan <code>npm run dev</code>. Sangat cepat, namun fitur simpan data & upload gambar (API) tidak akan berfungsi.
               </li>
               <li>
                 <strong>Menguji Website Sepenuhnya (Lokal Fullstack):</strong><br/>
                 Jalankan <code>npm run build</code>, lalu lanjutkan dengan <code>npm run preview</code>. Website bisa diakses di <code>http://localhost:8788</code> dengan semua fitur API menyala.
               </li>
               <li>
                 <strong>Publikasi ke Internet (Deploy):</strong><br/>
                 Jalankan <code>npm run deploy</code>. Proses ini otomatis akan membangun versi final dan mengunggahnya ke server Cloudflare.
               </li>
             </ul>
             <p className="mt-4 text-xs text-red-700 italic">*Catatan: Pastikan Anda telah menginstal NodeJS sebelum menjalankan perintah-perintah di atas.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
