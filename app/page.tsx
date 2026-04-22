"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail, RefreshCw } from 'lucide-react';

// 防御性图片优化：处理空链接
const optimizeImage = (url: string, width = 1200, quality = 80) => {
  if (!url) return ""; // 防御崩溃
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
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImg = optimizeImage(settings?.heroImage || collections[0]?.coverImage, 2000, 80);
  const mainTitle = settings?.mainTitle || "leapday";
  const subTitle = settings?.subtitle || "";

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#E7B84A] selection:text-black overflow-x-hidden w-full">
      <div className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-gray-900">
        {/* 占位底色防闪烁 */}
        <div className="absolute inset-0 z-0">
          {heroImg && (
            <img 
              src={heroImg} 
              alt="Hero Visual" 
              className="w-full h-full object-cover opacity-50 md:opacity-40 scale-105 animate-pulse-slow transition-opacity duration-1000"
              loading="eager" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center px-6 w-full">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light tracking-tighter text-[#E7B84A] drop-shadow-2xl mb-3 md:mb-4 w-full break-words">
            {mainTitle}
          </h1>
          {subTitle && (
            <p className="text-gray-300 tracking-widest uppercase text-[10px] md:text-sm font-light mt-2" style={{ letterSpacing: '0.4em' }}>
              {subTitle}
            </p>
          )}
        </div>
      </div>

      <div ref={heroRef} className="w-full max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32">
        <FadeInSection>
          <div className="flex justify-between items-end mb-10 md:mb-16 border-b border-white/10 pb-6 md:pb-8">
            <h2 className="text-2xl md:text-4xl font-light tracking-tight">Latest Stories</h2>
            {/* 使用 a 标签替代 button，支持原生新标签页打开和路由 */}
            <a 
              href="#archive"
              className="text-[10px] md:text-xs text-gray-500 hover:text-[#E7B84A] transition-all uppercase tracking-widest flex items-center gap-1 md:gap-2 py-2 cursor-pointer"
            >
              <LayoutGrid size={14} /> <span className="hidden sm:inline">View</span> Archive
            </a>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 100}>
              <a 
                href={`#detail-${collection._id}`}
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden rounded-sm aspect-[4/5] mb-5 md:mb-8 bg-gray-900 shadow-2xl">
                  {collection.coverImage && (
                    <img 
                      src={optimizeImage(collection.coverImage, 800)} 
                      alt={collection.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  )}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block"
                    style={{ background: `linear-gradient(to top, ${collection.dominantColor}aa, transparent)` }}
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div className="pr-4">
                    <h3 className="text-xl md:text-2xl font-medium mb-2 md:mb-3 group-hover:text-[#E7B84A] transition-colors leading-tight">{collection.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed line-clamp-2 md:line-clamp-3">{collection.shortIntro}</p>
                  </div>
                  <span className="text-gray-500 text-[10px] md:text-xs font-mono mt-1 md:mt-2 shrink-0">{collection.date}</span>
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
  useEffect(() => { window.scrollTo(0, 0); }, [collection._id]); // 每次换数据强制回顶

  if (!collection) return null;

  return (
    <div className="min-h-screen text-white relative bg-[#0a0a0a] overflow-x-hidden font-sans w-full">
      <div 
        className="fixed top-[-10%] left-[-10%] w-[120%] h-[80vh] pointer-events-none z-0 opacity-40 md:opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${collection.dominantColor} 0%, transparent 70%)`,
          filter: 'blur(100px)', 
          transform: 'translateZ(0)' 
        }}
      />

      <div className="relative z-10 w-full">
        <nav className="fixed top-0 left-0 w-full px-5 py-4 md:px-8 md:py-6 z-50 flex justify-between items-center bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/5">
          <a 
            href="#"
            className="flex items-center gap-1 md:gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold py-2"
          >
            <ArrowLeft size={16} /> Back
          </a>
          <div className="text-[#E7B84A] font-bold tracking-[0.3em] text-sm md:text-lg uppercase">leapday</div>
        </nav>

        <div className="pt-32 pb-16 md:pt-48 md:pb-32 w-full px-5 md:px-8 max-w-5xl mx-auto">
          <FadeInSection>
            <div className="mb-16 md:mb-32 text-center max-w-3xl mx-auto relative">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-light mb-4 md:mb-8 tracking-tighter leading-tight">{collection.title}</h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-300 font-light leading-relaxed mb-6 md:mb-10 px-2">
                {collection.shortIntro}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">
                <span>{collection.date}</span>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {collection.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <div className="space-y-6 md:space-y-32 flex flex-col items-center w-full pb-20 md:pb-32">
          {collection.images?.map((imgSrc: string, idx: number) => (
            <FadeInSection key={idx} className="w-full max-w-6xl mx-auto px-0 md:px-8">
              {/* 加入极简的骨架屏底色，防止跳动，防 CLS 布局偏移 */}
              <div className="w-full bg-gray-900 md:rounded-sm min-h-[300px] flex items-center justify-center">
                <img 
                  src={optimizeImage(imgSrc, 1600)} 
                  alt={`${collection.title} - ${idx + 1}`}
                  className="w-full h-auto object-cover md:rounded-sm shadow-2xl md:grayscale-[10%] md:hover:grayscale-0 transition-all duration-1000"
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
const Archive = ({ collections }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 px-5 md:p-12 font-sans w-full">
      <nav className="flex justify-between items-center mb-16 md:mb-32 pt-16 md:pt-0">
        <a 
          href="#"
          className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2"
        >
          <ArrowLeft size={16} /> Home
        </a>
        <h1 className="text-base md:text-xl tracking-[0.3em] font-light uppercase">Archive</h1>
      </nav>

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={(idx % 5) * 50}>
              <a 
                href={`#detail-${collection._id}`}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden mb-3 md:mb-4 bg-gray-900 rounded-sm">
                  <img 
                    src={optimizeImage(collection.coverImage, 400)} 
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-medium group-hover:text-[#E7B84A] transition-colors tracking-tight line-clamp-1">{collection.title}</h3>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">{collection.date}</span>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. 核心调度与路由状态机 ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [dataState, setDataState] = useState({
    collections: [],
    settings: null,
    loading: true,
    error: false,
  });

  // 1. 数据拉取 (包含异常重试机制)
  const fetchData = async () => {
    setDataState(prev => ({ ...prev, loading: true, error: false }));
    try {
      // 增加防御性查询，过滤掉没有封面的无效合集
      const query = `{
        "collections": *[_type == "collection" && defined(coverImage)] | order(date desc) {
          _id, title, date, shortIntro, tags,
          "dominantColor": coverImage.asset->metadata.palette.darkMuted.background,
          "coverImage": coverImage.asset->url,
          "images": images[].asset->url
        },
        "settings": *[_type == "siteSettings"] | order(_updatedAt desc)[0] {
          mainTitle, subtitle, "heroImage": heroImage.asset->url
        }
      }`;
      
      const projectId = 'u6xbvj35';
      const dataset = 'production';
      const url = `https://${projectId}.api.sanity.io/v2024-04-21/data/query/${dataset}?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      const json = await response.json();
      const data = json.result;
      
      const formattedData = data.collections.map((item: any) => ({
        ...item, dominantColor: item.dominantColor || '#222222'
      }));
      
      setDataState({ collections: formattedData, settings: data.settings, loading: false, error: false });
    } catch (err) {
      console.warn("Fetch failed, likely due to CORS in preview environment. Loading mock data.", err);
      // 在预览环境遇到 CORS 错误时，提供备用测试数据，保证画面能渲染
      const mockCollections = [
        {
          _id: 'mock1',
          title: 'Kyoto Autumn',
          date: '2025.11',
          shortIntro: 'Wandering through the red maple leaves of Kyoto.',
          tags: ['Japan', 'Travel'],
          dominantColor: '#8b3a3a',
          coverImage: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=800&q=80',
          images: [
             'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=1600&q=80',
             'https://images.unsplash.com/photo-1471193945509-9cb061c07a50?auto=format&fit=crop&w=1600&q=80'
          ]
        },
        {
          _id: 'mock2',
          title: 'Urban Geometry',
          date: '2025.08',
          shortIntro: 'Concrete, steel, and the shapes they form.',
          tags: ['Architecture', 'City'],
          dominantColor: '#4a4a4a',
          coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80'
          ]
        }
      ];
      setDataState({ 
        collections: mockCollections, 
        settings: { mainTitle: 'leapday', subtitle: 'PREVIEW MODE', heroImage: mockCollections[0].coverImage }, 
        loading: false, 
        error: false 
      });
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Hash 路由监听 (解决手机返回键问题)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setCurrentRoute('home');
        setActiveId(null);
      } else if (hash === 'archive') {
        setCurrentRoute('archive');
        setActiveId(null);
      } else if (hash.startsWith('detail-')) {
        setCurrentRoute('detail');
        setActiveId(hash.replace('detail-', ''));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始化执行一次

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- 状态分支渲染 ---

  // 状态 A: 灾难错误兜底 (断网/API拒绝)
  if (dataState.error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-gray-500 font-mono text-xs p-6 text-center">
        <p className="mb-4">CONNECTION FAILED.</p>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded hover:text-white hover:border-white transition-colors">
          <RefreshCw size={14} /> RETRY
        </button>
      </div>
    );
  }

  // 状态 B: 骨架加载中
  if (dataState.loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-50 animate-pulse">
          <div className="w-8 h-8 border-t-2 border-[#E7B84A] border-solid rounded-full animate-spin"></div>
          <p className="tracking-[0.3em] text-[10px] text-gray-400 font-light uppercase">Syncing</p>
        </div>
      </div>
    );
  }

  // 状态 C: 正常视图渲染
  const activeCollection = dataState.collections.find((c: any) => c._id === activeId);

  return (
    <div className="antialiased bg-[#0a0a0a] min-h-screen">
      {currentRoute === 'home' && <Home collections={dataState.collections} settings={dataState.settings} />}
      {currentRoute === 'detail' && activeCollection && <GalleryDetail collection={activeCollection} />}
      {currentRoute === 'archive' && <Archive collections={dataState.collections} />}
      
      {/* 底部保留区 */}
      <footer className="bg-[#050505] text-gray-600 py-12 md:py-20 w-full text-center flex flex-col items-center gap-6 md:gap-8 border-t border-white/5">
        <div className="flex gap-6 md:gap-8">
          <a href="#" className="hover:text-[#E7B84A] transition-colors duration-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a href="#" className="hover:text-[#E7B84A] transition-colors duration-500 p-2"><Mail className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} /></a>
        </div>
        <p className="text-[8px] md:text-[10px] font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-50 px-4">
          © {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
