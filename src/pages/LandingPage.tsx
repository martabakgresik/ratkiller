import { 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Hand, 
  Box, 
  AlertTriangle,
  BadgeCheck,
  ChevronDown,
  Truck,
  Rocket,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { AppConfig } from '../App';

const faqs = [
  {
    question: "Bagaimana cara pemakaian RatKiller?",
    answer: "Gunakan sarung tangan plastik yang disediakan. Letakkan umpan RatKiller pada wadah yang tersedia di area yang sering dilalui tikus atau dekat sarangnya. Tidak perlu dicampur dengan makanan lain."
  },
  {
    question: "Berapa lama efek racun mulai bekerja?",
    answer: "Tikus biasanya akan mati dalam waktu 3-5 hari setelah memakan umpan. Reaksi perlahan ini sangat penting agar tikus lain dalam kawanan tidak curiga terhadap umpan."
  },
  {
    question: "Kenapa tikus yang mati tidak menimbulkan bau?",
    answer: "RatKiller memiliki formula khusus yang bekerja menyerap cairan tubuh tikus. Tikus akan merasa sangat haus, mencari sumber air lalu mati dalam kondisi kering sehingga meminimalisir bau."
  },
  {
    question: "Apakah aman jika ada hewan peliharaan di rumah?",
    answer: "Pastikan selalu menjauhkan dari jangkauan anak-anak dan hewan peliharaan. Letakkan umpan di tempat yang tersembunyi dan gunakan wadah umpan agar lebih aman."
  }
];

function MaintenanceCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || !timeLeft) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center my-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-24 shadow-inner">
        <div className="text-3xl font-bold text-yellow-500">{timeLeft.days}</div>
        <div className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Hari</div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-24 shadow-inner">
        <div className="text-3xl font-bold text-yellow-500">{timeLeft.hours}</div>
        <div className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Jam</div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-24 shadow-inner">
        <div className="text-3xl font-bold text-yellow-500">{timeLeft.minutes}</div>
        <div className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Menit</div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-24 shadow-inner">
        <div className="text-3xl font-bold text-yellow-500">{timeLeft.seconds}</div>
        <div className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">Detik</div>
      </div>
    </div>
  );
}

export default function LandingPage({ config, isLoading }: { config: AppConfig | null, isLoading?: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans relative pb-28 flex flex-col items-center">
        {/* Background Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        <div className="relative z-10 max-w-4xl w-full mx-auto px-4 pt-12 pb-12 flex flex-col items-center">
          <div className="flex flex-col items-center text-center w-full relative animate-pulse">
            <div className="h-12 md:h-16 w-64 bg-neutral-800/80 rounded-lg mb-8"></div>
            <div className="h-16 md:h-20 w-80 bg-neutral-800/80 rounded-lg transform -skew-x-6 mb-8"></div>
            <div className="h-8 md:h-10 w-full max-w-lg bg-neutral-800/80 rounded-lg mb-4"></div>
            <div className="h-8 md:h-10 w-64 bg-neutral-800/80 rounded-lg mb-10"></div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mb-12">
              <div className="h-10 w-32 bg-neutral-800/80 rounded-full"></div>
              <div className="h-10 w-40 bg-neutral-800/80 rounded-full"></div>
              <div className="h-10 w-36 bg-neutral-800/80 rounded-full"></div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-pulse">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 h-96"></div>
            <div className="flex flex-col gap-8">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 h-64"></div>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 md:p-8 h-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: config?.headline || "RatKiller",
          text: "Ampuh membasmi tikus sampai mati kering tanpa bau!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (config?.maintenance) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Website Sedang Dalam Perbaikan</h1>
        <p className="text-gray-400 mb-2 max-w-lg mx-auto leading-relaxed">
          {config.maintenanceReason || "Kami sedang melakukan pembaruan sistem. Silakan kembali lagi nanti."}
        </p>
        
        {config.maintenanceUntil && <MaintenanceCountdown targetDate={config.maintenanceUntil} />}
        
        {config.maintenanceContact && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-neutral-400">Butuh bantuan darurat?</p>
            <a 
              href={`https://wa.me/${config.maintenanceContact}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full font-semibold text-white transition-all shadow-sm"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              Chat WhatsApp Admin
            </a>
          </div>
        )}
      </div>
    );
  }

  const waNumber = config?.waNumber || "6281234567890";
  const waMessage = config?.waMessage || "Halo Admin, saya tertarik untuk membeli RatKiller.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const featuresListRaw = config?.featuresList || "Tikus Rumah\nTikus Semak\nTikus Got\nTikus Sawah\nAman bagi hewan ternak atau peliharaan karena produk ini sudah diuji khusus";
  const features = featuresListRaw.split('\n').map(f => f.trim()).filter(f => f);

  const bonusItemsRaw = config?.bonusItems || "Kaos Tangan Plastik|Keamanan ekstra saat menyebar umpan.\nTempat Umpan|Wadah khusus agar area tetap bersih.\nMasker Pelindung|Melindungi pernapasan Anda saat menebar umpan.\nPanduan Penggunaan|Tips rahasia mencegah tikus kembali lagi.";
  const bonusItems = bonusItemsRaw.split('\n').map(b => b.trim()).filter(b => b);

  const heroImagePosition = config?.heroImagePosition || "top";

  const themeColors = {
    'black-red': {
      bg: 'bg-neutral-950 text-white',
      badgeBg: 'bg-red-600 text-white border-red-500 shadow-[0_10px_30px_rgba(220,38,38,0.4)]',
      selection: 'selection:bg-red-500 selection:text-white',
      accent: 'text-red-500',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      cardBg: 'bg-neutral-900 border-neutral-800',
      faqBg: 'bg-neutral-900/80 border-neutral-800',
      faqHover: 'hover:bg-neutral-800/50',
      footer: 'border-neutral-900 text-gray-500',
      textMuted: 'text-gray-400',
      textNormal: 'text-gray-200'
    },
    'red-black': {
      bg: 'bg-red-950 text-white',
      badgeBg: 'bg-neutral-900 text-white border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
      selection: 'selection:bg-neutral-900 selection:text-white',
      accent: 'text-gray-300',
      iconBg: 'bg-neutral-900/50',
      iconColor: 'text-gray-300',
      cardBg: 'bg-red-900 border-red-800',
      faqBg: 'bg-red-900/80 border-red-800',
      faqHover: 'hover:bg-red-800/50',
      footer: 'border-red-900 text-red-300',
      textMuted: 'text-red-200',
      textNormal: 'text-white'
    },
    'white-black': {
      bg: 'bg-gray-50 text-gray-900',
      badgeBg: 'bg-gray-900 text-white border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
      selection: 'selection:bg-gray-900 selection:text-white',
      accent: 'text-gray-900',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-900',
      cardBg: 'bg-white border-gray-200 shadow-xl',
      faqBg: 'bg-white border-gray-200',
      faqHover: 'hover:bg-gray-100',
      footer: 'border-gray-200 text-gray-500',
      textMuted: 'text-gray-600',
      textNormal: 'text-gray-800'
    }
  };

  const theme = themeColors[config?.themeColor || 'black-red'] || themeColors['black-red'];

  return (
    <div className={`min-h-screen ${theme.bg} font-sans relative pb-28 ${theme.selection}`}>
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-12 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center w-full relative"
        >
          {/* Share Button */}
          <button 
            onClick={handleShare}
            className={`absolute right-0 top-0 md:right-4 md:top-4 p-2.5 ${theme.iconColor} ${theme.iconBg} hover:opacity-80 backdrop-blur-md rounded-full border border-white/10 shadow-lg transition-all z-20`}
            aria-label="Bagikan"
          >
            <Share2 className="w-5 h-5" />
            <AnimatePresence>
              {showShareTooltip && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full right-0 mt-3 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow-lg border border-green-400 whitespace-nowrap"
                >
                  Link disalin!
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-green-500 rotate-45 border-l border-t border-green-400"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {config?.headerType === 'logo' && config?.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt={config.headline} 
              style={{ width: `${config.logoWidth}px`, height: `${config.logoHeight}px` }} 
              className="object-contain mb-6 drop-shadow-xl" 
            />
          ) : (
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-4 flex justify-center items-center gap-1 drop-shadow-lg ${theme.textNormal}`}>
              {config?.headline || "RatKiller"}
            </h1>
          )}

          {/* Headline Badge */}
          {config?.promoBadge && (
            <div className="bg-red-600 text-white font-black text-5xl md:text-7xl px-12 py-3 uppercase tracking-widest mb-6 border-b-4 border-red-700 shadow-xl">
              {config.promoBadge}
            </div>
          )}

          {/* Subheadline */}
          <h2 className={`text-2xl md:text-4xl font-bold text-center mb-10 max-w-2xl leading-snug drop-shadow-md ${theme.textNormal}`}>
            {config?.subheadline ? (
              <span dangerouslySetInnerHTML={{ __html: config.subheadline.replace('\n', '<br/>') }} />
            ) : (
              <>Tikus mati kering, <br className="hidden md:block"/> tanpa meninggalkan bau</>
            )}
          </h2>

          {/* Hero Image (Top Position) */}
          {config?.heroImage && heroImagePosition === 'top' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 w-full max-w-lg mx-auto"
            >
              <img src={config.heroImage} alt="RatKiller Hero" className="w-full h-auto rounded-3xl shadow-2xl border-4 border-black/10 object-cover" />
            </motion.div>
          )}

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mb-12"
          >
            <div className={`flex items-center gap-2 ${theme.cardBg} px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm`}>
              <Truck className="w-5 h-5 text-green-500" />
              <span className={`text-sm md:text-base font-semibold ${theme.textNormal}`}>Gratis Ongkir</span>
            </div>
            <div className={`flex items-center gap-2 ${theme.cardBg} px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm`}>
              <Rocket className="w-5 h-5 text-blue-500" />
              <span className={`text-sm md:text-base font-semibold ${theme.textNormal}`}>Pengiriman Cepat</span>
            </div>
            <div className={`flex items-center gap-2 ${theme.cardBg} px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm`}>
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm md:text-base font-semibold ${theme.textNormal}`}>Aman Terpercaya</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
          {/* Left Column - Product Features */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${theme.cardBg} border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden`}
          >
            {/* Weight Badge */}
            <div className={`${theme.badgeBg} absolute top-0 right-0 text-sm md:text-base font-black px-4 py-2 rounded-bl-2xl shadow-lg border-b border-l z-10`}>
              {config?.weight || "250 GRAM"}
            </div>

            {/* Hero Image (Left Position) */}
            {config?.heroImage && (heroImagePosition === 'left-above' || heroImagePosition === 'left-replace') && (
              <div className="mb-6 w-full mx-auto">
                <img src={config.heroImage} alt="RatKiller Hero" className="w-full h-auto rounded-2xl shadow-md border-2 border-black/10 object-cover" />
              </div>
            )}

            {heroImagePosition !== 'left-replace' && (
              <>
                <h3 className={`text-2xl font-bold mb-6 ${theme.accent} flex items-center gap-3`}>
                  <ShieldCheck className="w-7 h-7" /> Ampuh Membasmi:
                </h3>
                
                <ul className="space-y-4 mb-8">
                  {features.map((tikus, idx) => (
                    <motion.li 
                      key={tikus}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className={`flex items-center gap-4 text-lg md:text-xl font-medium ${theme.textNormal}`}
                    >
                      <div className={`${theme.iconBg} p-1 rounded-full`}>
                        <CheckCircle2 className={`w-6 h-6 ${theme.iconColor}`} />
                      </div>
                      {tikus}
                    </motion.li>
                  ))}
                </ul>
              </>
            )}

            {/* Price Display */}
            {config?.price && (
              <div className="mb-6 bg-red-600/10 border-2 border-red-500 rounded-2xl p-4 text-center shadow-inner">
                <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-1">Harga Spesial</p>
                <p className={`text-3xl md:text-4xl font-black ${theme.textNormal}`}>{config.price}</p>
              </div>
            )}

            <div className="bg-black/5 p-4 rounded-2xl border border-black/10 text-sm flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
              <p className={`leading-relaxed ${theme.textMuted}`}>Simpan di tempat yang sejuk & kering. Jauhkan dari sinar matahari secara langsung. Cuci tangan setelah memakai.</p>
            </div>
          </motion.div>

          {/* Right Column - Bonuses & Guarantee */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* Bonus Section */}
            <div className={`${theme.cardBg} border rounded-3xl p-6 md:p-8 shadow-2xl relative`}>
              <div className={`${theme.badgeBg} absolute -top-5 -right-4 font-black text-xl px-6 py-2 rounded-xl transform rotate-6 border-2 z-10`}>
                BONUS!
              </div>
              
              <h3 className={`text-xl md:text-2xl font-bold mb-8 border-b border-black/10 pb-4 ${theme.textNormal}`}>
                Setiap Pembelian Mendapatkan:
              </h3>
              
              <div className="space-y-8">
                {bonusItems.map((item, idx) => {
                  const [title, desc] = item.split('|');
                  return (
                    <div key={idx} className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center border border-black/10 shadow-inner shrink-0">
                        {idx === 0 ? <Hand className={`w-10 h-10 ${theme.iconColor}`} /> : <Box className={`w-10 h-10 ${theme.iconColor}`} />}
                      </div>
                      <div>
                        <h4 className={`text-lg md:text-xl font-bold mb-1 ${theme.textNormal}`}>{title || item}</h4>
                        {desc && <p className={`text-sm md:text-base ${theme.textMuted}`}>{desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guarantee Section */}
            <div className="relative overflow-hidden border-2 border-yellow-400 bg-yellow-400/10 rounded-3xl p-6 text-center shadow-[0_0_20px_rgba(250,204,21,0.15)] group">
              <div className="absolute inset-0 bg-yellow-400/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <BadgeCheck className="w-14 h-14 text-yellow-500 mx-auto mb-4 relative z-10" />
              <h3 className="text-2xl md:text-3xl font-black text-yellow-500 tracking-wide uppercase relative z-10">
                Garansi Uang Kembali
              </h3>
              <div className="w-16 h-1 bg-yellow-400/30 mx-auto my-3 relative z-10"></div>
              <p className="text-yellow-600 font-bold text-lg md:text-xl relative z-10">
                Jika tidak terbukti efektif!
              </p>
            </div>
          </motion.div>

        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl mx-auto mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className={`text-3xl md:text-4xl font-black mb-2 ${theme.textNormal}`}>Pertanyaan Umum</h3>
            <p className={`${theme.textMuted}`}>Informasi seputar penggunaan RatKiller</p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${theme.faqBg} border rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none ${theme.faqHover} transition-colors`}
                >
                  <span className={`font-bold text-lg pr-4 ${theme.textNormal}`}>{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 ${theme.textMuted} transition-transform duration-300 flex-shrink-0 ${openFaq === index ? `rotate-180 ${theme.accent}` : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`px-6 pb-6 leading-relaxed border-t border-black/10 pt-4 text-sm md:text-base ${theme.textMuted}`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className={`text-center py-6 border-t mt-8 relative z-10 ${theme.footer}`}>
        <p>© {config?.footerYear || new Date().getFullYear()} {config?.footerText || "RatKiller. All rights reserved."}</p>
      </footer>

      {/* Floating Circular WhatsApp CTA (Bottom Right) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-20 h-20 rounded-full transition-all transform hover:-translate-y-1"
          aria-label="Pesan via WhatsApp"
        >
          <img src="/WhatsApp-Logo.svg" alt="WhatsApp" className="w-[140%] h-[140%] max-w-none animate-pulse drop-shadow-lg object-contain" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-800">
            Pesan Sekarang!
            <div className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45 border-r border-t border-gray-800"></div>
          </span>
        </a>
      </motion.div>
    </div>
  );
}

