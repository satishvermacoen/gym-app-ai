"use client"

import Head from "next/head";

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <>
      <Head>
        <title>Gym Fussion – All‑in‑one Gym ERP</title>
        <meta
          name="description"
          content="Gym Fussion is an all‑in‑one ERP to manage multi‑branch gyms: members, employees, billing, inventory, analytics and more."
        />
        <meta name="theme-color" content="#6e59f5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header>
        <div className="container nav">
          <a className="brand" href="#top" aria-label="Gym Fussion – Home">
            <span className="logo" aria-hidden="true" />
            <b>Gym Fussion</b>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#showcase">Preview</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-secondary" href="#pricing">
              Pricing
            </a>
            <a className="btn btn-primary" href="#cta">
              Start Free Trial
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero" id="top">
        <div className="container hero-wrap">
          <div>
            <div className="badge eyebrow">New: Multi‑branch analytics & inventory tracking</div>
            <h1 className="title">Run all your gyms from one beautiful dashboard.</h1>
            <p className="subtitle">
              Gym Fussion is the modern ERP built for multi‑branch gym owners. Manage members, staff, billing, attendance, inventory, and finance reports — in minutes, not months.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="/signup">
                Get Started — It’s Free
              </a>
              <a className="btn btn-secondary" href="/login">
               Login
              </a>
              <span className="muted">No credit card. 14‑day trial.</span>
            </div>
          </div>
          <div className="mock shine" aria-label="Product preview">
            <div className="bar">
              <div className="dots" aria-hidden="true">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="muted">dashboard.gym‑fussion.app</span>
            </div>
            <div className="kpis">
              <div className="kpi">
                <b>Active Members</b>
                <div className="value">2,348</div>
              </div>
              <div className="kpi">
                <b>Monthly Revenue</b>
                <div className="value">₹12.4L</div>
              </div>
              <div className="kpi">
                <b>Attendance Today</b>
                <div className="value">712</div>
              </div>
            </div>
            <div className="chart">
              <div className="bars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="trust">
        <div className="container row">
          <div className="pill">Trusted by 250+ gyms</div>
          <div className="pill">99.9% uptime</div>
          <div className="pill">Made for India 🇮🇳</div>
          <div className="pill">GDPR‑ready</div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <h2>Everything you need to grow — built in</h2>
          <p className="lead">
            From multi‑branch control to staff payroll and GST‑friendly invoicing, Gym Fussion replaces spreadsheets with a single, reliable system.
          </p>

          <div className="feature-grid">
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                🏢
              </div>
              <h3>Multi‑branch HQ</h3>
              <p>Centralise branches, roles, and permissions. Switch branches without changing URLs.</p>
            </article>
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                🧑‍🤝‍🧑
              </div>
              <h3>Member CRM</h3>
              <p>Leads, trials, renewals, freeze — with reminders and smart filters.</p>
            </article>
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                💳
              </div>
              <h3>Billing & Invoices</h3>
              <p>GST invoices, receipts, and automated payment tracking with exports.</p>
            </article>
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                🕒
              </div>
              <h3>Attendance & Access</h3>
              <p>Track check‑ins, classes, and capacity in real‑time.</p>
            </article>
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                📦
              </div>
              <h3>Inventory</h3>
              <p>Manage supplements, gear, and POS with stock alerts.</p>
            </article>
            <article className="feature hover-raise">
              <div className="icon" aria-hidden="true">
                📊
              </div>
              <h3>Reports & Analytics</h3>
              <p>Revenue, churn, cohort, and branch comparisons — export anytime.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="section" id="showcase">
        <div className="container showcase">
          <div className="preview">
            <div className="top">
              <div className="mini-card">
                <div className="muted">Renewals this week</div>
                <div className="price" style={{ fontSize: 26 }}>
                  148
                </div>
                <div className="progress">
                  <i style={{ width: "78%" }} />
                </div>
              </div>
              <div className="mini-card">
                <div className="muted">New signups</div>
                <div className="price" style={{ fontSize: 26 }}>
                  96
                </div>
                <div className="progress">
                  <i style={{ width: "62%" }} />
                </div>
              </div>
            </div>
            <div className="spark">
              <div className="line" aria-hidden="true">
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
              </div>
            </div>
          </div>
          <div>
            <h2>Beautiful, fast, and reliable</h2>
            <p className="lead">
              We obsess over the tiny details so you don’t have to — gorgeous UI, blazing performance, and exports that your accountant will love.
            </p>
            <ul className="ul">
              <li>
                <span className="tick">✓</span> Works great on desktop & mobile
              </li>
              <li>
                <span className="tick">✓</span> Role‑based access for owners, managers, trainers
              </li>
              <li>
                <span className="tick">✓</span> Secure by default — encrypted, audited, backed‑up
              </li>
              <li>
                <span className="tick">✓</span> Import existing data from spreadsheets
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="container">
          <h2>Simple pricing that scales with you</h2>
          <p className="lead">14‑day free trial • Cancel anytime • No setup fees</p>
          <div className="pricing">
            <article className="plan hover-raise" aria-label="Starter plan">
              <h3>Starter</h3>
              <div className="price">
                ₹799 <small>/ branch / month</small>
              </div>
              <ul className="ul">
                <li>
                  <span className="tick">✓</span> 1 branch
                </li>
                <li>
                  <span className="tick">✓</span> Unlimited members
                </li>
                <li>
                  <span className="tick">✓</span> Billing & invoices
                </li>
                <li>
                  <span className="tick">✓</span> Basic reports
                </li>
              </ul>
              <div style={{ marginTop: 18 }}>
                <a className="btn btn-secondary" href="#cta">
                  Choose Starter
                </a>
              </div>
            </article>
            <article className="plan popular hover-raise" aria-label="Growth plan">
              <div className="badge" style={{ position: "absolute", right: 18, top: 18 }}>
                Most Popular
              </div>
              <h3>Growth</h3>
              <div className="price">
                ₹1,499 <small>/ branch / month</small>
              </div>
              <ul className="ul">
                <li>
                  <span className="tick">✓</span> Up to 5 branches
                </li>
                <li>
                  <span className="tick">✓</span> Advanced analytics
                </li>
                <li>
                  <span className="tick">✓</span> Attendance & classes
                </li>
                <li>
                  <span className="tick">✓</span> Priority support
                </li>
              </ul>
              <div style={{ marginTop: 18 }}>
                <a className="btn btn-primary" href="#cta">
                  Choose Growth
                </a>
              </div>
            </article>
            <article className="plan hover-raise" aria-label="Scale plan">
              <h3>Scale</h3>
              <div className="price">
                Custom <small>/ multi‑location</small>
              </div>
              <ul className="ul">
                <li>
                  <span className="tick">✓</span> Unlimited branches
                </li>
                <li>
                  <span className="tick">✓</span> Custom roles & SSO
                </li>
                <li>
                  <span className="tick">✓</span> Dedicated manager
                </li>
                <li>
                  <span className="tick">✓</span> SLA & onboarding
                </li>
              </ul>
              <div style={{ marginTop: 18 }}>
                <a className="btn btn-secondary" href="#contact">
                  Talk to Sales
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="testimonials">
        <div className="container">
          <h2>Loved by ambitious gym owners</h2>
          <p className="lead">
            Teams across India use Gym Fussion to grow memberships, simplify accounts, and delight members.
          </p>
          <div className="testi">
            <figure className="quote hover-raise">
              <p>
                “Switched from spreadsheets and recovered 6+ hours/week. The renewal reminders are gold.”
              </p>
              <figcaption className="who">
                <span className="avatar" aria-hidden="true" />
                <div>
                  <b>Ravi Sharma</b>
                  <div className="muted">FitNation, Pune</div>
                </div>
              </figcaption>
            </figure>
            <figure className="quote hover-raise">
              <p>“Multi‑branch view is excellent. I can compare revenue across locations in one click.”</p>
              <figcaption className="who">
                <span className="avatar" aria-hidden="true" />
                <div>
                  <b>Neha Patel</b>
                  <div className="muted">PowerHouse, Ahmedabad</div>
                </div>
              </figcaption>
            </figure>
            <figure className="quote hover-raise">
              <p>“Invoices with GST are seamless, and the exports make my CA very happy.”</p>
              <figcaption className="who">
                <span className="avatar" aria-hidden="true" />
                <div>
                  <b>Arjun Singh</b>
                  <div className="muted">IronWorks, Delhi</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" id="cta">
        <div className="container">
          <div className="cta">
            <div>
              <h2 style={{ margin: 0 }}>Ready to grow with Gym Fussion?</h2>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                Start your 14‑day free trial. Set up in minutes.
              </p>
            </div>
            <div className="row">
              <a className="btn btn-primary" href="#">
                Create your account
              </a>
              <a className="btn btn-secondary" href="#showcase">
                View a sample dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <h2>Frequently asked questions</h2>
          <div className="faq">
            <details>
              <summary>Is there a free trial?</summary>
              <p>Yes, you get full access for 14 days. No credit card required.</p>
            </details>
            <details>
              <summary>Can I use Gym Fussion for multiple branches?</summary>
              <p>
                Absolutely. Add branches anytime and manage everything from one dashboard.
              </p>
            </details>
            <details>
              <summary>Do you support GST invoices?</summary>
              <p>Yes — create GST‑compliant invoices and export ledgers for accounting.</p>
            </details>
            <details>
              <summary>Is my data secure?</summary>
              <p>Your data is encrypted at rest and in transit with regular backups.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="container foot">
          <div>
            <a className="brand" href="#top">
              <span className="logo" aria-hidden="true" />
              <b>Gym Fussion</b>
            </a>
            <p className="tiny" style={{ marginTop: 10 }}>
              © <span>{year}</span> Gym Fussion. All rights reserved.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}
            >
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#showcase">Preview</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}
            >
              <a href="#contact">Contact</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles ported from the HTML version */}
      <style jsx global>{`
        :root {
          --bg: #0b1020;
          --bg-2: #0e1530;
          --surface: #111936;
          --surface-2: #151e3f;
          --card: #0e142b;
          --text: #e7eaf6;
          --muted: #a9b0c7;
          --primary: #7c5cff; /* brand */
          --primary-2: #4ddbd7; /* accent */
          --warning: #ffb84d;
          --success: #3ed598;
          --danger: #ff6b6b;
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          --radius: 18px;
          --radius-sm: 12px;
          --ring: 0 0 0 3px rgba(124, 92, 255, 0.25);
          --max: 1200px;
        }

        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          background: radial-gradient(
              1200px 700px at 80% -10%,
              rgba(124, 92, 255, 0.15),
              transparent 50%
            ),
            radial-gradient(
              900px 600px at 0% 0%,
              rgba(77, 219, 215, 0.08),
              transparent 60%
            ),
            linear-gradient(180deg, var(--bg), var(--bg-2));
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial,
            "Apple Color Emoji", "Segoe UI Emoji";
          line-height: 1.55;
          letter-spacing: 0.2px;
        }

        /* Utilities */
        .container {
          max-width: var(--max);
          margin-inline: auto;
          padding-inline: clamp(16px, 4vw, 28px);
        }
        .grid {
          display: grid;
          gap: 24px;
        }
        .row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn {
          appearance: none;
          border: 0;
          cursor: pointer;
          padding: 14px 22px;
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.08s ease, box-shadow 0.25s ease,
            background 0.25s ease;
        }
        .btn:focus-visible {
          outline: none;
          box-shadow: var(--ring);
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary), #5a3bff);
          color: white;
          box-shadow: 0 12px 30px rgba(124, 92, 255, 0.35);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(124, 92, 255, 0.1);
          color: #d9d2ff;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .muted {
          color: var(--muted);
        }
        .card {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.01)
          );
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        /* Header */
        header {
          position: sticky;
          top: 0;
          backdrop-filter: blur(10px);
          background: rgba(10, 15, 34, 0.65);
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text);
        }
        .logo {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: conic-gradient(
            from 180deg at 50% 50%,
            var(--primary),
            var(--primary-2),
            #8b5cf6,
            var(--primary)
          );
          box-shadow: 0 6px 20px rgba(77, 219, 215, 0.25);
        }
        .brand b {
          font-family: Poppins, Inter, sans-serif;
          font-weight: 700;
          letter-spacing: 0.4px;
        }
        .nav a {
          color: var(--muted);
          text-decoration: none;
          font-weight: 600;
        }
        .nav-links {
          display: flex;
          gap: 22px;
          align-items: center;
        }
        .nav-cta {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        /* Hero */
        .hero {
          padding: clamp(48px, 8vw, 96px) 0;
        }
        .hero-wrap {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(32px, 6vw, 64px);
          align-items: center;
        }
        .eyebrow {
          margin-bottom: 16px;
        }
        .title {
          font-family: Poppins, Inter, sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.05;
          margin: 0 0 14px;
          letter-spacing: 0.3px;
        }
        .subtitle {
          font-size: clamp(16px, 2.5vw, 18px);
          color: var(--muted);
          max-width: 58ch;
        }
        .hero-cta {
          margin-top: 26px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Hero mock */
        .mock {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius);
          padding: 18px;
          background: linear-gradient(
              160deg,
              rgba(124, 92, 255, 0.2),
              rgba(20, 30, 64, 0.9)
            ),
            radial-gradient(
              1200px 600px at 20% 10%,
              rgba(77, 219, 215, 0.18),
              transparent
            );
          border: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
        }
        .mock .bar {
          height: 38px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-inline: 12px;
        }
        .dots {
          display: flex;
          gap: 8px;
          margin-right: 10px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .dot.red {
          background: #ff6b6b;
        }
        .dot.yellow {
          background: #ffd93d;
        }
        .dot.green {
          background: #6ef3a5;
        }
        .kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 14px;
        }
        .kpi {
          background: rgba(10, 15, 34, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
        }
        .kpi b {
          display: block;
          font-size: 12px;
          color: #cfd5ec;
          letter-spacing: 0.3px;
        }
        .kpi .value {
          font-weight: 800;
          font-size: 22px;
          margin-top: 6px;
        }
        .chart {
          margin-top: 14px;
          height: 160px;
          border-radius: 12px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.02)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }
        .bars {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 10px;
        }
        .bars span {
          flex: 1;
          height: 20%;
          background: linear-gradient(180deg, var(--primary-2), var(--primary));
          border-radius: 6px;
        }
        .bars span:nth-child(3) {
          height: 60%;
        }
        .bars span:nth-child(4) {
          height: 30%;
        }
        .bars span:nth-child(5) {
          height: 80%;
        }
        .bars span:nth-child(6) {
          height: 45%;
        }
        .bars span:nth-child(7) {
          height: 65%;
        }
        .bars span:nth-child(8) {
          height: 35%;
        }
        .bars span:nth-child(9) {
          height: 85%;
        }
        .glow {
          position: absolute;
          inset: -40% -30% auto auto;
          width: 520px;
          height: 520px;
          background: radial-gradient(
            closest-side,
            rgba(124, 92, 255, 0.35),
            transparent 70%
          );
          filter: blur(20px);
          pointer-events: none;
        }

        /* Trust */
        .trust {
          padding: 14px 0 54px;
        }
        .trust .row {
          align-items: center;
          justify-content: center;
          gap: 30px;
        }
        .trust .pill {
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          color: #cfd5ec;
          font-weight: 600;
        }

        /* Sections */
        .section {
          padding: clamp(56px, 8vw, 96px) 0;
        }
        .section h2 {
          font-family: Poppins, Inter, sans-serif;
          font-size: clamp(26px, 3.8vw, 42px);
          margin: 0 0 12px;
        }
        .section p.lead {
          color: var(--muted);
          margin: 0 0 24px;
          max-width: 70ch;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .feature {
          padding: 20px;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .feature .icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            rgba(124, 92, 255, 0.25),
            rgba(77, 219, 215, 0.25)
          );
          margin-bottom: 12px;
        }
        .feature h3 {
          margin: 0 0 6px;
          font-size: 18px;
        }
        .feature p {
          margin: 0;
          color: var(--muted);
        }

        /* Showcase */
        .showcase {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
          align-items: center;
        }
        .preview {
          padding: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.01)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        .preview .top {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .mini-card {
          flex: 1;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .progress {
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 10px;
        }
        .progress i {
          display: block;
          height: 100%;
          width: 65%;
          background: linear-gradient(90deg, var(--success), var(--primary));
        }
        .spark {
          height: 160px;
          border-radius: 12px;
          background: repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06),
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px,
              transparent 40px
            ),
            linear-gradient(180deg, rgba(124, 92, 255, 0.22), rgba(18, 24, 52, 0.6));
          position: relative;
          overflow: hidden;
        }
        .spark .line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 16px;
          align-items: flex-end;
          height: 100%;
          padding: 0 8px 8px;
        }
        .spark .line b {
          flex: 1;
          height: 20%;
          background: linear-gradient(180deg, var(--primary-2), var(--primary));
          border-radius: 6px;
        }
        .spark .line b:nth-child(4) {
          height: 70%;
        }
        .spark .line b:nth-child(6) {
          height: 86%;
        }
        .spark .line b:nth-child(8) {
          height: 60%;
        }

        /* Pricing */
        .pricing {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .plan {
          padding: 24px;
          border-radius: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }
        .plan.popular {
          border-color: rgba(124, 92, 255, 0.5);
          box-shadow: 0 20px 60px rgba(124, 92, 255, 0.15);
        }
        .plan h3 {
          margin: 0 0 10px;
        }
        .price {
          font-family: Poppins, Inter, sans-serif;
          font-size: 40px;
          font-weight: 700;
          display: flex;
          align-items: flex-end;
          gap: 6px;
        }
        .price small {
          font-size: 14px;
          color: var(--muted);
        }
        .ul {
          list-style: none;
          padding: 0;
          margin: 16px 0 0;
          display: grid;
          gap: 10px;
        }
        .ul li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cfd5ec;
        }
        .tick {
          width: 18px;
          height: 18px;
          display: inline-grid;
          place-items: center;
          border-radius: 5px;
          background: rgba(62, 213, 152, 0.18);
          color: #b8ffdd;
          font-size: 12px;
        }

        /* Testimonials */
        .testi {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .quote {
          padding: 20px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }
        .quote p {
          margin: 0 0 12px;
        }
        .quote .who {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--primary), var(--primary-2));
        }

        /* FAQ */
        .faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        details {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
        }
        summary {
          cursor: pointer;
          font-weight: 700;
        }
        details p {
          color: var(--muted);
        }

        /* CTA */
        .cta {
          padding: 30px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            135deg,
            rgba(124, 92, 255, 0.22),
            rgba(18, 24, 52, 0.6)
          );
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        /* Footer */
        footer {
          padding: 40px 0 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .foot {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr;
          gap: 24px;
        }
        .foot a {
          color: #cfd5ec;
          text-decoration: none;
        }
        .tiny {
          color: #8d95b1;
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 1000px) {
          .hero-wrap,
          .showcase {
            grid-template-columns: 1fr;
          }
          .feature-grid {
            grid-template-columns: 1fr 1fr;
          }
          .pricing,
          .testi {
            grid-template-columns: 1fr;
          }
          .faq {
            grid-template-columns: 1fr;
          }
          .foot {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .nav-links {
            display: none;
          }
          .feature-grid {
            grid-template-columns: 1fr;
          }
          .foot {
            grid-template-columns: 1fr;
          }
        }

        /* Fun micro‑interactions */
        .hover-raise {
          transition: transform 0.18s ease, box-shadow 0.25s ease;
        }
        .hover-raise:hover {
          transform: translateY(-4px);
        }
        .shine {
          position: relative;
          overflow: hidden;
        }
        .shine:before {
          content: "";
          position: absolute;
          inset: -120% -80% auto auto;
          width: 180px;
          height: 180px;
          background: radial-gradient(
            closest-side,
            rgba(255, 255, 255, 0.18),
            transparent 70%
          );
          transform: rotate(25deg);
        }
      `}</style>
    </>
  );
}
