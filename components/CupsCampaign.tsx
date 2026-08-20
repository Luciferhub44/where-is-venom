"use client";

import { useEffect, useMemo, useState } from "react";
import { FaGift, FaMinus, FaPlus } from "react-icons/fa6";
import { useCurrency } from "@/lib/currency-context";
import { formatMoney, priceFor } from "@/lib/currency";
import {
  CAMPAIGN_GOAL_CUPS,
  CUP_DESCRIPTION,
  CUP_IMAGE,
  CUP_PRICE,
  getCampaignStatus,
} from "@/lib/campaign";

interface Props {
  initialCupsSponsored: number;
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

export default function CupsCampaign({ initialCupsSponsored }: Props) {
  const { currency } = useCurrency();
  const countdown = useCountdown();
  const [qty, setQty] = useState(1);
  const [cupsSponsored, setCupsSponsored] = useState(initialCupsSponsored);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
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

  const unitPrice = priceFor(CUP_PRICE, currency);

  async function confirmSponsor() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "cup", email, currency, qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <section className="wv-section" id="cups-campaign">
      <div className="wv-section-header">
        <div className="wv-section-label">Special Campaign</div>
        <h2>2,000 Cups for Venom</h2>
        <p className="lead">
          Support Venom&apos;s journey to surgery. Buy or sponsor a cup of XS Skin
          Glow Herbal Soap for {formatMoney(unitPrice, currency)}, or contribute
          any amount below.
        </p>
      </div>

      <div className="wv-campaign">
        <div className="wv-campaign-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CUP_IMAGE} alt="XS Skin Glow Herbal Soap" />
        </div>

        <div>
          <span className="wv-campaign-badge">2,000 Cups • 3 Days</span>
          <h3>Every cup funds real recovery</h3>
          <p className="desc">{CUP_DESCRIPTION}</p>

          <div className="wv-progress-track">
            <div className="wv-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="wv-progress-stats">
            <span>
              <strong>{cupsSponsored.toLocaleString()}</strong> / {CAMPAIGN_GOAL_CUPS.toLocaleString()} cups claimed
            </span>
            <span>{percent}%</span>
          </div>

          {countdown.isActive ? (
            <div className="wv-countdown">
              <div className="wv-countdown-unit">
                <span className="num">{countdown.days}</span>
                <span className="label">Days</span>
              </div>
              <div className="wv-countdown-unit">
                <span className="num">{String(countdown.hours).padStart(2, "0")}</span>
                <span className="label">Hrs</span>
              </div>
              <div className="wv-countdown-unit">
                <span className="num">{String(countdown.minutes).padStart(2, "0")}</span>
                <span className="label">Min</span>
              </div>
              <div className="wv-countdown-unit">
                <span className="num">{String(countdown.seconds).padStart(2, "0")}</span>
                <span className="label">Sec</span>
              </div>
            </div>
          ) : (
            <p className="wv-campaign-ended">This 3-day campaign window has ended — you can still sponsor a cup below.</p>
          )}

          <div className="wv-campaign-cta">
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
            <button
              className="wv-btn wv-btn-primary"
              onClick={() => {
                setModalOpen(true);
                setError(null);
              }}
            >
              <FaGift aria-hidden /> Sponsor {qty} Cup{qty > 1 ? "s" : ""} — {formatMoney(unitPrice * qty, currency)}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
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
            {error && <div className="wv-modal-error">{error}</div>}
            <button className="wv-btn wv-btn-primary" onClick={confirmSponsor} disabled={loading}>
              <FaGift aria-hidden /> {loading ? "Redirecting to Paystack…" : "Confirm & Pay"}
            </button>
            <button className="wv-btn wv-btn-ghost" onClick={() => setModalOpen(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
