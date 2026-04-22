"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail, RefreshCw } from 'lucide-react';

// --- 1. 配置参数 (Production Config) ---
const PROJECT_ID = 'u6xbvj35';
const DATASET = 'production';
const API_VERSION = '2024-04-21';

// 苹果级图片动态优化引擎
const optimizeImage = (url: string, width = 1200, quality = 80) => {
  if (!url) return ""; 
  return `${url}?w=${width}&q=${quality}&auto=format&fit=max`;
};

// --- 2. 动画钩子 (修复缩放导致的隐藏 Bug) ---
const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { threshold: 0.05, rootMargin: '100px' }); 
    
    const { current } = domRef;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);
  
  return [domRef, isVisible] as const;
};

const FadeInSection = ({ children, delay = 0, className = "" }: any) => {
  const [ref, isVisible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out w-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 md:translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- 3. 页面组件 ---

// 【首页】
const Home = ({ collections, settings }: { collections: any[], settings: any }) => {
  const heroImg = optimizeImage(settings?.heroImage || collections[0]?.coverImage, 2000, 85);
  const mainTitle = settings?.mainTitle || "leapday";
  const subTitle = settings?.subtitle || "";

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden w-full">
      <div className="relative h-[100svh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {heroImg && (
            <img 
              src={heroImg} 
              alt="Hero" 
              className="w-full h-full object-cover opacity-50 md:opacity-40 scale-105 animate-pulse-slow transition-opacity duration-1000"
              loading="eager" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center px-4 w-full max-w-[95vw] mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#E7B84A] drop-shadow-2xl mb-4 leading-tight text-balance">
            {mainTitle}
          </h1>
          {subTitle && (
            <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] md:text-sm font-light mt-2 opacity-80">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32">
        <FadeInSection>
          <div className="flex justify-between items-end mb-12 md:mb-20 border-b border-white/10 pb-8">
            <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-left">最新记录</h2>
            <a href="#archive" className="text-[10px] md:text-xs text-gray-500 hover:text-[#E7B84A] transition-all uppercase tracking-widest flex items-center gap-2 py-2 whitespace-nowrap">
              <LayoutGrid size={14} /> <span className="hidden sm:inline">查看</span> 全部归档
            </a>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 w-full text-left">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 100}>
              <a href={`#detail-${collection._id}`} className="group cursor-pointer block w-full">
                <div className="relative overflow-hidden rounded-sm aspect-[4/5] mb-6 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
                  {collection.coverImage && (
                    <img 
                      src={optimizeImage(collection.coverImage, 1000)} 
                      alt={collection.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block"
                       style={{ background: `linear-gradient(to top, ${collection.dominantColor}aa, transparent)` }} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 w-full text-left">
                  <div className="pr-4 flex-1 text-left">
                    <h3 className="text-xl md:text-2xl font-medium mb-2 group-hover:text-[#E7B84A] transition-colors leading-tight tracking-tight">{collection.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed line-clamp-2">{collection.shortIntro}</p>
                  </div>
                  <span className="text-gray-500 text-[10px] md:text-xs font-mono mt-1 shrink-0 sm:text-right">{collection.date}</span>
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

  if (!collection) return null;

  return (
    <div className="min-h-screen text-white relative bg-[#0a0a0a] overflow-x-hidden w-full">
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 opacity-40 md:opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${collection.dominantColor || '#222'} 0%, transparent 70%)`,
          filter: 'blur(120px)', 
          transform: 'translateZ(0)' 
        }}
      />

      <div className="relative z-10 w-full">
        <nav className="fixed top-0 left-0 w-full px-5 py-4 md:px-8 z-50 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
          <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2">
            <ArrowLeft size={16} /> 返回
          </a>
          <div className="text-[#E7B84A] font-bold tracking-[0.3em] text-sm md:text-lg uppercase">leapday</div>
        </nav>

        <div className="pt-32 pb-16 md:pt-48 md:pb-32 w-full px-5 md:px-8 max-w-5xl mx-auto">
          <FadeInSection>
            <div className="mb-16 md:mb-20 text-left max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-6 tracking-tight leading-tight text-balance">{collection.title}</h1>
              <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed mb-8">{collection.shortIntro}</p>
              <div className="flex justify-start items-center gap-4 text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">
                <span>{collection.date}</span>
                <div className="flex gap-2 flex-wrap">
                  {collection.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 border border-white/10 bg-white/5 rounded-full text-white/60">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <div className="space-y-6 md:space-y-32 flex flex-col items-center w-full pb-32">
          {collection.images?.map((imgSrc: string, idx: number) => (
            <FadeInSection key={idx} className="w-full max-w-6xl mx-auto px-0 md:px-8">
              <div className="w-full bg-gray-900 md:rounded-sm min-h-[40vh] flex items-center justify-center overflow-hidden">
                <img 
                  src={optimizeImage(imgSrc, 1600)} 
                  alt={`${collection.title} - ${idx + 1}`}
                  className="w-full h-auto object-cover md:rounded-sm shadow-2xl transition-all duration-1000"
                  loading="lazy"
                />
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 【归档页】
const Archive = ({ collections }: { collections: any[] }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 px-5 md:p-12 w-full">
      <nav className="flex justify-between items-center mb-16 pt-12 md:pt-0">
        <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2">
          <ArrowLeft size={16} /> 首页
        </a>
        <h1 className="text-base md:text-xl tracking-[0.3em] font-normal uppercase">作品归档</h1>
      </nav>

      <div className="w-full max-w-7xl mx-auto text-left">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {collections.map((collection: any) => (
            <FadeInSection key={collection._id}>
              <a href={`#detail-${collection._id}`} className="group block text-left">
                <div className="relative aspect-square overflow-hidden mb-3 bg-gray-900 rounded-sm w-full">
                  <img src={optimizeImage(collection.coverImage, 500)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <h3 className="text-xs md:text-sm font-medium group-hover:text-[#E7B84A] transition-colors line-clamp-1 tracking-tight text-left">{collection.title}</h3>
                <span className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-tighter text-left block">{collection.date}</span>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. 核心调度与路由系统 ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [dataState, setDataState] = useState<{
    collections: any[];
    settings: any;
    loading: boolean;
    error: boolean;
  }>({
    collections: [],
    settings: null,
    loading: true,
    error: false,
  });

  const fetchData = async () => {
    setDataState(prev => ({ ...prev, loading: true, error: false }));
    try {
      const query = `*[_type == "collection" && defined(coverImage)] | order(date desc) {
        _id, title, date, shortIntro, tags,
        "dominantColor": coverImage.asset->metadata.palette.darkMuted.background,
        "coverImage": coverImage.asset->url,
        "images": images[].asset->url
      }`;
      const settingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0] {
        mainTitle, subtitle, "heroImage": heroImage.asset->url
      }`;

      const fullQuery = encodeURIComponent(`{
        "collections": ${query},
        "settings": ${settingsQuery}
      }`);

      const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${fullQuery}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('API Request Failed');
      
      const { result } = await response.json();
      
      const formattedData = result.collections.map((item: any) => ({
        ...item, dominantColor: item.dominantColor || '#222222'
      }));
      
      setDataState({ collections: formattedData, settings: result.settings, loading: false, error: false });
    } catch (err) {
      // 彻底移除会导致 Vercel 类型报错的 mock 数据，直接让应用优雅降级为展示重试错误页
      console.error("Data Fetch Error:", err);
      setDataState(prev => ({ ...prev, loading: false, error: true }));
    }
  };

  useEffect(() => {
    fetchData();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) { setCurrentRoute('home'); setActiveId(null); }
      else if (hash === 'archive') { setCurrentRoute('archive'); }
      else if (hash.startsWith('detail-')) { setCurrentRoute('detail'); setActiveId(hash.replace('detail-', '')); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (dataState.error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-gray-500 font-mono text-xs">
        <p className="mb-4 tracking-widest uppercase opacity-60">连接数据库失败</p>
        <button onClick={fetchData} className="px-6 py-2 border border-gray-800 rounded-full hover:border-[#E7B84A] transition-colors flex items-center gap-2">
          <RefreshCw size={14} /> 点击重试
        </button>
      </div>
    );
  }

  if (dataState.loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-8 h-8 border-t-2 border-[#E7B84A] rounded-full animate-spin"></div>
        <p className="tracking-[0.3em] text-[10px] text-gray-500 font-light uppercase">同步中</p>
      </div>
    </div>
  );

  const activeCollection = dataState.collections.find((c: any) => c._id === activeId);

  return (
    <div className="antialiased bg-[#0a0a0a] min-h-screen">
      {currentRoute === 'home' && <Home collections={dataState.collections} settings={dataState.settings} />}
      {currentRoute === 'detail' && activeCollection && <GalleryDetail collection={activeCollection} />}
      {currentRoute === 'archive' && <Archive collections={dataState.collections} />}
      
      <footer className="bg-black text-gray-600 py-20 w-full text-center flex flex-col items-center gap-8 border-t border-white/5">
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#E7B84A] transition-colors p-2"><Mail size={18} strokeWidth={1.5} /></a>
        </div>
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-50 px-4 leading-loose">
          © {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.<br/>
          CAPTURING MOMENTS THROUGH THE LENS.
        </p>
      </footer>
    </div>
  );
}
