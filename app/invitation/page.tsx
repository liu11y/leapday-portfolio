"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Calendar, Clock, Disc3, Pause, Send, AlertCircle } from 'lucide-react';

// --- 1. 全局配置与极速引擎 ---
const PROJECT_ID = 'u6xbvj35';
const DATASET = 'production';
const API_VERSION = '2024-04-21';

const optimizeImage = (url: any, width = 1200, quality = 75) => {
  if (!url) return ""; 
  let finalUrl = String(url).trim();
  if (finalUrl.includes('github.com/liu11y/leapday-images/blob/main/')) {
    finalUrl = finalUrl.replace(/https?:\/\/github\.com\/liu11y\/leapday-images\/blob\/main\//i, 'https://leapday-images.pages.dev/');
  } else if (finalUrl.includes('raw.githubusercontent.com/liu11y/leapday-images/main/')) {
    finalUrl = finalUrl.replace(/https?:\/\/raw\.githubusercontent\.com\/liu11y\/leapday-images\/main\//i, 'https://leapday-images.pages.dev/');
  }
  if (finalUrl.startsWith('leapday-images')) {
    finalUrl = `https://${finalUrl}`;
  } else if (!finalUrl.startsWith('http') && (finalUrl.includes('pages.dev') || finalUrl.includes('workers.dev'))) {
    finalUrl = `https://${finalUrl}`;
  }
  return finalUrl;
};

// --- 2. 渐进式组件与动画 ---
const ProgressiveImage = ({ src, alt, imgClassName = "" }: any) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        } ${imgClassName}`}
      />
    </div>
  );
};

const useFadeIn = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.1 }); 
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

// --- 3. 兜底测试数据 ---
const MOCK_DATA = {
  groom: "Alex", bride: "Emma", date: "2026.10.24", time: "16:00 PM",
  venue: "半岛酒店 Grand Ballroom", address: "上海市黄浦区中山东一路32号",
  heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=80",
  music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  formspreeId: "",
  gallery: [
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"
  ]
};

// --- 4. 电子请柬主页面 ---
export default function WeddingInvitation() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const query = encodeURIComponent(`*[_type == "invitation"][0]`);
        const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");
        const { result } = await res.json();
        
        if (result) {
          // 将批量文本链接按行切割为数组
          const parsedGallery = result.galleryUrls 
            ? result.galleryUrls.split(/\r?\n/).map((u: string) => u.trim()).filter(Boolean)
            : [];
            
          setData({
            ...result,
            gallery: parsedGallery
          });
        } else {
          setData(MOCK_DATA); // 数据库未建立时使用测试数据
        }
      } catch (err) {
        console.error("请柬拉取失败", err);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-[#E7B84A] text-[10px] tracking-[0.5em] font-mono animate-pulse uppercase">
      Opening
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen w-full font-sans overflow-x-hidden selection:bg-[#E7B84A]/30 selection:text-white">
      <audio ref={audioRef} src={data.music || MOCK_DATA.music} loop />

      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-[#E7B84A] shadow-2xl"
      >
        {isPlaying ? <Pause size={16} /> : <Disc3 size={16} className="animate-[spin_4s_linear_infinite]" />}
      </button>

      <div className="relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ProgressiveImage src={optimizeImage(data.heroImage || MOCK_DATA.heroImage)} alt="Hero" imgClassName="opacity-60 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/20 via-transparent to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 flex flex-col items-center mt-20">
          <p className="text-[#E7B84A] tracking-[0.4em] uppercase text-[10px] md:text-xs font-light mb-8 opacity-80">
            Save The Date
          </p>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white drop-shadow-2xl mb-4">
            {data.groom} <span className="text-[#E7B84A] text-4xl md:text-6xl italic mx-2">&amp;</span> {data.bride}
          </h1>
          <div className="w-[1px] h-12 bg-[#E7B84A]/50 my-6"></div>
          <p className="text-gray-300 tracking-[0.3em] font-mono text-xs md:text-sm uppercase">
            {data.date}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
          <span className="text-[9px] uppercase tracking-widest text-[#E7B84A] mb-2">Scroll</span>
          <div className="w-[1px] h-8 bg-[#E7B84A]"></div>
        </div>
      </div>

      <div className="py-32 px-6 max-w-3xl mx-auto text-center">
        <FadeInSection>
          <Heart size={20} className="text-[#E7B84A] mx-auto mb-8 opacity-50" />
          <p className="text-xl md:text-2xl font-light leading-loose text-gray-300">
            "To love and be loved is to feel the sun from both sides."
          </p>
          <p className="mt-6 text-sm text-gray-500 font-light tracking-widest uppercase">
            我们结婚了
          </p>
        </FadeInSection>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {(data.gallery?.length ? data.gallery : MOCK_DATA.gallery).map((img: string, idx: number) => (
            <FadeInSection key={idx} delay={idx * 150} className={`${idx % 2 !== 0 ? 'md:mt-24' : ''}`}>
              <div className="relative aspect-[3/4] shadow-2xl bg-gray-900/50 rounded-sm overflow-hidden border border-white/[0.02]">
                <ProgressiveImage src={optimizeImage(img)} alt={`Gallery ${idx}`} imgClassName="hover:scale-105 transition-transform duration-[2s]" />
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      <div className="py-32 px-6 bg-[#111]">
        <FadeInSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light tracking-tight text-[#E7B84A] mb-16 uppercase">The Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <Calendar size={24} className="text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Date</h3>
              <p className="text-sm text-gray-400 font-light">{data.date}</p>
            </div>
            
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <Clock size={24} className="text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Time</h3>
              <p className="text-sm text-gray-400 font-light">{data.time}</p>
            </div>
            
            <a 
              href={`https://uri.amap.com/search?keyword=${encodeURIComponent((data.venue || "") + " " + (data.address || ""))}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center pt-8 md:pt-0 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#E7B84A] transition-colors duration-500">
                <MapPin size={20} className="text-gray-500 group-hover:text-black transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-medium mb-2 group-hover:text-[#E7B84A] transition-colors">Venue</h3>
              <p className="text-sm text-gray-400 font-light mb-1">{data.venue}</p>
              <p className="text-xs text-gray-500 font-light">{data.address}</p>
              <span className="text-[10px] text-[#E7B84A] mt-4 border-b border-[#E7B84A]/30 pb-0.5 uppercase tracking-widest group-hover:border-[#E7B84A] transition-colors">
                点击开启高德导航
              </span>
            </a>
          </div>
        </FadeInSection>
      </div>

      <div className="py-32 px-6 max-w-2xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light tracking-tight text-white mb-4">RSVP</h2>
            <p className="text-sm text-gray-500 font-light">期待您的光临，请尽早回复回执</p>
          </div>

          <form action={`https://formspree.io/f/${data.formspreeId || '填写你的表单ID'}`} method="POST" className="space-y-6 bg-black p-8 md:p-12 border border-white/5 shadow-2xl rounded-sm">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">您的姓名 Name</label>
              <input type="text" name="name" required className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#E7B84A] transition-colors" placeholder="请输入姓名" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">是否出席 Attendance</label>
              <select name="attendance" required className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#E7B84A] transition-colors appearance-none">
                <option value="欣然赴约 (Yes)">欣然赴约 (Joyfully Accept)</option>
                <option value="遗憾缺席 (No)">遗憾缺席 (Regretfully Decline)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">出席人数 Guests</label>
              <input type="number" name="guests" min="1" max="10" required className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#E7B84A] transition-colors" placeholder="1" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">祝福语 Wishes (可选)</label>
              <textarea name="wishes" rows={3} className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#E7B84A] transition-colors resize-none" placeholder="留下您的祝福..."></textarea>
            </div>

            <button type="submit" className="w-full bg-[#E7B84A] text-black font-medium text-sm py-4 uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
              <Send size={16} /> 确认发送 RSVP
            </button>
          </form>
        </FadeInSection>
      </div>

      <footer className="bg-black py-12 text-center border-t border-white/5">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-600">
          {data.groom} & {data.bride}
        </p>
        <p className="text-[8px] text-gray-700 mt-2">© {new Date().getFullYear()} LEAPDAY. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}