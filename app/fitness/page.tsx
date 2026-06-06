import Link from "next/link";

const SHORT_VIDEOS = [
  {
    label: "Short Form · Fitness Technique",
    src: "https://www.youtube.com/embed/mGiDce4vvkk",
    title: "Fitness Short 1",
  },
  {
    label: "Short Form · Exercise Correction",
    src: "https://www.youtube.com/embed/irqmCobZUHo",
    title: "Fitness Short 2",
  },
  {
    label: "Short Form · Training Tips",
    src: "https://www.youtube.com/embed/aekDu4SaLLg",
    title: "Fitness Short 3",
  },
  {
    label: "Short Form · Workout Form",
    src: "https://www.youtube.com/embed/qGwhsg51ov8",
    title: "Fitness Short 4",
  },
];

const LONG_VIDEOS = [
  {
    label: "Long Form · Full Tutorial Edit",
    src: "https://www.youtube.com/embed/WMRXS3lzs3s",
    title: "Fitness Long 1",
  },
  {
    label: "Long Form · Workout Guide",
    src: "https://www.youtube.com/embed/g-3GTrySVNw",
    title: "Fitness Long 2",
  },
];

export default function FitnessPage() {
  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">
          Raees <span>Visuals</span>
        </Link>
        <a href="#book" className="nav-cta">
          Book a Free Call
        </a>
      </nav>

      <section className="hero">
        <p className="hero-eyebrow">
          Fitness Video Editing — For Coaches Who Are Serious About Growth
        </p>
        <h1>
          Your Content.
          <br />
          <em>Edited.</em>
          <br />
          Every Week.
        </h1>
        <p className="hero-sub">
          You coach. You train. You build. The last thing you should be doing is
          spending 10 hours in the edit. We handle your YouTube and Instagram
          content — start to finish, every month.
        </p>
        <div className="hero-actions">
          <a href="#book" className="btn-primary">
            Book a Free Strategy Call
          </a>
          <Link href="/portfolio" className="btn-ghost">
            View Fitness Work →
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <div className="stat-num">
              6<span>+</span>
            </div>
            <div className="stat-label">Years Editing</div>
          </div>
          <div>
            <div className="stat-num">
              50<span>+</span>
            </div>
            <div className="stat-label">Fitness Videos Delivered</div>
          </div>
          <div>
            <div className="stat-num">
              72<span>h</span>
            </div>
            <div className="stat-label">Average Turnaround</div>
          </div>
        </div>
      </section>

      <section className="pain">
        <p className="section-label">The Real Problem</p>
        <h2>You&apos;re Losing Momentum Because of the Edit.</h2>
        <div className="pain-grid">
          <div className="pain-item">
            <div className="pain-item-icon">⏳</div>
            <h3>Hours wasted in the timeline</h3>
            <p>
              Every hour you spend editing is an hour you&apos;re not coaching,
              closing clients, or building your program.
            </p>
          </div>
          <div className="pain-item">
            <div className="pain-item-icon">📉</div>
            <h3>Inconsistent posting kills growth</h3>
            <p>
              The algorithm rewards consistency. Posting when you &quot;find
              time&quot; is the fastest way to plateau.
            </p>
          </div>
          <div className="pain-item">
            <div className="pain-item-icon">✂️</div>
            <h3>Long-form sitting unused</h3>
            <p>
              Your YouTube videos are goldmines of short-form content. Most
              coaches never repurpose them.
            </p>
          </div>
          <div className="pain-item">
            <div className="pain-item-icon">🎯</div>
            <h3>Generic editing doesn&apos;t convert</h3>
            <p>
              Fitness content has a specific energy, pacing, and visual language.
              Generic editors just don&apos;t get it.
            </p>
          </div>
        </div>
      </section>

      <section className="offer">
        <div className="offer-inner">
          <div>
            <p className="section-label">What We Do</p>
            <h2>Done-For-You Fitness Content — Monthly.</h2>
            <p className="offer-body">
              We take your raw footage and turn it into polished, high-retention
              videos built for the fitness audience — tight pacing, motion
              graphics, anatomical overlays, and platform-optimized edits for
              YouTube and Instagram.
            </p>
            <p className="offer-body">
              You record once. We deliver your full month of content.
            </p>
          </div>
          <div>
            <ul className="offer-list">
              <li>Long-form YouTube edits with motion graphics and callouts</li>
              <li>Short-form Reels and Shorts repurposed from your long-form</li>
              <li>Anatomical overlays and correction graphics (Jeremy Ethier style)</li>
              <li>Captions, subtitles, and text hooks for social</li>
              <li>Color grading tuned for gym lighting</li>
              <li>Unlimited revisions until you&apos;re satisfied</li>
              <li>Dedicated editor — not a random freelancer each time</li>
              <li>Fast 72-hour turnaround on standard edits</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="packages" id="packages">
        <p className="section-label">Retainer Packages</p>
        <h2>Simple Monthly Pricing.</h2>
        <p className="packages-sub">
          No per-video quotes. No surprise fees. Just consistent output, every
          month.
        </p>
        <div className="pkg-grid">
          <div className="pkg-card">
            <div className="pkg-name">Starter</div>
            <div className="pkg-tagline">For coaches just getting consistent</div>
            <div className="pkg-price">$800</div>
            <div className="pkg-price-note">per month</div>
            <ul className="pkg-features">
              <li>2 long-form YouTube edits</li>
              <li>6 short-form Reels/Shorts</li>
              <li>Basic motion graphics</li>
              <li>Captions included</li>
              <li>5-day turnaround</li>
            </ul>
            <a href="#book" className="pkg-cta pkg-cta-outline">
              Get Started
            </a>
          </div>

          <div className="pkg-card featured">
            <div className="pkg-badge">Most Popular</div>
            <div className="pkg-name">Growth</div>
            <div className="pkg-tagline">For coaches scaling their audience</div>
            <div className="pkg-price">$1,500</div>
            <div className="pkg-price-note">per month</div>
            <ul className="pkg-features">
              <li>4 long-form YouTube edits</li>
              <li>12 short-form Reels/Shorts</li>
              <li>Advanced motion graphics + overlays</li>
              <li>Anatomical correction graphics</li>
              <li>Captions + text hooks</li>
              <li>72-hour turnaround</li>
              <li>Unlimited revisions</li>
            </ul>
            <a href="#book" className="pkg-cta pkg-cta-filled">
              Book a Call
            </a>
          </div>

          <div className="pkg-card">
            <div className="pkg-name">Authority</div>
            <div className="pkg-tagline">For established coaches going all in</div>
            <div className="pkg-price">$2,800</div>
            <div className="pkg-price-note">per month</div>
            <ul className="pkg-features">
              <li>8 long-form YouTube edits</li>
              <li>20+ short-form Reels/Shorts</li>
              <li>Premium motion graphics + VFX</li>
              <li>Thumbnails included</li>
              <li>Full content repurposing strategy</li>
              <li>48-hour turnaround</li>
              <li>Priority support</li>
            </ul>
            <a href="#book" className="pkg-cta pkg-cta-outline">
              Get Started
            </a>
          </div>
        </div>
      </section>

      <section className="process">
        <p className="section-label">How It Works</p>
        <h2>Four Steps. Zero Headache.</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Strategy Call</h3>
            <p>
              We learn your brand, style, audience, and goals. 20 minutes. Free.
            </p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>You Record</h3>
            <p>
              Just film your content as you normally would. Send us the raw
              footage.
            </p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>We Edit</h3>
            <p>
              Full edit, motion graphics, captions, and repurposed clips —
              delivered in 72 hours.
            </p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <h3>You Post &amp; Grow</h3>
            <p>
              Review, approve, and publish. We handle revisions until it&apos;s
              exactly right.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <p className="section-label">What Clients Say</p>
        <h2>Results Speak.</h2>
        <div className="testi-grid">
          <div className="testi-card">
            <p className="testi-quote">
              &quot;Finally found an editor who actually understands fitness
              content. The pacing, the overlays, the energy — it&apos;s exactly
              what my audience responds to. My watch time went up noticeably in
              the first month.&quot;
            </p>
            <div className="testi-author">
              <div className="testi-avatar">JK</div>
              <div>
                <div className="testi-name">James K.</div>
                <div className="testi-handle">
                  Online Fitness Coach · 85K YouTube
                </div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-quote">
              &quot;Before working with Raees, I was posting once every two weeks
              because editing took forever. Now I&apos;m on a consistent weekly
              schedule and my Instagram has grown 40% in three months.&quot;
            </p>
            <div className="testi-author">
              <div className="testi-avatar">SR</div>
              <div>
                <div className="testi-name">Sara R.</div>
                <div className="testi-handle">
                  Certified PT · Instagram Coach
                </div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p className="testi-quote">
              &quot;The motion graphics and anatomical callouts are exactly what
              I needed. Clients tell me my videos look more professional than
              channels with 10x my subscribers.&quot;
            </p>
            <div className="testi-author">
              <div className="testi-avatar">MA</div>
              <div>
                <div className="testi-name">Mike A.</div>
                <div className="testi-handle">
                  Strength &amp; Conditioning Coach
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work" id="work">
        <p className="section-label">Selected Work</p>
        <h2>The Edit Speaks for Itself.</h2>
        <p className="work-sub">
          Real fitness clients. Real results. No templates, no stock footage.
        </p>

        <div className="work-shorts">
          {SHORT_VIDEOS.map((video) => (
            <div key={video.src} className="work-short-item">
              <div className="video-label">{video.label}</div>
              <div className="short-embed">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>

        <div className="work-longs">
          {LONG_VIDEOS.map((video) => (
            <div key={video.src} className="work-long-item">
              <div className="video-label">{video.label}</div>
              <div className="long-embed">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>

        <div className="work-cta">
          <Link href="/portfolio#fitness" className="btn-ghost">
            View All Fitness Work →
          </Link>
        </div>
      </section>

      <section className="cta-section" id="book">
        <h2>
          Ready to Stop <em>Editing</em> and Start Growing?
        </h2>
        <p className="cta-sub">
          Book a free 20-minute call. No pitch, no pressure — just an honest
          conversation about what you need.
        </p>
        <Link href="/contact" className="btn-primary">
          Book Your Free Call →
        </Link>
      </section>

      <footer>
        <Link href="/" className="nav-logo">
          Raees <span>Visuals</span>
        </Link>
        <span className="footer-copy">
          © 2026 Raees Visuals. All rights reserved.
        </span>
      </footer>
    </>
  );
}
