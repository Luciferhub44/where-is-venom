import { FaHeart, FaChevronDown } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="wv-hero">
      <div className="wv-hero-eyebrow">A True Story of Faith &amp; Recovery</div>
      <h1>
        Where Is Venom?
        <span>The story we never imagined we&apos;d have to tell.</span>
      </h1>
      <p className="wv-hero-sub">
        Two years ago, my brother&apos;s life changed in a matter of seconds. This is
        our journey through the darkest days, the prayers, and the miracles that
        brought him home.
      </p>
      <div className="wv-hero-cta">
        <a href="#donate" className="wv-btn wv-btn-primary">
          <FaHeart aria-hidden /> Support the Journey
        </a>
        <a href="#story" className="wv-btn wv-btn-ghost">
          Read Our Story
        </a>
      </div>
      <div className="wv-scroll-hint">
        <span>Scroll</span>
        <FaChevronDown aria-hidden />
      </div>
    </section>
  );
}
