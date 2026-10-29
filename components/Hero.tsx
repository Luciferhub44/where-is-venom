import Image from "next/image";
import Link from "next/link";
import { FaBookOpen, FaHeart, FaChevronDown } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="wv-hero" id="hero">
      <div className="wv-hero-container">
        <div className="wv-hero-content">
          <div className="wv-hero-eyebrow">A Life Remembered</div>
          <h1 className="wv-hero-title">
            Where Is Venom?
            <span className="wv-hero-tagline">His story. His life. His legacy.</span>
          </h1>

          <div className="wv-hero-prose">
            <p className="wv-hero-highlight">
              A brother. A son. A father. A life that touched so many people.
            </p>
            <p className="wv-hero-sub">
              This is the story of Venom: the journey our family lived through, the love that
              carried us, and the memories we will always hold close.
            </p>
          </div>

          <div className="wv-hero-cta">
            <Link href="#story" className="wv-btn wv-btn-primary">
              <FaBookOpen aria-hidden /> Explore His Story
            </Link>
            <Link href="#beyond" className="wv-btn wv-btn-secondary">
              <FaHeart aria-hidden /> Remember Venom
            </Link>
          </div>
        </div>

        <div className="wv-hero-media">
          <div className="wv-hero-frame">
            <Image
              src="/images/venom-portrait.jpg"
              alt="Venom: A Life Remembered"
              width={675}
              height={1200}
              priority
              className="wv-hero-image"
            />
            <div className="wv-hero-frame-badge">
              <span>In Loving Memory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wv-scroll-hint">
        <span>Scroll to explore</span>
        <FaChevronDown aria-hidden />
      </div>
    </section>
  );
}
