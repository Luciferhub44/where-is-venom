"use client";

import { useState } from "react";
import { FaHeart, FaPaperPlane, FaEnvelope, FaLock, FaCheck } from "react-icons/fa6";

export default function ShareMemory() {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Please provide your name and your memory or tribute.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/memory/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim() || "Supporter / Friend",
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Could not submit memory. Please try again or email us directly.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="wv-section wv-section-memorial" id="share-memory">
      <div className="wv-section-header">
        <div className="wv-section-label">Honouring His Life</div>
        <h2>His Story Doesn&apos;t End Here.</h2>
        <div className="wv-memorial-prose">
          <p>
            We cannot change the journey with Venom, but we can continue to tell his story, preserve
            the memories and honour the person he was.
          </p>
          <p>
            If you knew him, we invite you to share a memory. If you found his story along the way,
            thank you for being here.
          </p>
        </div>

        {!formOpen && !submitted && (
          <div className="wv-memorial-cta-group">
            <button
              type="button"
              className="wv-btn wv-btn-primary"
              onClick={() => setFormOpen(true)}
            >
              <FaHeart aria-hidden /> Share a Memory of Venom
            </button>
            <a
              href="mailto:queenxtelle@gmail.com?subject=In%20Memory%20of%20Venom"
              className="wv-btn wv-btn-ghost"
            >
              <FaEnvelope aria-hidden /> Send via Email
            </a>
          </div>
        )}
      </div>

      {formOpen && !submitted && (
        <div className="wv-memory-form-wrap">
          <div className="wv-memory-moderation-badge">
            <FaLock aria-hidden />
            <span>
              All submissions are received privately by our family and reviewed before publication.
            </span>
          </div>

          <form className="wv-memory-form" onSubmit={handleSubmit}>
            <div className="wv-form-row">
              <div className="wv-form-field">
                <label htmlFor="memory-name">Your Name *</label>
                <input
                  id="memory-name"
                  type="text"
                  required
                  placeholder="e.g. Samuel, or a nickname he knew you by"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="wv-form-field">
                <label htmlFor="memory-relation">Relationship to Venom</label>
                <input
                  id="memory-relation"
                  type="text"
                  placeholder="e.g. Friend, Family, Schoolmate, Online Supporter"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                />
              </div>
            </div>

            <div className="wv-form-field">
              <label htmlFor="memory-email">Email Address (Optional — kept private)</label>
              <input
                id="memory-email"
                type="email"
                placeholder="In case our family wants to reach back out"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="wv-form-field">
              <label htmlFor="memory-text">Your Memory, Story, or Tribute *</label>
              <textarea
                id="memory-text"
                rows={5}
                required
                placeholder="Share a story, a moment of laughter, a kind memory, or a heartfelt prayer for his family..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {error && <div className="wv-form-error">{error}</div>}

            <div className="wv-form-actions">
              <button
                type="submit"
                className="wv-btn wv-btn-primary"
                disabled={submitting}
              >
                <FaPaperPlane aria-hidden /> {submitting ? "Sending..." : "Submit Memory to Family"}
              </button>
              <button
                type="button"
                className="wv-btn wv-btn-ghost"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {submitted && (
        <div className="wv-memory-success">
          <div className="wv-memory-success-icon">
            <FaCheck aria-hidden />
          </div>
          <h3>Thank You for Sharing</h3>
          <p>
            Your memory of Venom has been received with love and gratitude. Our family will review
            every submission with care before publishing it to his memorial.
          </p>
        </div>
      )}
    </section>
  );
}
