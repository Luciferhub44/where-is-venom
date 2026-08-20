import { FaYoutube, FaTiktok, FaInstagram, FaEnvelope, FaGift, FaHeart } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="wv-footer">
      <h3>Where Is Venom?</h3>
      <p>
        Thank you for walking this journey with us. Every prayer, every share,
        every purchase and every contribution has carried our family further
        than you know. We are still believing, still fighting and still
        grateful.
      </p>
      <p className="wv-footer-next">Help us get him to his next surgery.</p>
      <a href="#cups-campaign" className="wv-btn wv-btn-primary wv-footer-cta-btn">
        <FaGift aria-hidden /> Buy / Sponsor a Cup
      </a>

      <div className="wv-footer-final-cta">
        <h4>Help Us Get Him to Surgery.</h4>
        <p>Buy a cup. Sponsor a cup. Share his story. Every action matters.</p>
        <a href="#cups-campaign" className="wv-btn wv-btn-primary">
          <FaHeart aria-hidden /> Support Venom
        </a>
      </div>

      <div className="wv-socials">
        <a href="#" className="wv-social" title="YouTube" aria-label="YouTube">
          <FaYoutube />
        </a>
        <a
          href="https://www.tiktok.com/@queen.xtelle"
          target="_blank"
          rel="noopener noreferrer"
          className="wv-social"
          title="TikTok"
          aria-label="TikTok"
        >
          <FaTiktok />
        </a>
        <a
          href="https://www.instagram.com/queen_xtelle"
          target="_blank"
          rel="noopener noreferrer"
          className="wv-social"
          title="Instagram"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a href="mailto:queenxtelle@gmail.com" className="wv-social" title="Email" aria-label="Email">
          <FaEnvelope />
        </a>
      </div>
      <div className="wv-footer-copy">
        © {new Date().getFullYear()} Queen Xtelle. Made with faith, hope, and love.
      </div>
    </footer>
  );
}
