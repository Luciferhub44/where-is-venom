"use client";

import { useEffect, useRef } from "react";
import { EPISODES, episodePosterSrc, episodeVideoSrc } from "@/lib/episodes";

export default function StoryTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    el.querySelectorAll(".wv-episode").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="wv-section" id="story">
      <div className="wv-section-header">
        <div className="wv-section-label">The Journey</div>
        <h2>Twelve Episodes. One Miracle.</h2>
        <p className="lead">
          From the silence and the rumors to the day he came home. Every second
          mattered. Every prayer counted. Watch each episode below.
        </p>
      </div>
      <div className="wv-timeline" ref={containerRef}>
        {EPISODES.map((ep) => (
          <div className="wv-episode" key={ep.num}>
            <div className="wv-episode-num">Episode {ep.num}</div>
            <h3>{ep.title}</h3>
            <p>{ep.body}</p>
            <div className="wv-episode-quote">{ep.quote}</div>
            {ep.num === 12 && (
              <div className="wv-episode-bridge">
                <p>But the story isn&apos;t over.</p>
                <p>We&apos;re still fighting to get Venom to his next surgery.</p>
                <a href="#cups-campaign" className="wv-btn wv-btn-primary">
                  Help Us Get Him There
                </a>
              </div>
            )}
            <div className="wv-episode-video">
              <video controls preload="none" playsInline poster={episodePosterSrc(ep.poster)}>
                <source src={episodeVideoSrc(ep.video)} type="video/mp4" />
              </video>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
