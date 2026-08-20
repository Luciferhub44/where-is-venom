import { FaYoutube, FaTiktok, FaInstagram, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="wv-footer">
      <h3>Where Is Venom?</h3>
      <p>
        Thank you for walking this journey with us. Every prayer, every share,
        every donation is a thread in the miracle. We are forever grateful.
      </p>
      <div className="wv-socials">
        <a href="#" className="wv-social" title="YouTube" aria-label="YouTube">
          <FaYoutube />
        </a>
        <a href="#" className="wv-social" title="TikTok" aria-label="TikTok">
          <FaTiktok />
        </a>
        <a href="#" className="wv-social" title="Instagram" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="#" className="wv-social" title="Email" aria-label="Email">
          <FaEnvelope />
        </a>
      </div>
      <div className="wv-footer-copy">
        © {new Date().getFullYear()} Queen Xtelle. Made with faith, hope, and love.
      </div>
    </footer>
  );
}
