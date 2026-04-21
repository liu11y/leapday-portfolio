"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail } from 'lucide-react';
import { createClient } from 'next-sanity';

// --- 1. 连接你的 Sanity 真实后台 ---
const client = createClient({
  projectId: 'u6xbvj35', // 你的专属 ID
  dataset: 'production',
  apiVersion: '2024-04-21',
  useCdn: false,
});

// --- 2. 滚动淡入动画组件 ---
const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    const { current } = domRef;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);
  
  return [domRef, isVisible] as const;
};

const FadeInSection = ({ children, delay = 0 }: any) => {
  const [ref, isVisible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- 3. 页面组件 ---

// 【首页】支持独立橱窗控制
const Home = ({ navigate, collections, settings }: any) => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  if (!collections || collections.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40 tracking-widest text-sm font-light uppercase font-sans">
        Loading Journal...
      </div>
    );
  }

  // 优先级逻辑：主标题默认 leapday，副标题默认不显示
  const heroImg = settings?.heroImage || collections[0]?.coverImage;
  const mainTitle = settings?.mainTitle || "leapday";
  const subTitle = settings?.subtitle || ""; // 默认为空，不显示

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#E7B84A] selection:text-black">
      {/* 英雄区 (Hero Section) */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Hero Visual" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center px-4">
          <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-[#E7B84A] drop-shadow-2xl mb-4">
            {mainTitle}
          </h1>
          {/* 只有在后台填了副标题时，才渲染这个标签 */}
          {subTitle && (
            <p className="text-gray-300 tracking-widest uppercase text-xs md:text-sm font-light mt-2" style={{ letterSpacing: '0.4em' }}>
              {subTitle}
            </p>
          )}
        </div>
      </div>

      {/* 合集列表 (Collections Grid) */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-6 py-32">
        <FadeInSection>
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">Latest Stories</h2>
            <button 
              onClick={() => navigate('archive')}
              className="text-xs text-gray-500 hover:text-[#E7B84A] transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <LayoutGrid size={14} /> View Archive
            </button>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 150}>
              <div 
                className="group cursor-pointer"
                onClick={() => navigate('detail', collection)}
              >
                <div className="relative overflow-hidden rounded-sm aspect-[4/5] mb-8 bg-gray-900 shadow-2xl">
                  <img 
                    src={collection.coverImage} 
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `linear-gradient(to top, ${collection.dominantColor}aa, transparent)` }}
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-medium mb-3 group-hover:text-[#E7B84A] transition-colors">{collection.title}</h3>
                    <p className="text-gray-400 text-sm max-w-sm font-light leading-relaxed">{collection.shortIntro}</p>
                  </div>
                  <span className="text-gray-500 text-xs font-mono mt-2">{collection.date}</span>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 【详情页】
const GalleryDetail = ({ collection, navigate }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen text-white relative bg-[#0a0a0a] overflow-hidden font-sans">
      <div 
        className="fixed top-[-10%] left-[-10%] w-[120%] h-[80vh] pointer-events-none z-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${collection.dominantColor} 0%, transparent 70%)`,
          filter: 'blur(120px)', 
          transform: 'translateZ(0)' 
        }}
      />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-[#0a0a0a]/30 backdrop-blur-xl border-b border-white/5">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-[#E7B84A] font-bold tracking-[0.3em] text-lg uppercase">leapday</div>
        </nav>

        <div className="pt-48 pb-32 max-w-5xl mx-auto px-6">
          <FadeInSection>
            <div className="mb-24 md:mb-40 text-center max-w-3xl mx-auto relative">
              <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tighter">{collection.title}</h1>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-10">
                {collection.shortIntro}
              </p>
              <div className="flex justify-center gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
                <span>{collection.date}</span>
                <div className="flex gap-3">
                  {collection.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>

          <div className="space-y-24 md:space-y-48 flex flex-col items-center">
            {collection.images?.map((imgSrc: string, idx: number) => (
              <FadeInSection key={idx}>
                <div className="w-full max-w-5xl mx-auto shadow-2xl">
                  <img 
                    src={imgSrc} 
                    alt={`${collection.title} - ${idx}`}
                    className="w-full h-auto object-cover rounded-sm grayscale-[10%] hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 【归档页】
const Archive = ({ collections, navigate }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <nav className="flex justify-between items-center mb-32">
        <button 
          onClick={() => navigate('home')}
          className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <h1 className="text-xl tracking-[0.3em] font-light uppercase">Archive</h1>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {collections.map((collection: any, idx: number) => (
            <FadeInSection key={collection._id} delay={idx * 50}>
              <div 
                className="group cursor-pointer flex flex-col"
                onClick={() => navigate('detail', collection)}
              >
                <div className="relative aspect-square overflow-hidden mb-6 bg-gray-900 rounded-sm">
                  <img 
                    src={collection.coverImage} 
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                </div>
                <h3 className="text-xl font-medium group-hover:text-[#E7B84A] transition-colors tracking-tight">{collection.title}</h3>
                <span className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-widest">{collection.date}</span>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. 主程序 ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [realData, setRealData] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const query = `{
      "collections": *[_type == "collection"] | order(date desc) {
        _id, title, date, shortIntro, tags,
        "dominantColor": coverImage.asset->metadata.palette.darkMuted.background,
        "coverImage": coverImage.asset->url,
        "images": images[].asset->url
      },
      "settings": *[_type == "siteSettings"] | order(_updatedAt desc)[0] {
        mainTitle, subtitle, "heroImage": heroImage.asset->url
      }
    }`;

    client.fetch(query).then((data: any) => {
      const formattedData = data.collections.map((item: any) => ({
        ...item,
        dominantColor: item.dominantColor || '#222222'
      }));
      setRealData(formattedData);
      setSiteSettings(data.settings);
    }).catch(console.error);
  }, []);

  const navigate = (view: any, collection = null) => {
    setCurrentView(view);
    if (collection) setSelectedCollection(collection);
  };

  return (
    <div className="antialiased">
      {currentView === 'home' && <Home navigate={navigate} collections={realData} settings={siteSettings} />}
      {currentView === 'detail' && selectedCollection && <GalleryDetail collection={selectedCollection} navigate={navigate} />}
      {currentView === 'archive' && <Archive collections={realData} navigate={navigate} />}
      
      <footer className="bg-[#050505] text-gray-600 py-20 text-center flex flex-col items-center gap-8 border-t border-white/5">
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#E7B84A] transition-colors duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a href="#" className="hover:text-[#E7B84A] transition-colors duration-500"><Mail size={18} strokeWidth={1.5} /></a>
        </div>
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">© {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}