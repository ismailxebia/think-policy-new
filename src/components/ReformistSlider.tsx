"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Pause, Play, X, ExternalLink } from "lucide-react";

interface ReformistSlide {
  id: number;
  videoId: string;
  title: string;
  speaker: string;
  summary: string;
  thumbnail: string;
  duration?: string;
}

const REFORMIST_VIDEOS: ReformistSlide[] = [
  {
    id: 1,
    videoId: "G-BtuHAiz3c",
    title: "Bedah Tuntas si Program Prioritas | Second Thoughts on MBG",
    speaker: "The Reformist • Program Makan Bergizi Gratis (MBG)",
    summary:
      "Bedah tuntas rancangan kebijakan, kalkulasi fiskal, dan strategi eksekusi di balik salah satu agenda program prioritas nasional.",
    thumbnail: "/reformist/thumb-G-BtuHAiz3c.jpg",
    duration: "Episode Terbaru",
  },
  {
    id: 2,
    videoId: "m_62RAy4FlM",
    title: "Apakah Negara Siap Lindungi Pekerja Informal? ON GIG WORKER",
    speaker: "feat. Menteri Ketenagakerjaan Yassierli",
    summary:
      "Menakar kesiapan regulasi, hak ketenagakerjaan, dan skema jaring pengaman sosial adaptif bagi puluhan juta pekerja informal di era gig economy.",
    thumbnail: "/reformist/thumb-m_62RAy4FlM.jpg",
    duration: "Wawancara Eksklusif",
  },
  {
    id: 3,
    videoId: "ONEKjRk9TG8",
    title: "“Indonesia negara hukum hanya jargon?” - ON JUSTICE REFORM",
    speaker: "ft. Rifqi Assegaf",
    summary:
      "Membongkar integritas lembaga peradilan, dinamika independensi yudisial, dan langkah nyata reformasi hukum yang menyentuh akar sistemik.",
    thumbnail: "/reformist/thumb-ONEKjRk9TG8.jpg",
    duration: "Diskusi Kebijakan",
  },
];

const AUTOPLAY_DURATION = 7000; // 7 seconds per slide

export default function ReformistSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);
  const progressRef = useRef(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeModalVideo, setActiveModalVideo] = useState<ReformistSlide | null>(null);

  // Measure window width for dynamic carousel peeking calculation
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle ESC key and body scroll locking for the video modal
  useEffect(() => {
    if (!activeModalVideo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalVideo(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalVideo]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % REFORMIST_VIDEOS.length);
    setProgressPercent(0);
    progressRef.current = 0;
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + REFORMIST_VIDEOS.length) % REFORMIST_VIDEOS.length);
    setProgressPercent(0);
    progressRef.current = 0;
  }, []);

  // Autoplay timer with progress ring animation (paused when modal is open)
  useEffect(() => {
    if (!isPlaying || activeModalVideo !== null) return;

    const intervalTime = 50;
    const step = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      progressRef.current += step;
      if (progressRef.current >= 100) {
        nextSlide();
      } else {
        setProgressPercent(progressRef.current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeModalVideo, nextSlide]);

  // Card dimensions & track offset calculation (scaled down slightly for cleaner proportions)
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  const cardWidth = isMobile
    ? Math.max(270, windowWidth * 0.80)
    : isTablet
    ? Math.max(460, windowWidth * 0.68)
    : Math.min(720, windowWidth * 0.52);
  const gap = isMobile ? 16 : 24;

  // Track translation placing the active card in the absolute center of the viewport
  const trackOffset = windowWidth / 2 - cardWidth / 2 - currentIndex * (cardWidth + gap);

  return (
    <section className="w-full bg-[#0E0E0E] text-white py-20 sm:py-28 overflow-hidden relative">
      {/* Section Header */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 text-center space-y-3 mb-12 sm:mb-16">
        <h2 className="font-iowan text-[28px] sm:text-[34px] font-normal leading-[120%] text-white tracking-tight">
          The Reformist
        </h2>
        <p className="text-[14px] text-[#9CA3AF] font-inter max-w-[560px] mx-auto leading-relaxed">
          Spotlighting the people, ideas, and stories reshaping the system.
        </p>
      </div>

      {/* Slider Viewport with Fadeout Masking on Left & Right */}
      <div className="relative w-full overflow-hidden select-none py-2 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
        {/* Soft Gradient Fallback Overlays for Left & Right Edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-[#0E0E0E] to-transparent z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-[#0E0E0E] to-transparent z-20"
        />

        <div
          className="flex items-center transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{
            transform: `translateX(${trackOffset}px)`,
            gap: `${gap}px`,
          }}
        >
          {REFORMIST_VIDEOS.map((video, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={video.id}
                onClick={() => {
                  if (isActive) {
                    // Open YouTube popup modal on active card click
                    setActiveModalVideo(video);
                  } else {
                    // Bring card to center
                    setCurrentIndex(index);
                    setProgressPercent(0);
                    progressRef.current = 0;
                  }
                }}
                style={{ width: `${cardWidth}px` }}
                className={`group relative shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] transition-all duration-500 shadow-2xl ${
                  isActive
                    ? "opacity-100 scale-100 cursor-pointer"
                    : "opacity-45 hover:opacity-75 scale-[0.96] cursor-pointer"
                }`}
              >
                {/* Real YouTube Video Thumbnail */}
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 840px"
                />

                {/* Subtle bottom gradient to ensure buttons stay crisp while thumbnail stays fully visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Bar: Tonton Video Button (Left) & Spinner + Pause (Right) */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8 flex items-end justify-between gap-4">
                  {/* Left: Button Tonton Video */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalVideo(video);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/70 hover:bg-[#FA6639] border border-white/25 hover:border-[#FA6639] text-white text-[13px] sm:text-[14px] font-medium font-inter backdrop-blur-md transition-all shadow-lg cursor-pointer group/btn"
                  >
                    <span>Tonton Video</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                  </button>

                  {/* Right: Circular Autoplay Progress Spinner and Pause/Play Control Button */}
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying((prev) => !prev);
                      }}
                      aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                      className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md transition-colors cursor-pointer"
                    >
                      {/* SVG Progress Ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="21"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="21"
                          fill="none"
                          stroke="#FA6639"
                          strokeWidth="1.5"
                          strokeDasharray={132}
                          strokeDashoffset={132 - (132 * progressPercent) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-75"
                        />
                      </svg>

                      {/* Icon */}
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white fill-white transition-transform hover:scale-110" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white translate-x-0.5 transition-transform hover:scale-110" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Navigation Dot Indicators below slider */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {REFORMIST_VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setProgressPercent(0);
                progressRef.current = 0;
              }}
              aria-label={`Go to video ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? "w-8 bg-[#FA6639]" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modern High-UX YouTube Video Modal Popup */}
      {activeModalVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.title}
          onClick={() => setActiveModalVideo(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#1A1A1A]">
              <div className="flex items-center gap-2.5 truncate pr-4">
                <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#FA6639]" />
                <p className="text-[13px] sm:text-[14px] font-medium text-white/90 truncate font-inter">
                  {activeModalVideo.title}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`https://www.youtube.com/watch?v=${activeModalVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] text-white/70 hover:text-[#FA6639] transition-colors"
                >
                  <span className="hidden sm:inline">Buka di YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalVideo(null)}
                  aria-label="Tutup pemutar video"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Responsive 16:9 YouTube Video Player */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.videoId}?autoplay=1&rel=0`}
                title={activeModalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer with Video Details */}
            <div className="p-5 sm:p-6 bg-[#141414] border-t border-white/5 space-y-1.5">
              <p className="text-[12px] font-medium text-[#FA6639] uppercase tracking-wide">
                {activeModalVideo.speaker}
              </p>
              <p className="text-[13.5px] sm:text-[14px] text-white/80 leading-relaxed font-inter">
                {activeModalVideo.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
