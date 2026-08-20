"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { useCurrency } from "@/lib/currency-context";
import { formatMoney } from "@/lib/currency";
import { DONATION_TIERS } from "@/lib/donations";

export default function DonateSection() {
  const { currency } = useCurrency();
  const tiers = DONATION_TIERS[currency];
  const [customAmount, setCustomAmount] = useState("");
  const [modalAmount, setModalAmount] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openModal(amount: number) {
    setModalAmount(amount);
    setError(null);
  }

  function closeModal() {
    setModalAmount(null);
    setError(null);
    setLoading(false);
  }

  async function confirmDonate() {
    if (!modalAmount) return;
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
        body: JSON.stringify({
          kind: "donation",
          email,
          currency,
          amount: modalAmount,
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

  return (
    <section className="wv-section" id="donate">
      <div className="wv-section-header">
        <div className="wv-section-label">Support the Journey</div>
        <h2>Can&apos;t Buy a Cup? You Can Still Help.</h2>
        <p className="lead">
          If you can&apos;t purchase a cup, you can still support Venom&apos;s
          surgery by contributing any amount.
        </p>
        <p className="lead">
          Funds raised through this campaign will go toward Venom&apos;s
          surgery, medical expenses, rehabilitation and ongoing care.
        </p>
      </div>
      <div className="wv-donate-grid">
        {tiers.map((tier) => (
          <div
            className={`wv-donate-card${tier.featured ? " featured" : ""}`}
            key={tier.amount}
            onClick={() => openModal(tier.amount)}
          >
            <div className="wv-donate-amount">{formatMoney(tier.amount, currency)}</div>
            <p>{tier.label}</p>
            <button className={`wv-btn ${tier.featured ? "wv-btn-primary" : "wv-btn-ghost"}`}>
              Support with {formatMoney(tier.amount, currency)}
            </button>
          </div>
        ))}
      </div>
      <div className="wv-custom-donate">
        <input
          type="number"
          placeholder="Other amount"
          min="1"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
        <button
          className="wv-btn wv-btn-primary"
          onClick={() => {
            const val = parseFloat(customAmount);
            if (val > 0) openModal(val);
          }}
        >
          Donate
        </button>
      </div>

      {modalAmount !== null && (
        <div
          className="wv-modal-overlay active"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="wv-modal">
            <h3>Complete Your Donation</h3>
            <p>
              You&apos;re about to donate{" "}
              <strong style={{ color: "var(--venom-gold)" }}>
                {formatMoney(modalAmount, currency)}
              </strong>{" "}
              to support Venom&apos;s recovery journey.
            </p>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <div className="wv-modal-error">{error}</div>}
            <button className="wv-btn wv-btn-primary" onClick={confirmDonate} disabled={loading}>
              <FaHeart aria-hidden /> {loading ? "Redirecting to Paystack…" : "Confirm Donation"}
            </button>
            <button className="wv-btn wv-btn-ghost" onClick={closeModal} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
