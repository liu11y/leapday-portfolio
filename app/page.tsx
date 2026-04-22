"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail, RefreshCw } from 'lucide-react';

const PROJECT_ID = 'u6xbvj35';
const DATASET = 'production';
const API_VERSION = '2024-04-21';

// 苹果级图片优化
const optimizeImage = (url: string, width = 1200, quality = 80) => {
  if (!url) return ""; 
  return `${url}?w=${width}&q=${quality}&auto=format&fit=max`;
};

// 动画钩子
const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.05, rootMargin: '100px' }); 
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);
  return [domRef, isVisible] as const;
};

const FadeInSection = ({ children, delay = 0, className = "" }: any) => {
  const [ref, isVisible] = useFadeIn();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// 【首页组件】
const Home = ({ collections, settings }: { collections: any[], settings: any }) => {
  const heroImg = optimizeImage(settings?.heroImage || collections[0]?.coverImage, 2000, 85);
  const heroVideo = settings?.heroVideo; // 获取视频 URL

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden w-full font-sans">
      <div className="relative h-[100svh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {/* 视频优先逻辑：必须 muted 和 playsInline 才能在手机端自动播放 */}
          {heroVideo ? (
            <video 
              src={heroVideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
              poster={heroImg}
              className="w-full h-full object-cover opacity-60 scale-105"
            />
          ) : heroImg ? (
            <img src={heroImg} className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center px-4">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-normal tracking-tight text-[#E7B84A] drop-shadow-2xl mb-4 leading-tight text-balance">
            {settings?.mainTitle || "NEO DREAM"}
          </h1>
          <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] md:text-sm font-light mt-2 opacity-80">
            {settings?.subtitle || "A PHOTOGRAPHY JOURNAL"}
          </p>
        </div>
      </div>

      {/* 列表区域 (保持之前的左对齐排版) */}
      <div className="w-full max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32">
        <FadeInSection className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <h2 className="text-2xl md:text-4xl font-normal tracking-tight">最新记录</h2>
          <a href="#archive" className="text-[10px] md:text-xs text-gray-400 hover:text-[#E7B84A] transition-colors uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={14} /> 全部归档
          </a>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 100}>
              <a href={`#detail-${collection._id}`} className="group block">
                <div className="relative aspect-[4/5] mb-6 bg-gray-900 rounded-sm overflow-hidden shadow-2xl">
                  <img src={optimizeImage(collection.coverImage, 1000)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-medium group-hover:text-[#E7B84A] transition-colors">{collection.title}</h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light mt-1 line-clamp-2">{collection.shortIntro}</p>
                  </div>
                  <span className="text-gray-600 text-[10px] font-mono mt-1 shrink-0">{collection.date}</span>
                </div>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 【详情页】
const GalleryDetail = ({ collection }: { collection: any }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [collection?._id]);
  return (
    <div className="min-h-screen text-white relative bg-[#0a0a0a] overflow-x-hidden w-full">
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 opacity-40"
           style={{ background: `radial-gradient(circle at 50% 30%, ${collection.dominantColor || '#222'} 0%, transparent 70%)`, filter: 'blur(120px)' }} />
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 w-full px-5 py-4 z-50 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
          <a href="#" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold"><ArrowLeft size={16} /> 返回</a>
          <div className="text-[#E7B84A] font-bold tracking-widest uppercase">leapday</div>
        </nav>
        <div className="pt-48 pb-32 px-5 max-w-5xl mx-auto text-center">
          <FadeInSection>
            <h1 className="text-4xl md:text-7xl font-normal mb-8 tracking-tight leading-tight">{collection.title}</h1>
            <p className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto">{collection.shortIntro}</p>
            <div className="flex justify-center gap-4 mt-10 text-[10px] font-mono text-gray-500 uppercase">
              <span>{collection.date}</span>
              <div className="flex gap-2">
                {collection.tags?.map((tag: string) => <span key={tag} className="px-3 py-1 border border-white/10 bg-white/5 rounded-full">{tag}</span>)}
              </div>
            </div>
          </FadeInSection>
        </div>
        <div className="space-y-12 md:space-y-32 flex flex-col items-center pb-32">
          {collection.images?.map((imgSrc: string, idx: number) => (
            <FadeInSection key={idx} className="w-full max-w-6xl px-0 md:px-8">
              <img src={optimizeImage(imgSrc, 1600)} className="w-full h-auto shadow-2xl md:rounded-sm" />
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 调度系统 ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dataState, setDataState] = useState<{ collections: any[], settings: any, loading: boolean }>({ collections: [], settings: null, loading: true });

  const fetchData = async () => {
    try {
      const query = encodeURIComponent(`{
        "collections": *[_type == "collection" && defined(coverImage)] | order(date desc) {
          _id, title, date, shortIntro, tags,
          "dominantColor": coverImage.asset->metadata.palette.darkMuted.background,
          "coverImage": coverImage.asset->url, "images": images[].asset->url
        },
        "settings": *[_type == "siteSettings"][0] {
          mainTitle, subtitle, "heroImage": heroImage.asset->url, "heroVideo": heroVideo.asset->url
        }
      }`);
      const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`);
      const { result } = await res.json();
      setDataState({ collections: result.collections, settings: result.settings, loading: false });
    } catch (err) {
      setDataState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) { setCurrentRoute('home'); setActiveId(null); }
      else if (hash.startsWith('detail-')) { setCurrentRoute('detail'); setActiveId(hash.replace('detail-', '')); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (dataState.loading) return <div className="h-screen bg-black flex items-center justify-center text-[#E7B84A] animate-pulse uppercase tracking-[0.3em] text-xs">Syncing</div>;

  const activeCollection = dataState.collections.find((c: any) => c._id === activeId);

  return (
    <div className="antialiased">
      {currentRoute === 'home' && <Home collections={dataState.collections} settings={dataState.settings} />}
      {currentRoute === 'detail' && activeCollection && <GalleryDetail collection={activeCollection} />}
      <footer className="bg-black text-gray-700 py-24 text-center border-t border-white/5">
        <p className="text-[10px] font-mono tracking-widest uppercase opacity-50">© {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
