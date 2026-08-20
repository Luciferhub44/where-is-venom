const STATS = [
  { value: "2+", label: "Years of Recovery" },
  { value: "12", label: "Episodes of Hope" },
  { value: "1", label: "Miracle" },
  { value: "∞", label: "Prayers Answered" },
];

export default function ImpactStats() {
  return (
    <section className="wv-section">
      <div className="wv-section-header">
        <div className="wv-section-label">The Impact</div>
        <h2>Your Support Changes Everything</h2>
        <p className="lead">
          Every donation goes directly toward Venom&apos;s ongoing medical care,
          rehabilitation, and the family&apos;s recovery journey.
        </p>
      </div>
      <div className="wv-impact">
        <div className="wv-impact-grid">
          {STATS.map((s) => (
            <div className="wv-impact-item" key={s.label}>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
