"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FaHeart, FaCircleInfo } from "react-icons/fa6";
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
        <div className="wv-section-label">The Archive</div>
        <h2>The Journey: Twelve Episodes. One Life. A Story We Will Never Forget.</h2>
        <div className="wv-archive-intro">
          <p>
            What began as a family’s desperate hope for recovery became a journey that changed us
            forever.
          </p>
          <p>
            Across twelve episodes, we documented the uncertainty, the waiting, the prayers, the
            difficult moments and the love that carried us through.
          </p>
          <p>
            These videos preserve an important part of Venom’s story. They are not the whole of who he
            was, but they are part of what our family lived, what we learned and what we will always
            remember.
          </p>
        </div>

        <div className="wv-visitor-notice">
          <div className="wv-visitor-notice-icon">
            <FaCircleInfo aria-hidden />
          </div>
          <div className="wv-visitor-notice-text">
            <strong>A note to visitors:</strong> This series was originally documented during
            Venom’s medical journey, when our family was hoping and praying for his recovery. Venom has
            since passed away. We have preserved these episodes as part of our family’s story and in
            honour of his life.
          </div>
        </div>
      </div>

      <div className="wv-timeline" ref={containerRef}>
        {EPISODES.map((ep) => (
          <article className="wv-episode" key={ep.num}>
            <div className="wv-episode-num">Episode {ep.num}</div>
            <h3>{ep.title}</h3>
            <p>{ep.body}</p>
            <div className="wv-episode-quote">{ep.quote}</div>

            {ep.num === 12 && (
              <div className="wv-episode-bridge">
                <p className="wv-bridge-title">His Story Doesn&apos;t End Here.</p>
                <p className="wv-bridge-text">
                  Venom&apos;s legacy lives on in every life he touched, every passion he poured his
                  heart into, and every memory our family holds dear.
                </p>
                <Link href="#beyond" className="wv-btn wv-btn-secondary">
                  <FaHeart aria-hidden /> Explore Beyond the Journey
                </Link>
              </div>
            )}

            <div className="wv-episode-video">
              <video
                controls
                preload="none"
                playsInline
                poster={episodePosterSrc(ep.poster)}
                aria-label={`Episode ${ep.num}: ${ep.title}`}
              >
                <source src={episodeVideoSrc(ep.video)} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
