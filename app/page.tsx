"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail, RefreshCw } from 'lucide-react';

// --- 1. 配置参数 ---
const PROJECT_ID = 'u6xbvj35';
const DATASET = 'production';

// 防御性图片优化
const optimizeImage = (url: string, width = 1200, quality = 80) => {
  if (!url) return ""; 
  return `${url}?w=${width}&q=${quality}&auto=format&fit=max`;
};

// --- 2. 动画组件 ---
const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    }, { threshold: 0.1 }); 
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
const Home = ({ collections, settings }: any) => {
  const heroImg = optimizeImage(settings?.heroImage || collections[0]?.coverImage, 2000, 80);
  const mainTitle = settings?.mainTitle || "leapday";
  const subTitle = settings?.subtitle || "";

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden w-full">
      {/* 英雄区 */}
      <div className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
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
        
        <div className="relative z-10 text-center flex flex-col items-center px-6 w-full">
          {/* 核心改动：font-normal (400) + tracking-tight (苹果味字间距) */}
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-normal tracking-tight text-[#E7B84A] drop-shadow-2xl mb-4 w-full break-words">
            {mainTitle}
          </h1>
          {subTitle && (
            <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] md:text-sm font-light mt-2">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      {/* 列表网格 */}
      <div className="w-full max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32">
        <FadeInSection>
          <div className="flex justify-between items-end mb-10 md:mb-16 border-b border-white/10 pb-6 md:pb-8">
            <h2 className="text-2xl md:text-4xl font-normal tracking-tight">Latest Stories</h2>
            <a href="#archive" className="text-[10px] md:text-xs text-gray-500 hover:text-[#E7B84A] transition-all uppercase tracking-widest flex items-center gap-2 py-2">
              <LayoutGrid size={14} /> <span className="hidden sm:inline">View</span> Archive
            </a>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 100}>
              <a href={`#detail-${collection._id}`} className="group cursor-pointer block">
                <div className="relative overflow-hidden rounded-sm aspect-[4/5] mb-6 bg-gray-900 shadow-2xl">
                  {collection.coverImage && (
                    <img 
                      src={optimizeImage(collection.coverImage, 1000)} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block"
                       style={{ background: `linear-gradient(to top, ${collection.dominantColor}aa, transparent)` }} />
                </div>
                <div className="flex justify-between items-start">
                  <div className="pr-4">
                    <h3 className="text-xl md:text-2xl font-medium mb-2 group-hover:text-[#E7B84A] transition-colors leading-tight">{collection.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed line-clamp-2">{collection.shortIntro}</p>
                  </div>
                  <span className="text-gray-500 text-[10px] md:text-xs font-mono mt-1 shrink-0">{collection.date}</span>
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
const GalleryDetail = ({ collection }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, [collection._id]);

  return (
    <div className="min-h-screen text-white relative bg-[#0a0a0a] overflow-x-hidden w-full">
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 opacity-40"
           style={{ background: `radial-gradient(circle at 50% 30%, ${collection.dominantColor} 0%, transparent 70%)`, filter: 'blur(100px)' }} />

      <div className="relative z-10 w-full">
        <nav className="fixed top-0 left-0 w-full px-5 py-4 md:px-8 z-50 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
          <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2">
            <ArrowLeft size={16} /> Back
          </a>
          <div className="text-[#E7B84A] font-bold tracking-[0.3em] text-sm md:text-lg uppercase">leapday</div>
        </nav>

        <div className="pt-32 pb-16 md:pt-48 md:pb-32 w-full px-5 md:px-8 max-w-5xl mx-auto">
          <FadeInSection>
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal mb-6 tracking-tight leading-tight">{collection.title}</h1>
              <p className="text-sm md:text-xl text-gray-300 font-light leading-relaxed mb-8 px-2">{collection.shortIntro}</p>
              <div className="flex justify-center items-center gap-4 text-[10px] md:text-xs font-mono text-gray-500 uppercase">
                <span>{collection.date}</span>
                <div className="flex gap-2">
                  {collection.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 border border-white/10 bg-white/5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <div className="space-y-6 md:space-y-32 flex flex-col items-center w-full pb-32">
          {collection.images?.map((imgSrc: string, idx: number) => (
            <FadeInSection key={idx} className="w-full max-w-6xl mx-auto px-0 md:px-8">
              <div className="w-full bg-gray-900 md:rounded-sm min-h-[300px]">
                <img src={optimizeImage(imgSrc, 1600)} className="w-full h-auto object-cover md:rounded-sm shadow-2xl" loading="lazy" />
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 【归档页】
const Archive = ({ collections }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 px-5 md:p-12 w-full">
      <nav className="flex justify-between items-center mb-16 pt-12 md:pt-0">
        <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2">
          <ArrowLeft size={16} /> Home
        </a>
        <h1 className="text-base md:text-xl tracking-[0.3em] font-normal uppercase">Archive</h1>
      </nav>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {collections.map((collection: any) => (
            <FadeInSection key={collection._id}>
              <a href={`#detail-${collection._id}`} className="group block">
                <div className="relative aspect-square overflow-hidden mb-3 bg-gray-900 rounded-sm">
                  <img src={optimizeImage(collection.coverImage, 500)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <h3 className="text-xs md:text-sm font-medium group-hover:text-[#E7B84A] transition-colors line-clamp-1">{collection.title}</h3>
                <span className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">{collection.date}</span>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. 核心渲染 ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dataState, setDataState] = useState({ collections: [], settings: null, loading: true, error: false });

  const fetchData = async () => {
    setDataState(prev => ({ ...prev, loading: true }));
    try {
      const query = encodeURIComponent(`{
        "collections": *[_type == "collection" && defined(coverImage)] | order(date desc) {
          _id, title, date, shortIntro, tags,
          "dominantColor": coverImage.asset->metadata.palette.darkMuted.background,
          "coverImage": coverImage.asset->url,
          "images": images[].asset->url
        },
        "settings": *[_type == "siteSettings"] | order(_updatedAt desc)[0] {
          mainTitle, subtitle, "heroImage": heroImage.asset->url
        }
      }`);
      const url = `https://${PROJECT_ID}.api.sanity.io/v2024-04-21/data/query/production?query=${query}`;
      const res = await fetch(url);
      const json = await res.json();
      const data = json.result;
      setDataState({ collections: data.collections, settings: data.settings, loading: false, error: false });
    } catch (err) {
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

  if (dataState.loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-8 h-8 border-t-2 border-[#E7B84A] rounded-full animate-spin"></div>
        <p className="tracking-widest text-[10px] text-gray-500 font-light uppercase">Syncing</p>
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
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-50 px-4">
          © {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
```

### 操作指南：
1.  **覆盖 `app/layout.tsx`**：这步非常关键，它会让浏览器知道优先调用苹果原厂字体。
2.  **覆盖 `app/page.tsx`**：这是最新的逻辑代码，主标题已经加粗到 `font-normal`。
3.  **Git 推送**：
    ```bash
    git add .
    git commit -m "style: switch to apple system fonts and optimize title weight"
    git push
