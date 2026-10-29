import { isAdminAuthed } from "@/lib/admin-auth";
import { listTransactions, listMemorialSubmissions } from "@/lib/kv";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function LoginForm({ error }: { error?: string }) {
  return (
    <div className="wv-admin-login">
      <h1>Admin Portal</h1>
      <p style={{ color: "var(--venom-text-dim)", marginBottom: "1.5rem" }}>
        Where Is Venom?: Private Memorial &amp; Campaign Archives
      </p>
      <form method="POST" action="/api/admin/login">
        <input type="password" name="password" placeholder="Admin Password" autoFocus required />
        {error && <div className="wv-modal-error">Incorrect password.</div>}
        <button className="wv-btn wv-btn-primary" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="wv-admin">
        <LoginForm error={error} />
      </main>
    );
  }

  const [transactions, memorialSubmissions] = await Promise.all([
    listTransactions(1000),
    listMemorialSubmissions(200),
  ]);

  const totals = transactions.reduce(
    (acc, t) => {
      const key = `${t.type}_${t.currency}`;
      acc.amounts[key] = (acc.amounts[key] || 0) + t.amount;
      if (t.type === "cup") acc.cups += t.qty || 0;
      return acc;
    },
    { amounts: {} as Record<string, number>, cups: 0 }
  );

  return (
    <main className="wv-admin">
      <div className="wv-admin-header">
        <div>
          <h1>Where Is Venom?: Admin Portal</h1>
          <p style={{ color: "var(--venom-text-dim)", fontSize: "0.95rem" }}>
            Review memorial tributes and view historical campaign records.
          </p>
        </div>
        <div className="wv-admin-actions">
          <a className="wv-btn wv-btn-ghost wv-btn-sm" href="/api/admin/export">
            Export Past CSV
          </a>
          <form method="POST" action="/api/admin/logout">
            <button className="wv-btn wv-btn-ghost wv-btn-sm" type="submit">
              Log Out
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 1: MEMORIAL SUBMISSIONS */}
      <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.4rem", color: "var(--venom-gold-deep)", fontFamily: "Playfair Display, serif" }}>
            Submitted Memories &amp; Tributes ({memorialSubmissions.length})
          </h2>
          <span style={{ fontSize: "0.85rem", color: "var(--venom-text-dim)" }}>
            Awaiting Family Review / Moderation
          </span>
        </div>

        {memorialSubmissions.length === 0 ? (
          <p className="wv-admin-empty">
            No memories submitted yet via the website form. Any submissions through &ldquo;Share a Memory&rdquo;
            will be recorded here and sent to <code>queenxtelle@gmail.com</code>.
          </p>
        ) : (
          <div className="wv-admin-table-wrap">
            <table className="wv-admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Relationship</th>
                  <th>Email</th>
                  <th>Message / Tribute</th>
                </tr>
              </thead>
              <tbody>
                {memorialSubmissions.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.submittedAt).toLocaleString()}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.relationship}</td>
                    <td>{s.email || "-"}</td>
                    <td style={{ maxWidth: "400px", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                      {s.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: HISTORICAL CAMPAIGN ARCHIVE */}
      <hr style={{ borderColor: "var(--venom-border-soft)", margin: "3rem 0 2rem" }} />

      <h2 style={{ fontSize: "1.4rem", color: "var(--venom-text)", fontFamily: "Playfair Display, serif", marginBottom: "1rem" }}>
        Historical Fundraising Records (Concluded)
      </h2>

      <div className="wv-admin-summary">
        {Object.entries(totals.amounts).map(([key, amount]) => {
          const [type, currency] = key.split("_");
          return (
            <div className="wv-admin-stat" key={key}>
              <span className="label">{type === "cup" ? "Cup sales" : "Donations"} ({currency})</span>
              <span className="value">{currency} {amount.toLocaleString()}</span>
            </div>
          );
        })}
        <div className="wv-admin-stat">
          <span className="label">Cups sponsored</span>
          <span className="value">{totals.cups.toLocaleString()}</span>
        </div>
        <div className="wv-admin-stat">
          <span className="label">Historical records</span>
          <span className="value">{transactions.length.toLocaleString()}</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="wv-admin-empty">
          No past transactions logged in Redis storage.
        </p>
      ) : (
        <div className="wv-admin-table-wrap">
          <table className="wv-admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Qty</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Shipping</th>
                <th>Note</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.reference}>
                  <td>{new Date(t.paidAt).toLocaleString()}</td>
                  <td>{t.type}</td>
                  <td>{t.currency} {t.amount.toLocaleString()}</td>
                  <td>{t.qty ?? "-"}</td>
                  <td>{t.email}</td>
                  <td>{t.name ?? "-"}</td>
                  <td>{t.phone ?? "-"}</td>
                  <td>
                    {t.street ? `${t.street}, ${t.city}, ${t.state}, ${t.country}` : "-"}
                  </td>
                  <td>{t.notes || "-"}</td>
                  <td className="mono">{t.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
