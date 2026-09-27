(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Theme ---------- */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    $('meta[name="theme-color"]').setAttribute("content", next === "dark" ? "#07080f" : "#f6f7fb");
  });

  /* ---------- Preloader ---------- */
  document.body.classList.add("loading");
  let loaded = false;
  const finishLoading = () => {
    if (loaded) return;
    loaded = true;
    $("#preloader").classList.add("done");
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
    startTyping();
  };
  window.addEventListener("load", () => setTimeout(finishLoading, reduceMotion ? 0 : 900));
  setTimeout(finishLoading, 3500);

  /* ---------- Icons ---------- */
  const icons = {
    chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    video: '<svg viewBox="0 0 24 24"><path d="m23 7-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    layout: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    card: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    brain: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sofa: '<svg viewBox="0 0 24 24"><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v4H2v-4zM5 17v2M19 17v2"/></svg>',
    bed: '<svg viewBox="0 0 24 24"><path d="M2 18V6M2 14h20v4M22 18v-5a3 3 0 0 0-3-3h-8v4"/><circle cx="7" cy="11" r="2"/></svg>',
    chair: '<svg viewBox="0 0 24 24"><path d="M7 3h10v8H7zM5 11h14v3H5zM7 14v7M17 14v7"/></svg>',
    lamp: '<svg viewBox="0 0 24 24"><path d="M8 2h8l3 8H5l3-8zM12 10v9M8 21h8"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  const storeBadge = (type, url) =>
    type === "play"
      ? `<a class="store" href="${url}" target="_blank" rel="noopener" aria-label="Get it on Google Play">
          <svg viewBox="0 0 24 24" class="play-ic"><path fill="#00A0FF" d="M3.6 1.8 13.5 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z"/><path fill="#FFD500" d="m16.8 8.7-3.3 3.3 3.3 3.3 3.8-2.1c1.1-.6 1.1-1.8 0-2.4z"/><path fill="#FF3A44" d="M3.6 22.2c.3.2.8.2 1.3-.1l11.9-6.8-3.3-3.3z"/><path fill="#32E07B" d="M3.6 1.8 13.5 12l3.3-3.3L4.9 1.9c-.5-.3-1-.3-1.3-.1z"/></svg>
          <span><small>GET IT ON</small><b>Google Play</b></span></a>`
      : `<a class="store" href="${url}" target="_blank" rel="noopener" aria-label="Download on the App Store">
          <svg viewBox="0 0 24 24" class="fill"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.4 1-1.4 1.4-2.7 1.4-2.8-.1 0-2.7-1-2.4-4.2zM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.4z"/></svg>
          <span><small>Download on the</small><b>App Store</b></span></a>`;

  const storeBadges = (p) =>
    (p.stores.play ? storeBadge("play", p.stores.play) : "") + (p.stores.ios ? storeBadge("ios", p.stores.ios) : "");

  /* ---------- Featured (live) apps ---------- */
  const featured = [
    {
      name: "5paisa",
      tagline: "Stock Trading Platform",
      domain: "Fintech",
      grad: "linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#8b5cf6 100%)",
      color: "#38bdf8",
      screen: "fin",
      desc: "A real-time trading platform used by millions of investors across India — I owned core trading, engagement and real-time data modules.",
      stores: { play: "https://play.google.com/store/apps/details?id=com.fivepaisa.trade" },
      role: "Module owner · Brainvire",
      platform: "Flutter · Android",
      scale: "Millions of investors",
      tags: ["Flutter", "Kotlin", "WebSockets", "Streams", "CleverTap", "Clean Architecture"],
      chips: [
        { ic: "bolt", b: "Peak-hour latency ↓", s: "Socket layer redesigned" },
        { ic: "bell", b: "Price alert fired", s: "End-to-end delivery" },
      ],
      modules: [
        { t: "Market Search", d: "Search across stocks, indices and instruments with real-time result rendering." },
        { t: "Order Book Summary", s: "Order Book", d: "Consolidated view of open, executed and cancelled orders, driven by live market data." },
        { t: "Price Alerts", d: "End-to-end alert creation, management and notification delivery." },
        { t: "Refer & Earn", d: "Referral flow with tracking and reward attribution." },
        { t: "CleverTap Integration", s: "CleverTap Analytics", d: "Implemented event tracking to understand user engagement — which screens users spend the most time on, where drop-offs occur in key funnels, and which features drive repeat usage. The product team used this data directly to shape retention and engagement campaigns." },
        { t: "Real-Time Data Architecture", s: "Real-time WebSockets", d: "Engineered WebSocket-based live market data pipelines and redesigned the socket/stream architecture to resolve a data-synchronisation issue, reducing latency during peak trading hours." },
      ],
    },
    {
      name: "Pan Home",
      tagline: "Multi-Country E-Commerce",
      domain: "E-Commerce",
      grad: "linear-gradient(135deg,#f97316 0%,#ec4899 60%,#a855f7 100%)",
      color: "#fb923c",
      screen: "shop",
      desc: "A furniture and home décor e-commerce app configured for the UAE, Qatar, Oman and Saudi Arabia — from backend-driven storefronts to region-specific payments.",
      stores: {
        play: "https://play.google.com/store/apps/details?id=com.panemirates.store",
        ios: "https://apps.apple.com/in/app/pan-home-furniture-d%C3%A9cor/id6449422462",
      },
      role: "Mobile developer · Brainvire",
      platform: "Flutter · Android · iOS",
      scale: "UAE · Qatar · Oman · KSA",
      tags: ["Flutter", "PayFort", "Apple Pay", "Tabby", "Tamara", "MoEngage", "Social Login"],
      chips: [
        { ic: "layout", b: "Zero-release updates", s: "Backend-driven layouts" },
        { ic: "card", b: "Pay in 4 with Tabby", s: "BNPL across 4 markets" },
      ],
      modules: [
        { t: "Dynamic Content Rendering", s: "Dynamic Content", d: "Built a configurable content module where frontend layout and presentation are driven entirely by the post/content type returned from the backend — letting merchandising teams change storefront content without an app release." },
        { t: "Payment Gateway Integration", s: "Payment Gateways", d: "Integrated PayFort, Apple Pay, Tabby and Tamara, including buy-now-pay-later installment flows, with region-specific handling for each market." },
        { t: "Checkout Flow", d: "Complete checkout journey from cart through address selection, payment method and order confirmation." },
        { t: "Sign Up / Sign In", d: "Authentication flows including social login." },
        { t: "My Account", d: "Profile, order history and account management screens." },
        { t: "MoEngage Integration", s: "MoEngage Analytics", d: "Analytics and engagement tracking across the funnel." },
      ],
    },
    {
      name: "Main Court",
      tagline: "Pickleball Matches & Venue Booking",
      domain: "Sports & Social",
      grad: "linear-gradient(135deg,#22c55e 0%,#14b8a6 50%,#0ea5e9 100%)",
      color: "#4ade80",
      screen: "court",
      desc: "A production sports app where I'm the sole mobile developer — handling feature development, change requests and production issue resolution end to end.",
      stores: {
        play: "https://play.google.com/store/apps/details?id=com.maincourt",
        ios: "https://apps.apple.com/us/app/main-court-pickleball-matches/id6471336853",
      },
      role: "Sole mobile developer",
      platform: "Flutter · Android · iOS",
      scale: "Live in production",
      tags: ["Flutter", "Real-time Chat", "Social Feed", "Dynamic Posts", "Production Support"],
      chips: [
        { ic: "trophy", b: "Achievement unlocked", s: "Auto-posted to feed" },
        { ic: "user", b: "Sole mobile developer", s: "End-to-end ownership" },
      ],
      modules: [
        { t: "Match Creation", d: "Full flow for creating a match, including format, venue, timing and player slots." },
        { t: "Match Details", d: "Match summary, participant management and status handling." },
        { t: "One-to-One Chat", s: "1:1 Real-time Chat", d: "Real-time private messaging between players." },
        { t: "Social Feed", d: "An Instagram-style feed with posts, likes, comments and sharing, letting players share match moments and updates." },
        { t: "Dynamic Achievement Posts", s: "Achievement Posts", d: "The backend automatically generates a post when a player unlocks an achievement (such as a milestone or match result), which is rendered dynamically in the social feed without any manual user action." },
      ],
    },
    {
      name: "PitchIQ",
      tagline: "Cricket Pitch Report Generator",
      domain: "Personal Product",
      indie: true,
      grad: "linear-gradient(135deg,#a855f7 0%,#ec4899 55%,#f59e0b 100%)",
      color: "#e879f9",
      screen: "pitch",
      desc: "My own app — designed, built and published independently. It evaluates pitch and venue conditions and recommends whether the captain should bat or bowl after winning the toss, factoring in day vs day-night fixtures.",
      stores: { play: "https://play.google.com/store/apps/details?id=com.rkinfotech.pitch_iq" },
      role: "Solo — designer & developer",
      platform: "Flutter · Android",
      scale: "Published on Play Store",
      tags: ["Flutter", "Dart", "Decision Logic", "Data Modelling", "Play Store Release"],
      chips: [
        { ic: "brain", b: "Toss decision engine", s: "Bat or bowl?" },
        { ic: "moon", b: "Day vs Day-Night", s: "Fixture-aware logic" },
      ],
      modules: [
        { t: "Pitch & Venue Dataset", d: "A pre-configured dataset of pitch and venue conditions powering every report." },
        { t: "Toss Decision Engine", d: "Evaluates the scenario from the dataset and recommends whether the captain should choose to bat or bowl after winning the toss." },
        { t: "Day vs Day-Night Logic", s: "Day / Day-Night Logic", d: "Factors in whether the fixture is a day match or a day-night match when making the recommendation." },
        { t: "End-to-End Ownership", s: "Concept → Play Store", d: "Built end to end: concept, data model, decision logic, UI and Play Store release." },
      ],
    },
  ];

  /* ---------- Other projects ---------- */
  const more = [
    {
      name: "Neighbourhood",
      tagline: "Social community & events app",
      domain: "Social",
      icon: "users",
      grad: "linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#3b82f6 100%)",
      color: "#34d399",
      layout: "feed",
      desc: "A community platform bringing neighbours together through posts, events and real-time chat.",
      role: "Mobile developer · Brainvire",
      platform: "Flutter · Android",
      scale: "Community-driven",
      stores: {},
      tags: ["Flutter", "WebSockets", "FCM", "Firebase", "BLoC"],
      modules: [
        { t: "Social Interactions", d: "Instagram-style like, comment and share features." },
        { t: "Real-time Messaging", d: "Messaging powered by WebSockets." },
        { t: "Events & Community", d: "Event-management and community-engagement workflows." },
        { t: "Notifications", d: "Notification modules to drive engagement, iterated closely with product and design teams." },
      ],
    },
    {
      name: "GatherHall",
      tagline: "Real-time communication platform",
      domain: "Communication",
      icon: "video",
      grad: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#d946ef 100%)",
      color: "#a78bfa",
      layout: "chat",
      desc: "An all-in-one collaboration hub with chat, video conferencing, marketplace and a multilingual news feed.",
      role: "Mobile developer · Brainvire",
      platform: "Flutter · Android",
      scale: "Multilingual",
      stores: {},
      tags: ["Flutter", "Video Calling", "Encryption", "Live Location", "REST APIs"],
      modules: [
        { t: "Chat & Video", d: "Real-time chat, video calling and conferencing." },
        { t: "Secure Sharing", d: "Encrypted file sharing and live location tracking." },
        { t: "Feed & Marketplace", d: "A multilingual news feed, marketplace and message scheduling." },
        { t: "API Integration", d: "RESTful API integration throughout the app." },
      ],
    },
    {
      name: "NTC",
      tagline: "Field operations & safety management",
      domain: "Operations",
      icon: "shield",
      grad: "linear-gradient(135deg,#eab308 0%,#f97316 55%,#ef4444 100%)",
      color: "#facc15",
      layout: "rows",
      desc: "An enterprise app digitising field reporting, safety compliance and workforce attendance.",
      role: "Mobile developer · Brainvire",
      platform: "Flutter · Android",
      scale: "Enterprise",
      stores: {},
      tags: ["Flutter", "Role-based Access", "Media Upload", "Testing"],
      modules: [
        { t: "Field Workflows", d: "Reporting, checklist, safety-talk and attendance-tracking workflows." },
        { t: "Role-based Admin", d: "Role-based admin management for field-operations business processes." },
        { t: "Media Gallery", d: "Upload, view and admin-approval flows." },
        { t: "Quality", d: "Tested and debugged across devices to ensure application quality." },
      ],
    },
  ];

  /* ---------- Phone screens for featured apps ---------- */
  const screens = {
    fin: () => `
      <div class="scr">
        <div class="scr-head"><span class="scr-title">Orders</span><span class="scr-live"><i></i>LIVE</span></div>
        <div class="s-search">${icons.search}<span class="s-typed" data-words="RELIANCE|NIFTY 50|HDFCBANK|TCS|Mutual Funds"></span></div>
        <div class="s-tabs"><span class="on">Open</span><span>Executed</span><span>Cancelled</span></div>
        ${[
          ["RELIANCE", 2948.5, "BUY · 10 qty · LMT", "open", "OPEN"],
          ["HDFCBANK", 1642.1, "SELL · 25 qty · MKT", "ok", "EXECUTED"],
          ["TCS", 3980.0, "BUY · 5 qty · LMT", "open", "OPEN"],
          ["INFY", 1512.35, "BUY · 12 qty · SL", "x", "CANCELLED"],
        ]
          .map(
            ([n, p, s, c, l]) => `
          <div class="s-order"><b>${n}</b><span class="s-price" data-p="${p}">₹${p.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            <small>${s}</small><span class="s-badge ${c}">${l}</span></div>`
          )
          .join("")}
        <div class="s-alert"><span class="s-alert__ic">${icons.bell}</span><div><b>Price alert triggered</b><small>NIFTY 50 crossed 25,000</small></div></div>
      </div>`,
    shop: () => `
      <div class="scr">
        <div class="scr-head"><span class="scr-title">PAN<span class="pc">HOME</span></span>
          <span class="s-region" data-region>UAE · AED</span>
          <span class="s-cart">${icons.bag}<i>2</i></span></div>
        <div class="s-banner"><small>DYNAMIC CONTENT</small><b>Summer Sale<br />up to 40% off</b></div>
        <div class="s-chips"><span class="on">Sofas</span><span>Beds</span><span>Décor</span><span>Dining</span></div>
        <div class="s-products">
          ${[
            ["sofa", "Velvet Sofa", 2499],
            ["bed", "Oak Bed", 3199],
            ["chair", "Lounge Chair", 899],
            ["lamp", "Table Lamp", 249],
          ]
            .map(
              ([ic, n, p]) => `
            <div class="s-prod"><div class="img">${icons[ic]}</div><b>${n}</b><small data-aed="${p}">AED ${p.toLocaleString()}</small></div>`
            )
            .join("")}
        </div>
        <div class="s-bnpl"><span>Pay in 4 with <b>tabby</b></span><span class="s-cta">Checkout</span></div>
      </div>`,
    court: () => `
      <div class="scr">
        <div class="scr-head"><span class="scr-title">Main<span class="pc">Court</span></span><span class="s-avatar">AK</span></div>
        <div class="s-match">
          <small>DOUBLES · TODAY 6:30 PM · COURT 3</small>
          <div class="s-vs">
            <div class="s-team"><i>AK</i><i>RS</i></div><b>VS</b><div class="s-team"><i>JP</i><i class="empty">+</i></div>
          </div>
          <span class="s-join">Join match · 1 slot left</span>
        </div>
        <div class="s-post">
          <div class="s-post__head"><span class="av"></span><div><b>Ajay K.</b><small>Achievement · just now</small></div></div>
          <div class="s-ach"><span class="trophy">🏆</span><b>10-Match Win Streak</b><small>Auto-generated post</small></div>
          <div class="s-actions"><span><span class="s-heart">♥</span> <span class="s-likes">128</span></span><span>💬 24</span><span>↗ Share</span></div>
        </div>
        <div class="s-chat">
          <div class="s-bubble">Up for a game tonight? 🏓</div>
          <div class="s-bubble me">Booked Court 3! See you 🔥</div>
          <div class="s-typing"><i></i><i></i><i></i></div>
        </div>
      </div>`,
    pitch: () => `
      <div class="scr">
        <div class="scr-head"><span class="scr-title">Pitch<span class="pc">IQ</span></span><small class="s-venue">Pitch report</small></div>
        <div class="s-toggle" data-toggle><span>☀ Day</span><span>☾ Day-Night</span></div>
        <div class="s-ground" data-ground><div class="s-strip"></div><span class="s-ball"></span></div>
        <div class="s-metrics">
          ${[
            ["Grass cover", 35, 40],
            ["Moisture", 30, 75],
            ["Cracks", 60, 45],
            ["Bounce", 70, 58],
          ]
            .map(
              ([l, d, n]) => `
            <div class="s-metric" data-day="${d}" data-night="${n}"><span>${l}</span><span class="tr"><i style="--v:${d}%"></i></span><em>${d}%</em></div>`
            )
            .join("")}
        </div>
        <div class="s-verdict">
          <div class="s-ring"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="15.9"/><circle class="fg" cx="18" cy="18" r="15.9" pathLength="100" style="stroke-dashoffset:22"/></svg><span class="s-ring__v">78%</span></div>
          <div><small>Won the toss? We recommend</small><b class="s-call">BAT FIRST</b></div>
        </div>
      </div>`,
  };

  /* ---------- Render showcase ---------- */
  $("#showcase").innerHTML = featured
    .map(
      (p, i) => `
      <article class="show reveal" style="--pg:${p.grad};--pc:${p.color};--d:0s">
        <div class="show__content">
          <div class="show__top">
            <span class="show__num">0${i + 1}</span>
            <span class="show__domain">${p.domain}</span>
            ${p.indie ? '<span class="indie-pill">★ My own app</span>' : ""}
            <span class="live-pill"><i></i>Live</span>
          </div>
          <h3 class="show__name">${p.name}</h3>
          <p class="show__tagline">${p.tagline}</p>
          <p class="show__desc">${p.desc}</p>
          <ul class="show__modules">
            ${p.modules.map((m, k) => `<li style="--i:${k}"><i></i>${m.s || m.t}</li>`).join("")}
          </ul>
          <div class="show__actions">
            ${storeBadges(p)}
            <button class="case-btn" data-open="featured:${i}">Case study ${icons.arrow}</button>
          </div>
        </div>
        <div class="show__visual">
          <span class="show__ring"></span><span class="show__ring show__ring--2"></span>
          <div class="device" data-parallax="-0.06"><span class="device__notch"></span>${screens[p.screen]()}</div>
          ${p.chips
            .map(
              (c, k) => `
            <div class="show__chip show__chip--${k ? "b" : "a"}" data-parallax="${k ? 0.1 : -0.12}">
              <span class="ci">${icons[c.ic]}</span><div><b>${c.b}</b><small>${c.s}</small></div>
            </div>`
            )
            .join("")}
        </div>
      </article>`
    )
    .join("");

  /* ---------- Render "more" grid ---------- */
  const miniScreen = (p) => {
    const rows = (n) => Array.from({ length: n }, () => "<div class='mp-row'><i></i><span></span></div>").join("");
    const body = {
      rows: rows(4),
      feed: rows(1) + "<div class='mp-grid'><i style='grid-column:span 2;height:60px'></i></div>" + rows(1),
      chat: rows(2) + "<div class='mp-row' style='margin-left:24px'><span></span><i></i></div>" + rows(1),
    }[p.layout];
    return `
      <div class="mini-phone"><div class="mini-phone__screen">
        <div class="mp-title"></div><div class="mp-sub"></div>
        <div class="mp-hero">${icons[p.icon]}</div>
        ${body}
      </div></div>`;
  };

  $("#projectsGrid").innerHTML = more
    .map(
      (p, i) => `
      <article class="project reveal" data-open="more:${i}" tabindex="0" role="button"
        aria-label="Open ${p.name} details" style="--pg:${p.grad};--pc:${p.color}" data-tilt>
        <div class="project__visual">
          <span class="project__num">0${featured.length + i + 1}</span>
          <span class="project__domain">${p.domain}</span>
          ${miniScreen(p)}
        </div>
        <div class="project__body">
          <h3>${p.name}<span class="project__arrow">${icons.arrow}</span></h3>
          <p class="project__tagline">${p.tagline}</p>
          <p class="project__desc">${p.desc}</p>
          <div class="tags">${p.tags.slice(0, 4).map((t) => `<span>${t}</span>`).join("")}</div>
        </div>
      </article>`
    )
    .join("");

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  let lastFocus = null;
  const openModal = (key) => {
    const [list, idx] = key.split(":");
    const p = (list === "featured" ? featured : more)[+idx];
    const num = list === "featured" ? +idx + 1 : featured.length + +idx + 1;
    lastFocus = document.activeElement;
    const hasStores = p.stores.play || p.stores.ios;
    $("#modalBody").innerHTML = `
      <div class="modal__hero" style="--pg:${p.grad}">
        <small>${p.domain.toUpperCase()} · PROJECT 0${num}</small>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        ${hasStores ? `<div class="modal__stores">${storeBadges(p)}</div>` : '<span class="modal__private">Private / enterprise distribution</span>'}
      </div>
      <div class="modal__content" style="--pc:${p.color}">
        <div class="modal__meta">
          <div><small>Role</small><b>${p.role}</b></div>
          <div><small>Platform</small><b>${p.platform}</b></div>
          <div><small>Scale</small><b>${p.scale}</b></div>
        </div>
        <h4>${p.indie ? "What I built" : "Modules I owned"}</h4>
        <ul>${p.modules.map((m) => `<li><b>${m.t}</b> — ${m.d}</li>`).join("")}</ul>
        <h4>Tech &amp; Integrations</h4>
        <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".modal__panel").scrollTop = 0;
    $(".modal__close").focus();
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const trigger = e.target.closest("[data-open]");
    if (trigger) openModal(trigger.dataset.open);
  });
  document.addEventListener("keydown", (e) => {
    const card = e.target.closest && e.target.closest(".project[data-open]");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openModal(card.dataset.open);
    }
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
  modal.addEventListener("click", (e) => e.target.closest("[data-close]") && closeModal());

  /* ---------- Split section titles into animated words ---------- */
  $$(".section__title").forEach((title) => {
    let i = 0;
    const wrap = (text, cls = "") =>
      text
        .split(/(\s+)/)
        .map((part) => {
          if (!part.trim()) return part;
          return `<span class="w"><span class="${cls}" style="--i:${i++}">${part}</span></span>`;
        })
        .join("");
    title.innerHTML = [...title.childNodes]
      .map((n) => (n.nodeType === 3 ? wrap(n.textContent) : wrap(n.textContent, n.className)))
      .join("");
    title.classList.add("split");
  });

  /* ---------- Scramble text for eyebrows ---------- */
  const glyphs = "!<>-_\\/[]{}—=+*^?#01";
  const scramble = (el) => {
    const node = [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!node || reduceMotion) return;
    const final = node.textContent;
    let frame = 0;
    const total = 24;
    const run = () => {
      const progress = frame / total;
      node.textContent = final
        .split("")
        .map((ch, k) => (ch === " " || k / final.length < progress ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
        .join("");
      if (frame++ < total) requestAnimationFrame(run);
      else node.textContent = final;
    };
    run();
  };

  /* ---------- Typing effect ---------- */
  const roles = ["Flutter Developer", "Android Developer", "Kotlin & Compose Engineer", "Real-time Apps Builder"];
  let typingStarted = false;
  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    const el = $("#typed");
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      let delay = deleting ? 40 : 85;
      if (!deleting && c === word.length) { delay = 1800; deleting = true; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      c += deleting ? -1 : 1;
      if (c < 0) c = 0;
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        $$(".eyebrow", en.target).forEach(scramble);
        revealObs.unobserve(en.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => {
    if (!el.style.getPropertyValue("--d")) {
      const siblings = [...el.parentElement.children].filter((s) => s.classList.contains("reveal"));
      const idx = siblings.indexOf(el);
      if (siblings.length > 1) el.style.setProperty("--d", `${Math.min(idx, 6) * 0.08}s`);
    }
    revealObs.observe(el);
  });

  /* ---------- Counters ---------- */
  const counterObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.target;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / 1600, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObs.unobserve(el);
      }),
    { threshold: 0.6 }
  );
  $$(".counter").forEach((el) => counterObs.observe(el));

  /* ---------- Nav: scroll state, active link, pill, progress, parallax ---------- */
  const nav = $("#nav");
  const navLinks = $("#navLinks");
  const pill = $(".nav__pill");
  const progress = $(".scroll-progress");
  const sections = $$("main section[id]");
  const links = $$("[data-link]");
  const parallaxEls = $$("[data-parallax]");
  let lastY = 0;
  let activeLink = null;

  const movePill = (link) => {
    if (!link || innerWidth <= 860) { pill.classList.remove("is-visible"); return; }
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    pill.classList.add("is-visible");
  };
  links.forEach((a) => {
    a.addEventListener("mouseenter", () => movePill(a));
    a.addEventListener("mouseleave", () => movePill(activeLink));
  });

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("scrolled", y > 20);
    nav.classList.toggle("hidden", !navLinks.classList.contains("open") && y > lastY && y > 400);
    lastY = y;

    let current = "";
    sections.forEach((s) => { if (y >= s.offsetTop - innerHeight * 0.4) current = s.id; });
    const next = links.find((a) => a.getAttribute("href") === `#${current}`) || null;
    links.forEach((a) => a.classList.toggle("active", a === next));
    if (next !== activeLink) { activeLink = next; movePill(activeLink); }

    if (!reduceMotion) {
      parallaxEls.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const offset = (r.top + r.height / 2 - innerHeight / 2) * +el.dataset.parallax;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    }
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", () => movePill(activeLink));
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const toggleMenu = (force) => {
    const open = force ?? !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleMenu());
  links.forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Toast + copy ---------- */
  const toast = $("#toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast("Email copied to clipboard ✓");
      } catch {
        showToast(btn.dataset.copy);
      }
    })
  );

  /* ---------- Contact form (opens mail client) ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    let ok = true;
    ["name", "email", "message"].forEach((id) => {
      const input = form[id];
      const valid = id === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) : input.value.trim().length > 0;
      input.parentElement.classList.toggle("error", !valid);
      if (!valid) ok = false;
    });
    const note = $("#formNote");
    if (!ok) { note.textContent = "Please fill in the highlighted fields."; return; }
    const subject = form.subject.value.trim() || `Portfolio enquiry from ${form.name.value.trim()}`;
    const body = `${form.message.value.trim()}\n\n— ${form.name.value.trim()} (${form.email.value.trim()})`;
    window.location.href = `mailto:ajaykori2130@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = "Opening your email app… Thanks for reaching out!";
    showToast("Thanks! Your email app is opening ✉️");
    form.reset();
  });
  $$(".field input, .field textarea").forEach((el) =>
    el.addEventListener("input", () => el.parentElement.classList.remove("error"))
  );

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Live phone screens ---------- */
  if (!reduceMotion) {
    // Hero ticker
    let value = 248560;
    const base = 241700;
    const tickerEl = $("#ticker");
    const changeEl = $("#tickerChange");
    setInterval(() => {
      value += Math.round((Math.random() - 0.45) * 900);
      tickerEl.textContent = value.toLocaleString("en-IN");
      const pct = ((value - base) / base) * 100;
      changeEl.textContent = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
      changeEl.classList.toggle("down", pct < 0);
    }, 1800);

    // 5paisa: live prices + typing search
    setInterval(() => {
      $$(".s-price").forEach((el) => {
        if (Math.random() > 0.55) return;
        const p = +el.dataset.p * (1 + (Math.random() - 0.5) * 0.004);
        el.classList.toggle("up", p >= +el.dataset.p);
        el.classList.toggle("down", p < +el.dataset.p);
        el.dataset.p = p.toFixed(2);
        el.textContent = `₹${p.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      });
    }, 1200);
    $$(".s-typed").forEach((el) => {
      const words = el.dataset.words.split("|");
      let w = 0, c = 0, del = false;
      const tick = () => {
        el.textContent = words[w].slice(0, c);
        let d = del ? 50 : 110;
        if (!del && c === words[w].length) { del = true; d = 1400; }
        else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
        c += del ? -1 : 1;
        if (c < 0) c = 0;
        setTimeout(tick, d);
      };
      tick();
    });

    // Pan Home: rotate market & currency
    const regions = [["UAE", "AED", 1], ["Qatar", "QAR", 0.99], ["Oman", "OMR", 0.105], ["KSA", "SAR", 1.02]];
    let reg = 0;
    setInterval(() => {
      reg = (reg + 1) % regions.length;
      const [country, cur, rate] = regions[reg];
      $$("[data-region]").forEach((el) => {
        el.classList.remove("flip");
        void el.offsetWidth;
        el.classList.add("flip");
        el.textContent = `${country} · ${cur}`;
      });
      $$("[data-aed]").forEach((el) => {
        const v = +el.dataset.aed * rate;
        el.textContent = `${cur} ${cur === "OMR" ? v.toFixed(1) : Math.round(v).toLocaleString()}`;
      });
    }, 2600);

    // Main Court: likes tick up
    let likes = 128;
    setInterval(() => {
      likes += 1 + ((Math.random() * 3) | 0);
      $$(".s-likes").forEach((el) => (el.textContent = likes));
    }, 2000);

    // PitchIQ: switch Day / Day-Night and recompute recommendation
    let night = false;
    setInterval(() => {
      night = !night;
      $$("[data-toggle]").forEach((el) => el.classList.toggle("night", night));
      $$("[data-ground]").forEach((el) => el.classList.toggle("night", night));
      $$(".s-metric").forEach((m) => {
        const v = night ? m.dataset.night : m.dataset.day;
        m.querySelector("i").style.setProperty("--v", `${v}%`);
        m.querySelector("em").textContent = `${v}%`;
      });
      const conf = night ? 72 : 78;
      $$(".s-verdict").forEach((v) => {
        v.querySelector(".fg").style.strokeDashoffset = 100 - conf;
        v.querySelector(".s-ring__v").textContent = `${conf}%`;
        const call = v.querySelector(".s-call");
        call.classList.remove("swap");
        void call.offsetWidth;
        call.classList.add("swap");
        call.textContent = night ? "BOWL FIRST" : "BAT FIRST";
      });
    }, 3500);
  }

  if (!finePointer || reduceMotion) {
    initParticles();
    return;
  }

  /* ---------- Custom cursor + spotlight ---------- */
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  const spotlight = $(".spotlight");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    spotlight.style.setProperty("--sx", `${mx}px`);
    spotlight.style.setProperty("--sy", `${my}px`);
    document.body.classList.add("cursor-active");
  });
  document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    const hover = e.target.closest("a, button, .project, input, textarea, [data-tilt]");
    document.body.classList.toggle("cursor-hover", !!hover);
  });

  /* ---------- Magnetic buttons ---------- */
  $$(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => (el.style.transform = ""));
  });

  /* ---------- Showcase glow follows mouse ---------- */
  $$(".show").forEach((card) =>
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    })
  );

  /* ---------- 3D tilt + spotlight ---------- */
  document.addEventListener("mousemove", (e) => {
    const el = e.target.closest("[data-tilt]");
    $$("[data-tilt].tilting").forEach((t) => {
      if (t !== el) { t.classList.remove("tilting"); t.style.transform = ""; }
    });
    if (!el || (el.classList.contains("reveal") && !el.classList.contains("in"))) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const strength = el.classList.contains("hero__visual") ? 10 : 6;
    el.classList.add("tilting");
    el.style.transition = "transform .15s ease-out, border-color .4s, box-shadow .4s";
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * strength}deg) rotateY(${(px - 0.5) * strength}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  });
  document.addEventListener("mouseleave", () => {
    $$("[data-tilt].tilting").forEach((t) => { t.classList.remove("tilting"); t.style.transform = ""; });
  });

  initParticles();

  /* ---------- Particle network background ---------- */
  function initParticles() {
    const canvas = $("#bg-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const count = Math.min(Math.floor((innerWidth * innerHeight) / 16000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });

    const linkDist = 130;
    const draw = () => {
      const rgb = getComputedStyle(root).getPropertyValue("--particle").trim();
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduceMotion) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 * dpr && dist > 0) { p.x += (dx / dist) * 1.2; p.y += (dy / dist) * 1.2; }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, .55)`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < linkDist * dpr) {
            ctx.strokeStyle = `rgba(${rgb}, ${0.16 * (1 - d / (linkDist * dpr))})`;
            ctx.lineWidth = dpr * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    };
    draw();
  }
})();
