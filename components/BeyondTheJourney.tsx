import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaImage, FaUsers, FaEnvelopeOpenText } from "react-icons/fa6";

export default function BeyondTheJourney() {
  return (
    <section className="wv-section wv-section-memorial" id="beyond">
      <div className="wv-section-header">
        <div className="wv-section-label">Legacy &amp; Remembrance</div>
        <h2>Beyond the Journey</h2>
        <p className="lead">
          Venom was so much more than the medical battle he fought. He was a creator, a father, a
          cherished brother, and a friend whose presence brought life into every room. Here, we
          celebrate who he truly was.
        </p>
      </div>

      <div className="wv-pillars-grid">
        {/* Pillar 1: The Man We Knew */}
        <div className="wv-pillar-card">
          <div className="wv-pillar-icon">
            <FaHeart aria-hidden />
          </div>
          <div className="wv-pillar-tag">Personality &amp; Spirit</div>
          <h3>The Man We Knew</h3>
          <p>
            Venom had an undeniable spark, full of creative ambition, warmth, and resilience. Whether
            he was designing, customizing, or making those around him laugh, his passion for life was
            contagious.
          </p>
          <ul className="wv-pillar-highlights">
            <li>
              <strong>Creative Heart:</strong> Known for his dedication to craft and custom artistry.
            </li>
            <li>
              <strong>Devoted Father &amp; Brother:</strong> Grounded by deep love for his family.
            </li>
            <li>
              <strong>Quiet Strength:</strong> A gentle soul who carried his spirit with humility and
              grace.
            </li>
          </ul>
        </div>

        {/* Pillar 2: The Memories We Keep */}
        <div className="wv-pillar-card">
          <div className="wv-pillar-icon">
            <FaImage aria-hidden />
          </div>
          <div className="wv-pillar-tag">Moments Preserved</div>
          <h3>The Memories We Keep</h3>
          <p>
            Everyday laughter, car rides, late-night conversations, and the small moments that now mean
            the most. We are curating our family&apos;s collection of photographs and videos.
          </p>

          <div className="wv-pillar-photo">
            <Image
              src="/images/venom-memory-car.jpg"
              alt="Venom: Moments of joy"
              width={540}
              height={960}
              className="wv-pillar-img"
            />
            <span className="wv-pillar-photo-caption">
              Moments of joy, laughter, and brotherhood.
            </span>
          </div>
          <p className="wv-pillar-note">
            <em>More photographs and personal video archives will be added here over time.</em>
          </p>
        </div>

        {/* Pillar 3: The Love He Left Behind */}
        <div className="wv-pillar-card">
          <div className="wv-pillar-icon">
            <FaUsers aria-hidden />
          </div>
          <div className="wv-pillar-tag">Family &amp; Bonds</div>
          <h3>The Love He Left Behind</h3>
          <p>
            The mark of a life well-lived is the depth of love it leaves behind. Venom was surrounded
            by an unbreakable family, lifelong friends, and a community of people whose lives he
            touched.
          </p>
          <blockquote className="wv-pillar-quote">
            &ldquo;We carry his name not in sorrow, but with the quiet pride of having known and loved
            him.&rdquo;
          </blockquote>
          <p className="wv-pillar-note">
            Dedicated to his family, child, and the true friends who walked with him every step of the
            way.
          </p>
        </div>

        {/* Pillar 4: Letters and Tributes */}
        <div className="wv-pillar-card">
          <div className="wv-pillar-icon">
            <FaEnvelopeOpenText aria-hidden />
          </div>
          <div className="wv-pillar-tag">Words &amp; Remembrances</div>
          <h3>Letters &amp; Tributes</h3>
          <p>
            A curated space where family, friends, and supporters can contribute letters, tributes,
            and shared memories. Each submission is preserved with care as part of his digital memorial.
          </p>
          <div className="wv-pillar-action">
            <p className="wv-pillar-action-desc">
              Do you have a personal memory or tribute to share?
            </p>
            <Link href="#share-memory" className="wv-btn wv-btn-secondary wv-btn-sm">
              Leave a Tribute for Venom
            </Link>
          </div>
          <p className="wv-pillar-note">
            <em>All submissions are privately received and reviewed by the family before appearing.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
