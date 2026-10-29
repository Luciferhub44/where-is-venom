import Link from "next/link";
import { FaTiktok, FaInstagram, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="wv-footer" id="contact">
      <div className="wv-footer-inner">
        <div className="wv-footer-brand">
          <h3>Where Is Venom?</h3>
          <p className="wv-footer-sub">A life remembered. His story, life, and lasting legacy.</p>
        </div>

        <nav className="wv-footer-nav" aria-label="Footer Navigation">
          <Link href="/#hero">Home</Link>
          <Link href="/#story">His Story</Link>
          <Link href="/#beyond">Memories</Link>
          <Link href="/#share-memory">Share a Memory</Link>
        </nav>

        <div className="wv-socials">
          <a
            href="https://www.tiktok.com/@queen.xtelle"
            target="_blank"
            rel="noopener noreferrer"
            className="wv-social"
            title="TikTok: Queen Xtelle"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.instagram.com/queen_xtelle"
            target="_blank"
            rel="noopener noreferrer"
            className="wv-social"
            title="Instagram: Queen Xtelle"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="mailto:queenxtelle@gmail.com"
            className="wv-social"
            title="Email Queen Xtelle"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>

        <div className="wv-footer-contact">
          <span>Inquiries &amp; Family Contact: </span>
          <a href="mailto:queenxtelle@gmail.com">queenxtelle@gmail.com</a>
        </div>

        <div className="wv-footer-copy">
          <p>© {new Date().getFullYear()} Queen Xtelle. All rights reserved.</p>
          <p className="wv-footer-tagline">Made with faith, love and remembrance.</p>
        </div>
      </div>
    </footer>
  );
}
