import { isAdminAuthed } from "@/lib/admin-auth";
import { listTransactions } from "@/lib/kv";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function LoginForm({ error }: { error?: string }) {
  return (
    <div className="wv-admin-login">
      <h1>Admin</h1>
      <form method="POST" action="/api/admin/login">
        <input type="password" name="password" placeholder="Password" autoFocus required />
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

  const transactions = await listTransactions(1000);

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
        <h1>Donations &amp; Cup Purchases</h1>
        <div className="wv-admin-actions">
          <a className="wv-btn wv-btn-ghost wv-btn-sm" href="/api/admin/export">
            Export CSV
          </a>
          <form method="POST" action="/api/admin/logout">
            <button className="wv-btn wv-btn-ghost wv-btn-sm" type="submit">
              Log Out
            </button>
          </form>
        </div>
      </div>

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
          <span className="label">Total records</span>
          <span className="value">{transactions.length.toLocaleString()}</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="wv-admin-empty">
          No transactions recorded yet. This list fills as Paystack sends{" "}
          <code>charge.success</code> webhooks — make sure Redis is connected
          and the webhook URL is configured in the Paystack dashboard.
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
                  <td>{t.qty ?? "—"}</td>
                  <td>{t.email}</td>
                  <td>{t.name ?? "—"}</td>
                  <td>{t.phone ?? "—"}</td>
                  <td>
                    {t.street ? `${t.street}, ${t.city}, ${t.state}, ${t.country}` : "—"}
                  </td>
                  <td>{t.notes || "—"}</td>
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
