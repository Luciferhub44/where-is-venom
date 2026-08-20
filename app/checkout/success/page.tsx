"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface VerifyResult {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  metadata?: { type?: string; qty?: number };
}

function titleFor(result: VerifyResult): string {
  if (result.metadata?.type === "donation") return "Thank You for Your Donation!";
  if (result.metadata?.type === "cup") return "Thank You for Sponsoring!";
  return "Payment Confirmed!";
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) {
      setError("No payment reference found.");
      setLoading(false);
      return;
    }
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setResult(data);
      })
      .catch((err) => setError(err.message || "Could not verify payment"))
      .finally(() => setLoading(false));
  }, [reference]);

  return (
    <div className="wv-success-page">
      {loading && <p>Verifying your payment…</p>}

      {!loading && error && (
        <>
          <div className="wv-success-icon wv-success-icon-error">
            <FaXmark />
          </div>
          <h1>We couldn&apos;t verify that payment</h1>
          <p>{error}</p>
          <Link href="/" className="wv-btn wv-btn-primary">
            Back to Home
          </Link>
        </>
      )}

      {!loading && result && result.status === "success" && (
        <>
          <div className="wv-success-icon">
            <FaCheck />
          </div>
          <h1>{titleFor(result)}</h1>
          <p>
            We received {result.currency} {result.amount.toLocaleString()}
            {result.metadata?.type === "cup" && result.metadata.qty
              ? ` for ${result.metadata.qty} cup${result.metadata.qty > 1 ? "s" : ""}`
              : ""}{" "}
            — reference <strong>{result.reference}</strong>. A confirmation has been
            sent to your email. Thank you for supporting Venom&apos;s journey.
          </p>
          <Link href="/" className="wv-btn wv-btn-primary">
            Back to Home
          </Link>
        </>
      )}

      {!loading && result && result.status !== "success" && (
        <>
          <div className="wv-success-icon wv-success-icon-error">
            <FaXmark />
          </div>
          <h1>Payment {result.status}</h1>
          <p>
            Your payment was not completed. If this seems wrong, please contact us
            with reference {result.reference}.
          </p>
          <Link href="/" className="wv-btn wv-btn-primary">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Suspense fallback={<div className="wv-success-page"><p>Loading…</p></div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
