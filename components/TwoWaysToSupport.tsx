"use client";

import { FaGift, FaHeart } from "react-icons/fa6";
import { useCurrency } from "@/lib/currency-context";
import { formatMoney, priceFor } from "@/lib/currency";
import { CUP_PRICE } from "@/lib/campaign";

export default function TwoWaysToSupport() {
  const { currency } = useCurrency();
  const unitPrice = priceFor(CUP_PRICE, currency);

  return (
    <section className="wv-section">
      <div className="wv-section-header">
        <div className="wv-section-label">How to Help</div>
        <h2>Two Ways to Support Venom</h2>
      </div>
      <div className="wv-ways-grid">
        <div className="wv-way-card">
          <h3>
            <FaGift aria-hidden /> Buy or Sponsor a Cup
          </h3>
          <div className="wv-way-price">{formatMoney(unitPrice, currency)}</div>
          <p>Receive a cup of XS Skin Glow Herbal Soap while supporting the campaign.</p>
          <a href="#cups-campaign" className="wv-btn wv-btn-primary">
            Buy / Sponsor a Cup
          </a>
        </div>
        <div className="wv-way-divider">or</div>
        <div className="wv-way-card">
          <h3>
            <FaHeart aria-hidden /> Give Any Amount
          </h3>
          <p>
            If you don&apos;t need the soap, you can contribute any amount
            toward Venom&apos;s medical care.
          </p>
          <a href="#donate" className="wv-btn wv-btn-ghost">
            Give Any Amount
          </a>
        </div>
      </div>
    </section>
  );
}
