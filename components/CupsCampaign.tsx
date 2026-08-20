"use client";

import { useEffect, useMemo, useState } from "react";
import { FaGift, FaMinus, FaPlus } from "react-icons/fa6";
import { useCurrency } from "@/lib/currency-context";
import { formatMoney, priceFor } from "@/lib/currency";
import {
  CAMPAIGN_GOAL_CUPS,
  CUP_IMAGE,
  CUP_PRICE,
  getCampaignStatus,
} from "@/lib/campaign";

interface Props {
  initialCupsSponsored: number;
  variant?: "full" | "recap";
}

function useCountdown() {
  const [status, setStatus] = useState(() => getCampaignStatus());

  useEffect(() => {
    const id = setInterval(() => setStatus(getCampaignStatus()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = status.msRemaining;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  return { ...status, days, hours, minutes, seconds };
}

export default function CupsCampaign({ initialCupsSponsored, variant = "full" }: Props) {
  const { currency } = useCurrency();
  const countdown = useCountdown();
  const [qty, setQty] = useState(1);
  const [cupsSponsored, setCupsSponsored] = useState(initialCupsSponsored);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll for a fresher count while the page is open (cheap GET, works with
  // or without Redis configured).
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/cups-progress")
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.cupsSponsored === "number") setCupsSponsored(d.cupsSponsored);
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const percent = useMemo(
    () => Math.min(100, Math.round((cupsSponsored / CAMPAIGN_GOAL_CUPS) * 100)),
    [cupsSponsored]
  );
  const cupsRemaining = Math.max(0, CAMPAIGN_GOAL_CUPS - cupsSponsored);

  const unitPrice = priceFor(CUP_PRICE, currency);

  async function confirmSponsor() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    if (!street.trim() || !city.trim() || !state.trim() || !country.trim()) {
      setError("Please fill in your full shipping address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "cup",
          email,
          currency,
          qty,
          name,
          phone,
          street,
          city,
          state,
          country,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const qtyPicker = (
    <div className="wv-qty-picker">
      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
        <FaMinus />
      </button>
      <input
        value={qty}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          setQty(Number.isFinite(v) && v > 0 ? v : 1);
        }}
        inputMode="numeric"
      />
      <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
        <FaPlus />
      </button>
    </div>
  );

  const ctaButton = (
    <button
      className="wv-btn wv-btn-primary"
      onClick={() => {
        setModalOpen(true);
        setError(null);
      }}
    >
      <FaGift aria-hidden /> Buy / Sponsor {qty} Cup{qty > 1 ? "s" : ""} — {formatMoney(unitPrice * qty, currency)}
    </button>
  );

  const progressBlock = (
    <div className="wv-progress-block">
      <div className="wv-progress-track">
        <div className="wv-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="wv-progress-stats">
        <span>
          <strong>{cupsSponsored.toLocaleString()}</strong> / {CAMPAIGN_GOAL_CUPS.toLocaleString()} cups claimed
        </span>
        <span>{percent}%</span>
      </div>
      <p className="wv-progress-remaining">{cupsRemaining.toLocaleString()} cups to go.</p>
    </div>
  );

  const modal = modalOpen && (
    <div
      className="wv-modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) setModalOpen(false);
      }}
    >
      <div className="wv-modal">
        <h3>Confirm Your Sponsorship</h3>
        <p>
          You&apos;re sponsoring{" "}
          <strong style={{ color: "var(--venom-gold)" }}>
            {qty} cup{qty > 1 ? "s" : ""}
          </strong>{" "}
          ({formatMoney(unitPrice * qty, currency)}) toward Venom&apos;s surgery fund.
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <div className="wv-modal-row">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <textarea
          placeholder="A short prayer or note for Venom (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
        {error && <div className="wv-modal-error">{error}</div>}
        <button className="wv-btn wv-btn-primary" onClick={confirmSponsor} disabled={loading}>
          <FaGift aria-hidden /> {loading ? "Redirecting to Paystack…" : "Confirm & Pay"}
        </button>
        <button className="wv-btn wv-btn-ghost" onClick={() => setModalOpen(false)} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );

  if (variant === "recap") {
    return (
      <section className="wv-section">
        <div className="wv-campaign-recap">
          <div className="wv-section-label">The Fight Continues</div>
          <h2>2,000 Cups for Venom</h2>
          <p className="lead">
            We are raising funds for Venom&apos;s surgery through a special 3-day campaign.
          </p>
          <p className="wv-recap-price">
            {formatMoney(unitPrice, currency)} — 1 cup of XS Skin Glow Herbal Soap
          </p>
          <div className="wv-campaign-cta centered">
            {qtyPicker}
            {ctaButton}
          </div>
          {progressBlock}
        </div>
        {modal}
      </section>
    );
  }

  return (
    <section className="wv-section" id="cups-campaign">
      <div className="wv-section-header">
        <div className="wv-section-label">Special Campaign</div>
        <h2>2,000 Cups for Venom</h2>
        <p className="lead">
          3 Days. 2,000 Cups. One surgery we&apos;re fighting to make happen.
        </p>
        <p className="lead">
          Support Venom&apos;s journey to surgery by buying or sponsoring a cup of
          XS Skin Glow Herbal Soap for {formatMoney(unitPrice, currency)}.
        </p>
      </div>

      <div className="wv-campaign-top">
        {countdown.isActive ? (
          <div className="wv-countdown">
            <div className="wv-countdown-unit">
              <span className="num" suppressHydrationWarning>{countdown.days}</span>
              <span className="label">Days</span>
            </div>
            <div className="wv-countdown-unit">
              <span className="num" suppressHydrationWarning>{String(countdown.hours).padStart(2, "0")}</span>
              <span className="label">Hrs</span>
            </div>
            <div className="wv-countdown-unit">
              <span className="num" suppressHydrationWarning>{String(countdown.minutes).padStart(2, "0")}</span>
              <span className="label">Min</span>
            </div>
            <div className="wv-countdown-unit">
              <span className="num" suppressHydrationWarning>{String(countdown.seconds).padStart(2, "0")}</span>
              <span className="label">Sec</span>
            </div>
          </div>
        ) : (
          <p className="wv-campaign-ended">This 3-day campaign window has ended — you can still sponsor a cup below.</p>
        )}

        <div className="wv-campaign-cta centered">
          {qtyPicker}
          {ctaButton}
        </div>

        {progressBlock}
      </div>

      <div className="wv-campaign">
        <div className="wv-campaign-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CUP_IMAGE} alt="XS Skin Glow Herbal Soap" />
        </div>

        <div>
          <h3>Every cup brings us closer.</h3>
          <p className="desc">
            Buy or sponsor a cup of XS Skin Glow Herbal Soap and help us raise
            what is needed for Venom&apos;s surgery. Every cup purchased is a
            real jar of XS Skin Glow Herbal Soap by Xtelle Secrets.
          </p>

          <div className="wv-product-details">
            <h4>XS Skin Glow Herbal Soap</h4>
            <div className="wv-product-price">{formatMoney(unitPrice, currency)} per cup</div>
            <p>
              A skincare herbal soap made with African black soap and
              skin-nourishing ingredients.
            </p>
            <p>
              <strong>It is not a bleaching soap.</strong> It is suitable for
              anyone who wants a nourishing skincare soap.
            </p>
          </div>

          <div className="wv-dispatch-note">
            <strong>Please note:</strong> These soaps are handmade and
            produced in batches. Dispatch will begin after the 3-day campaign
            closes. Thank you for your patience and for supporting Venom
            through your purchase.
          </div>
        </div>
      </div>

      {modal}
    </section>
  );
}
