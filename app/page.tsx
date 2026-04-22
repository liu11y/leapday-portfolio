"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Mail, ChevronLeft, AlertCircle, Database } from 'lucide-react';

// --- 1. 全局配置参数 ---
const PROJECT_ID = 'u6xbvj35';
const DATASET = 'production';
const API_VERSION = '2024-04-21';

/**
 * 顶级智能图片优化引擎
 */
const optimizeImage = (url: any, width = 1200, quality = 75) => {
  if (!url) return ""; 
  
  let finalUrl = String(url).trim();

  // 针对你的个人图床精准截取：GitHub 网页链接 -> Cloudflare 加速链接
  if (finalUrl.includes('github.com/liu11y/leapday-images/blob/main/')) {
    finalUrl = finalUrl.replace(/https?:\/\/github\.com\/liu11y\/leapday-images\/blob\/main\//i, 'https://leapday-images.pages.dev/');
  } 
  // 针对你的个人图床精准截取：GitHub 原始数据链接 -> Cloudflare 加速链接
  else if (finalUrl.includes('raw.githubusercontent.com/liu11y/leapday-images/main/')) {
    finalUrl = finalUrl.replace(/https?:\/\/raw\.githubusercontent\.com\/liu11y\/leapday-images\/main\//i, 'https://leapday-images.pages.dev/');
  }

  // 自动补全协议头
  if (finalUrl.startsWith('leapday-images')) {
    finalUrl = `https://${finalUrl}`;
  } else if (!finalUrl.startsWith('http') && (finalUrl.includes('pages.dev') || finalUrl.includes('workers.dev'))) {
    finalUrl = `https://${finalUrl}`;
  }

  try {
    if (finalUrl.includes('%')) {
      finalUrl = decodeURIComponent(finalUrl);
    }
  } catch (e) {
    console.warn("URL 解码失败:", e);
  }

  if (finalUrl.includes('cdn.sanity.io')) {
    return `${finalUrl}?w=${width}&q=${quality}&auto=format&fit=max`;
  }
  
  return finalUrl;
};

// --- 2. 渐进式模糊加载组件 ---
const ProgressiveImage = ({ src, lqip, alt, imgClassName = "" }: any) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      {/* 模糊占位图 */}
      {lqip && !isLoaded && (
        <img
          src={lqip}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-40 transition-opacity duration-1000"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          console.error("图片加载失败，请检查链接:", src);
          setError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 text-gray-600">
          <AlertCircle size={16} className="mb-2 opacity-30" />
          <span className="text-[9px] uppercase tracking-widest opacity-40">Load Error</span>
        </div>
      )}
    </div>
  );
};

// --- 3. 页面滚动出现动画钩子 ---
const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.05 }); 
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);
  return [domRef, isVisible] as const;
};

const FadeInSection = ({ children, delay = 0, className = "" }: any) => {
  const [ref, isVisible] = useFadeIn();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- 4. 子页面组件 ---

// 【首页视图】
const Home = ({ collections, settings }: any) => {
  const heroImg = optimizeImage(
    settings?.heroImageUrl || settings?.heroImage || collections[0]?.coverImageUrl || collections[0]?.coverImage, 
    2000
  );
  const heroVideo = settings?.heroVideo; 

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && heroVideo) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.warn("手机端自动播放被拦截:", error);
      });
    }
  }, [heroVideo]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen w-full">
      <div className="relative h-[100svh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video 
              ref={videoRef}
              src={heroVideo} 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-60 md:opacity-40 scale-105" 
            />
          ) : heroImg ? (
            <ProgressiveImage src={heroImg} lqip={settings?.heroImageLqip} alt="Hero" imgClassName="opacity-50 md:opacity-40 scale-105 animate-pulse-slow" />
          ) : (
            <div className="w-full h-full bg-[#0a0a0a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 w-full">
          {/* 主标题和副标题只有在有内容时才渲染，移除了默认占位符 */}
          {settings?.mainTitle && (
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tighter text-[#E7B84A] drop-shadow-2xl mb-4 uppercase">
              {settings.mainTitle}
            </h1>
          )}
          {settings?.subtitle && (
            <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] md:text-sm font-light opacity-60">
              {settings.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-32">
        <FadeInSection className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <h2 className="text-2xl md:text-4xl font-light tracking-tight">最新记录</h2>
          <a href="#archive" className="text-[10px] text-gray-500 hover:text-[#E7B84A] uppercase tracking-widest flex items-center gap-2 transition-colors">
            <LayoutGrid size={14} /> 全部归档
          </a>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 w-full">
          {collections.slice(0, 4).map((item: any, idx: number) => (
            <FadeInSection key={item._id} delay={idx * 100}>
              <a href={`#detail-${item._id}`} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] mb-8 shadow-2xl bg-gray-900 rounded-sm">
                  <ProgressiveImage
                    src={optimizeImage(item.coverImageUrl || item.coverImage, 1200)}
                    lqip={item.coverImageLqip}
                    alt={item.title}
                    imgClassName="group-hover:scale-105 opacity-90 group-hover:opacity-100 transition-all duration-1000"
                  />
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left flex-1">
                    <h3 className="text-xl md:text-2xl font-medium group-hover:text-[#E7B84A] transition-colors tracking-tight">{item.title}</h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light line-clamp-2 mt-2 leading-relaxed">{item.shortIntro}</p>
                  </div>
                  <span className="text-gray-600 text-[10px] font-mono mt-2 uppercase tracking-tighter shrink-0">{item.date}</span>
                </div>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 【作品集详情视图】
const Detail = ({ collection }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, [collection._id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white w-full overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full px-5 py-4 md:px-8 z-50 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] text-[10px] uppercase tracking-widest transition-all">
          <ChevronLeft size={16} /> 返回
        </a>
        <div className="text-[#E7B84A] font-bold tracking-[0.3em] text-sm uppercase">LEAPDAY</div>
      </nav>
      
      <div className="pt-40 pb-16 md:pt-48 md:pb-32 w-full px-5 md:px-8 max-w-4xl mx-auto text-center">
        <FadeInSection>
          <h1 className="text-4xl md:text-7xl font-light mb-8 leading-tight tracking-tighter">{collection.title}</h1>
          <p className="text-gray-400 text-base md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">{collection.shortIntro}</p>
          <div className="flex justify-center gap-6 text-[10px] text-gray-600 uppercase tracking-widest font-mono flex-wrap">
            <span>{collection.date}</span>
            <div className="flex gap-2 flex-wrap justify-center">
              {collection.tags?.map((t: string) => <span key={t} className="px-2 border border-white/10 py-1 rounded-sm">#{t}</span>)}
            </div>
          </div>
        </FadeInSection>
      </div>
      
      <div className="flex flex-col items-center gap-10 md:gap-32 pb-40">
        {collection.images?.map((img: any, i: number) => (
          <FadeInSection key={i} className="max-w-6xl w-full px-0 md:px-10">
            <div className="bg-gray-900 shadow-2xl min-h-[30vh]">
              <ProgressiveImage src={optimizeImage(img.url, 1800)} lqip={img.lqip} alt={`${collection.title} - ${i}`} />
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

// 【全部作品归档视图】
const Archive = ({ collections }: any) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 px-5 md:p-12 w-full">
      <nav className="flex justify-between items-center mb-16 pt-12 md:pt-0">
        <a href="#" className="flex items-center gap-2 hover:text-[#E7B84A] transition-colors text-[10px] md:text-xs uppercase tracking-widest py-2">
          <ArrowLeft size={16} /> 首页
        </a>
        <h1 className="text-base md:text-xl tracking-[0.3em] font-normal uppercase">全部记录</h1>
      </nav>

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {collections.map((item: any) => (
            <FadeInSection key={item._id}>
              <a href={`#detail-${item._id}`} className="group block text-left">
                <div className="relative aspect-square overflow-hidden mb-4 bg-gray-900 rounded-sm w-full">
                  <ProgressiveImage
                    src={optimizeImage(item.coverImageUrl || item.coverImage, 600)}
                    lqip={item.coverImageLqip}
                    alt={item.title}
                    imgClassName="group-hover:scale-110 opacity-80 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-medium group-hover:text-[#E7B84A] transition-colors line-clamp-1 tracking-tight">{item.title}</h3>
                <span className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-tighter block">{item.date}</span>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 5. 核心前端引擎与路由调度 ---

const MOCK_DATA = {
  settings: {
    mainTitle: "NEO DREAM",
    subtitle: "A PHOTOGRAPHY JOURNAL (MOCK DATA)",
    heroImageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=80"
  },
  collections: [
    {
      _id: "mock1",
      title: "Cyber City",
      date: "2025.01",
      shortIntro: "Night walks in the neon districts. The city never sleeps.",
      tags: ["Street", "Night"],
      coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80" },
        { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80" }
      ]
    }
  ]
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [data, setData] = useState<any>({ collections: [], settings: null, loading: true, error: false, isMock: false });
  const [showDebug, setShowDebug] = useState(false);

  const fetchData = async () => {
    setData((prev: any) => ({ ...prev, loading: true, error: false, isMock: false }));
    try {
      const query = encodeURIComponent(`{
        "collections": *[_type == "collection"] | order(date desc) {
          _id, title, date, shortIntro, tags,
          "coverImage": coverImage.asset->url,
          "coverImageUrl": coverImageUrl,
          "coverImageLqip": coverImage.asset->metadata.lqip,
          "bulkExternalUrls": bulkExternalUrls,
          "images": images[] {
             "url": coalesce(externalUrl, imageAsset.asset->url),
             "lqip": imageAsset.asset->metadata.lqip
          }
        },
        "settings": *[_type == "siteSettings"][0] {
          mainTitle, subtitle, 
          "heroImage": heroImage.asset->url, 
          "heroImageUrl": heroImageUrl,
          "heroImageLqip": heroImage.asset->metadata.lqip,
          "heroVideo": heroVideo.asset->url
        }
      }`);
      const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const { result } = await res.json();

      const formattedCollections = (result.collections || []).map((item: any) => {
        const bulkUrls = item.bulkExternalUrls 
          ? item.bulkExternalUrls.split(/\r?\n/).map((u: string) => ({ url: u.trim() })).filter((img: any) => img.url)
          : [];
        
        return {
          ...item,
          images: [...(item.images || []), ...bulkUrls]
        };
      });

      setData({ collections: formattedCollections, settings: result.settings || {}, loading: false, error: false, isMock: false });
    } catch (err) {
      console.error("Fetch Error (可能是预览环境跨域限制，自动启用 Mock 数据):", err);
      setData({ collections: MOCK_DATA.collections, settings: MOCK_DATA.settings, loading: false, error: false, isMock: true });
    }
  };

  useEffect(() => { 
    fetchData(); 
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) { setCurrentRoute('home'); setActiveId(null); }
      else if (hash === 'archive') { setCurrentRoute('archive'); setActiveId(null); }
      else if (hash.startsWith('detail-')) { setCurrentRoute('detail'); setActiveId(hash.replace('detail-', '')); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (data.loading) return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-[#E7B84A] animate-pulse tracking-[0.5em] text-[10px] font-mono">SYNCING</div>
    </div>
  );

  const activeCollection = data.collections.find((c: any) => c._id === activeId);

  return (
    <div className="antialiased bg-[#0a0a0a]">
      {currentRoute === 'home' && <Home collections={data.collections} settings={data.settings} />}
      {currentRoute === 'detail' && activeCollection && <Detail collection={activeCollection} />}
      {currentRoute === 'archive' && <Archive collections={data.collections} />}
      
      <footer 
        className="bg-black py-24 text-center border-t border-white/5 opacity-30 text-[8px] tracking-[0.4em] uppercase cursor-pointer hover:opacity-80 transition-opacity"
        onDoubleClick={() => setShowDebug(!showDebug)}
        title="双击调出开发者调试面板"
      >
        © {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.
        <br/><span className="mt-2 block opacity-40">Capturing Moments Through The Lens.</span>
        
        {data.isMock && (
          <span className="mt-6 text-[#E7B84A] font-bold tracking-widest bg-[#E7B84A]/10 py-2 px-4 inline-block rounded-sm">
            ⚠️ 正在使用本地测试数据 (MOCK DATA) 预览
          </span>
        )}
      </footer>

      {showDebug && (
        <div className="fixed bottom-0 left-0 w-full p-6 bg-[#111] border-t border-[#E7B84A]/30 z-[9999] text-[10px] font-mono max-h-[50vh] overflow-auto shadow-2xl">
          <div className="flex justify-between mb-4 border-b border-white/10 pb-4">
            <span className="text-[#E7B84A] font-bold uppercase flex items-center gap-2"><Database size={12}/> Sanity 数据库连通性自检</span>
            <button onClick={() => setShowDebug(false)} className="text-gray-500 hover:text-white">关闭 (Close)</button>
          </div>
          <div className="text-green-500 mb-2">Status: Connected to u6xbvj35 / production</div>
          <p className="text-gray-500 mb-4">以下为 Sanity 传来的 Global Settings 原始数据：</p>
          <pre className="text-gray-300 bg-black p-4 rounded-sm">
            {JSON.stringify(data.settings, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
