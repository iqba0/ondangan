// script.js - versi diperbaiki dan terintegrasi dengan INVITE_CONFIG
document.addEventListener("DOMContentLoaded", () => {
  if (typeof INVITE_CONFIG === "undefined") {
    console.error(
      "INVITE_CONFIG not found. Please include config.js before script.js"
    );
    return;
  }

  const cfg = INVITE_CONFIG;

  /* --------- ELEMENTS --------- */
  const openBtn = document.getElementById("openInvitationBtn");
  const invitationCard = document.getElementById("invitationCard");
  const mainContent = document.getElementById("mainContent");

  const coverNames = document.getElementById("coverNames");
  const coverEmoji = document.getElementById("coverEmoji");
  const homeNames = document.getElementById("homeNames");
  const homeEmoji = document.getElementById("homeEmoji");
  const eventDateReadable = document.getElementById("eventDateReadable");
  const eventTimeReadable = document.getElementById("eventTimeReadable");
  const storyContent = document.getElementById("storyContent");
  const eventsList = document.getElementById("eventsList");
  const mapContainer = document.getElementById("mapContainer");
  const galleryGrid = document.getElementById("galleryGrid");
  const preweddingGrid = document.getElementById("preweddingGrid");
  const giftContainer = document.getElementById("giftContainer");
  const footerNames = document.getElementById("footerNames");
  const footerThanks = document.getElementById("footerThanks");

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpSuccess = document.getElementById("rsvpSuccess");
  const downloadAllBtn = document.getElementById("downloadAllBtn");

  /* --------- Populate static fields --------- */
  try {
    coverEmoji && (coverEmoji.textContent = cfg.cover?.emoji || "💕");
    const coupleDisplay =
      cfg.couple?.display ||
      `${cfg.couple?.bride || ""} & ${cfg.couple?.groom || ""}`;
    coverNames && (coverNames.textContent = coupleDisplay);
    homeNames && (homeNames.textContent = coupleDisplay);
    document.getElementById("coverTitle") &&
      (document.getElementById("coverTitle").textContent =
        cfg.cover?.title || "Undangan Pernikahan");
    document.getElementById("homeInviteText") &&
      (document.getElementById("homeInviteText").textContent =
        cfg.inviteText || "");
    document.getElementById("homeSubText") &&
      (document.getElementById("homeSubText").textContent =
        cfg.inviteSubText || "");
    eventDateReadable &&
      (eventDateReadable.textContent =
        cfg.event?.dateReadable || cfg.event?.weddingDateISO || "");
    eventTimeReadable &&
      (eventTimeReadable.textContent = cfg.event?.timeReadable || "");
    storyContent &&
      (storyContent.innerHTML = `<p class="text-pink-700 leading-relaxed text-center text-base md:text-lg lg:text-xl">${
        cfg.story?.content || ""
      }</p>`);
    footerNames && (footerNames.textContent = coupleDisplay);
    footerThanks && (footerThanks.textContent = cfg.footerText || "");
  } catch (err) {
    console.warn("Error populating static fields:", err);
  }

  /* --------- Events list --------- */
  if (Array.isArray(cfg.events) && eventsList) {
    eventsList.innerHTML = cfg.events
      .map(
        (ev) => `
      <div class="card-elegant fade-in-left bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-8 shadow-lg border border-pink-200 text-center">
        <div class="text-4xl md:text-6xl lg:text-8xl mb-6">${
          ev.icon || "💒"
        }</div>
        <h3 class="dancing-script text-2xl md:text-4xl lg:text-5xl font-bold text-pink-800 mb-4">${
          ev.type
        }</h3>
        <p class="text-pink-700 font-semibold mb-2">${ev.date || ""}</p>
        <p class="text-pink-600 mb-2">${ev.time || ""}</p>
        <p class="text-pink-600 text-sm md:text-base lg:text-lg">${
          ev.place || ""
        }</p>
      </div>
    `
      )
      .join("");
  }

  /* --------- Map embed --------- */
  if (mapContainer) {
    if (cfg.mapEmbedSrc) {
      mapContainer.innerHTML = `<iframe src="${cfg.mapEmbedSrc}" width="100%" height="400" style="border:0;border-radius:12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    } else {
      mapContainer.innerHTML = `<div class="p-6 text-center text-pink-600">Lokasi akan ditampilkan di sini.</div>`;
    }
  }

  /* --------- Gallery render (image/video detection) --------- */
  function getMediaHtmlForThumb(item, isPre = false) {
    const src = item.image;
    if (typeof src === "string" && /\.(mp4|mov|webm)$/i.test(src)) {
      // video thumbnail - use poster if available, else autoplay muted small preview
      return `<video src="${src}" class="w-full h-full object-cover rounded-xl" muted playsinline preload="metadata"></video>`;
    } else if (
      typeof src === "string" &&
      /\.(jpe?g|png|gif|webp|svg)$/i.test(src)
    ) {
      return `<img src="${src}" alt="${
        item.title || ""
      }" class="w-full h-full object-cover rounded-xl" />`;
    } else {
      // emoji fallback
      return `<div class="text-4xl">${item.emoji || "📸"}</div>`;
    }
  }

  if (Array.isArray(cfg.gallery) && galleryGrid) {
    galleryGrid.innerHTML = cfg.gallery
      .map(
        (g, i) => `
      <div class="gallery-item bg-pink-100 rounded-xl aspect-square flex items-center justify-center shadow-lg cursor-pointer overflow-hidden" data-mode="gallery" data-index="${i}">
        ${getMediaHtmlForThumb(g)}
      </div>
    `
      )
      .join("");
  }

  if (Array.isArray(cfg.prewedding) && preweddingGrid) {
    preweddingGrid.innerHTML = cfg.prewedding
      .map(
        (p, i) => `
      <div class="gallery-item card-elegant bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex flex-col shadow-lg cursor-pointer overflow-hidden" data-mode="prewedding" data-index="${i}">
        <div class="w-full h-72 overflow-hidden">
          ${getMediaHtmlForThumb(p, true)}
        </div>
        <div class="p-4 flex flex-col items-center text-center">
          <h3 class="text-pink-800 font-semibold text-lg md:text-xl">${
            p.title || ""
          }</h3>
          <p class="text-pink-600 text-sm md:text-base mt-1">${p.desc || ""}</p>
        </div>
      </div>
    `
      )
      .join("");
  }

  /* --------- Gifts (banks + ewallets) --------- */
  const bankHtml = (b) => `
    <div class="card-elegant fade-in-left bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 shadow-lg border border-pink-200 text-center">
      <div class="w-20 h-20 bg-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">🏦</div>
      <h3 class="text-2xl font-bold text-pink-800 mb-4">${b.bank}</h3>
      <div class="bg-white rounded-xl p-6 shadow-inner border border-pink-100 mb-6">
        <p class="text-pink-600 text-sm mb-2">Nomor Rekening</p>
        <p class="text-2xl font-bold text-pink-800 mb-4">${b.account}</p>
        <p class="text-pink-600 text-sm mb-2">Atas Nama</p>
        <p class="text-lg font-semibold text-pink-700">${b.name}</p>
      </div>
      <button class="button-elegant copy-account bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-lg" data-copy-account="${
        b.account
      }" data-copy-bank="${b.bank}">📋 Salin Nomor Rekening</button>
      ${
        b.qr
          ? `<div class="bg-white rounded-xl p-6 shadow-inner border border-pink-100 mt-4"><img src="${b.qr}" alt="QR ${b.bank}" class="w-32 h-32 mx-auto" /></div>`
          : ""
      }
    </div>
  `;
  const ewalletHtml = (e) => `
    <div class="card-elegant bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">💚</div>
      <h4 class="text-xl font-bold text-green-800 mb-3">${e.type}</h4>
      <p class="text-green-700 font-semibold mb-3">${e.number}</p>
      <p class="text-sm text-green-600 mb-4">a.n. ${e.name}</p>
      <div class="w-24 h-24 bg-green-100 rounded-lg mx-auto flex items-center justify-center">📱</div>
    </div>
  `;

  if (giftContainer) {
    let giftInner = "";
    if (Array.isArray(cfg.gifts?.banks)) {
      giftInner += `<div class="space-y-6">${cfg.gifts.banks
        .map(bankHtml)
        .join("")}</div>`;
    }
    if (Array.isArray(cfg.gifts?.ewallets)) {
      giftInner += `<div class="space-y-6">${cfg.gifts.ewallets
        .map(ewalletHtml)
        .join("")}</div>`;
    }
    if (cfg.gifts?.banks && cfg.gifts?.ewallets) {
      giftContainer.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
          <div>${cfg.gifts.banks.map(bankHtml).join("")}</div>
          <div>${cfg.gifts.ewallets.map(ewalletHtml).join("")}</div>
        </div>
      `;
    } else {
      giftContainer.innerHTML =
        giftInner ||
        '<p class="text-center text-pink-600">Detail kado belum diatur.</p>';
    }
  }

  /* --------- Interactivity: open invitation --------- */
  openBtn?.addEventListener("click", () => {
    invitationCard.classList.add("flipped");
    setTimeout(() => {
      mainContent.classList.remove("hidden");

      // 👉 tampilkan sidebar
      const sideNav = document.getElementById("sideNav");
      if (sideNav) {
        sideNav.classList.remove("invisible");
        sideNav.style.opacity = "1";
        sideNav.style.transform = "translateY(-50%) translateX(0)";
        sideNav.style.pointerEvents = "auto";
      }

      animateOnScroll();
      startCountdown(
        cfg.event?.weddingDateISO || cfg.eventDate || cfg.event?.dateReadable
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 420);
  });

  // smooth nav
  document.querySelectorAll(".nav-link, .side-nav-link").forEach((a) => {
    a.addEventListener("click", () => {
      const target = a.dataset.target;
      if (!target) return;
      const sec = document.getElementById(target);
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* --------- Modal viewer (single) --------- */
  const modal = document.getElementById("imageViewer");
  const viewerEmoji = document.getElementById("viewerEmoji");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerDescription = document.getElementById("viewerDescription");
  const prevViewerBtn = document.getElementById("prevViewerBtn");
  const nextViewerBtn = document.getElementById("nextViewerBtn");
  const closeImageViewerBtn = document.getElementById("closeImageViewerBtn");

  let viewerMode = null; // "gallery" | "prewedding"
  let viewerIndex = 0;

  function openViewer(mode, idx) {
    const data = mode === "prewedding" ? cfg.prewedding : cfg.gallery;
    if (!Array.isArray(data) || !data[idx]) return;
    const item = data[idx];

    // kosongkan
    viewerEmoji.innerHTML = "";

    const src = item.image;
    const isVideo = typeof src === "string" && /\.(mp4|mov|webm)$/i.test(src);
    const isImage =
      typeof src === "string" && /\.(jpe?g|png|gif|webp|svg)$/i.test(src);

    if (isVideo) {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.loop = false;
      video.className =
        "w-full max-h-[70vh] object-contain rounded-2xl shadow-lg";
      video.playsInline = true;
      viewerEmoji.appendChild(video);
    } else if (isImage) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = item.title || "Media";
      img.className =
        "w-full max-h-[70vh] object-contain rounded-2xl shadow-lg";
      viewerEmoji.appendChild(img);
    } else {
      viewerEmoji.innerHTML = `<div class="text-6xl text-center p-8">${
        item.emoji || "📸"
      }</div>`;
    }

    viewerTitle.textContent = item.title || "";
    viewerDescription.textContent = item.desc || item.description || "";

    modal.classList.remove("hidden");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    viewerMode = mode;
    viewerIndex = idx;
  }

  function closeViewer() {
    // stop any video playback inside modal
    const vid = modal.querySelector("video");
    if (vid) {
      try {
        vid.pause();
        vid.currentTime = 0;
      } catch (e) {}
    }
    modal.classList.add("hidden");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    viewerMode = null;
    viewerIndex = 0;
  }

  function nextViewer() {
    const data = viewerMode === "prewedding" ? cfg.prewedding : cfg.gallery;
    if (!Array.isArray(data) || data.length === 0) return;
    viewerIndex = (viewerIndex + 1) % data.length;
    openViewer(viewerMode, viewerIndex);
  }

  function prevViewer() {
    const data = viewerMode === "prewedding" ? cfg.prewedding : cfg.gallery;
    if (!Array.isArray(data) || data.length === 0) return;
    viewerIndex = (viewerIndex - 1 + data.length) % data.length;
    openViewer(viewerMode, viewerIndex);
  }

  // delegate clicks for gallery items (works for dynamically created items)
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item && item.dataset && typeof item.dataset.index !== "undefined") {
      const mode = item.dataset.mode || "gallery";
      const idx = Number(item.dataset.index);
      openViewer(mode, idx);
      return;
    }

    // copy account buttons
    const copyBtn = e.target.closest("[data-copy-account]");
    if (copyBtn) {
      const acc = copyBtn.dataset.copyAccount;
      const bank = copyBtn.dataset.copyBank || "";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(acc);
        } else {
          const ta = document.createElement("textarea");
          ta.value = acc;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        showTempMessage(`Nomor rekening ${bank} berhasil disalin!`);
      } catch {
        showTempMessage(`Nomor rekening: ${acc}`);
      }
      return;
    }
  });

  closeImageViewerBtn?.addEventListener("click", closeViewer);
  nextViewerBtn?.addEventListener("click", nextViewer);
  prevViewerBtn?.addEventListener("click", prevViewer);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeViewer();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal || modal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") nextViewer();
    if (e.key === "ArrowLeft") prevViewer();
  });

  function showTempMessage(text) {
    const el = document.createElement("div");
    el.className =
      "fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translate(-50%,-20px)";
    }, 2200);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  }

  /* --------- Countdown --------- */
  function startCountdown(isoString) {
    if (!isoString) return;
    const weddingTime = new Date(isoString).getTime();
    if (isNaN(weddingTime)) return;

    function tick() {
      const now = Date.now();
      const d = weddingTime - now;
      const daysEl = document.getElementById("days");
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");
      const msgEl = document.getElementById("countdownMessage");
      if (!daysEl) return;

      if (d > 0) {
        const days = Math.floor(d / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((d % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");

        if (days > 30)
          msgEl.textContent = "✨ Masih ada waktu untuk mempersiapkan diri!";
        else if (days > 7) msgEl.textContent = "💕 Hari bahagia semakin dekat!";
        else if (days > 1) msgEl.textContent = "🎉 Tinggal beberapa hari lagi!";
        else if (days === 1)
          msgEl.textContent = "💒 Besok adalah hari yang ditunggu-tunggu!";
        else if (hours > 0)
          msgEl.textContent = "🌟 Hari ini adalah hari bahagia kami!";
        else msgEl.textContent = "💖 Waktunya telah tiba!";
      } else {
        daysEl.textContent =
          hoursEl.textContent =
          minutesEl.textContent =
          secondsEl.textContent =
            "00";
        if (msgEl) msgEl.textContent = "🎊 Selamat! Hari bahagia telah tiba!";
        clearInterval(window._countdownInterval);
      }
    }

    tick();
    clearInterval(window._countdownInterval);
    window._countdownInterval = setInterval(tick, 1000);
  }

  /* --------- Animasi on scroll (simple) --------- */
  function animateOnScroll() {
    const items = document.querySelectorAll(
      ".fade-in, .fade-in-left, .fade-in-right, .scale-in"
    );
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("visible");
            o.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((i) => obs.observe(i));
    setupNavOnScroll();
  }

  function setupNavOnScroll() {
    const topNav = document.getElementById("topNav");
    const sideNav = document.getElementById("sideNav");
    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (y > 150) {
        if (topNav) {
          topNav.style.transform = "translateY(-100%)";
          topNav.style.opacity = "0";
          topNav.style.pointerEvents = "none";
        }
        if (sideNav) {
          sideNav.classList.remove("invisible");
          sideNav.style.opacity = "1";
          sideNav.style.transform = "translateY(-50%) translateX(0)";
          sideNav.style.pointerEvents = "auto";
        }
      } else {
        if (topNav) {
          topNav.style.transform = "translateY(0)";
          topNav.style.opacity = "1";
          topNav.style.pointerEvents = "auto";
        }
        if (sideNav) {
          sideNav.style.opacity = "0";
          sideNav.style.transform = "translateY(-50%) translateX(-100px)";
          sideNav.style.pointerEvents = "none";
          setTimeout(() => {
            if (window.scrollY <= 150) sideNav.classList.add("invisible");
          }, 450);
        }
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --------- RSVP → CSV (in-memory session) --------- */
  const rsvps = [];

  function csvEscape(s = "") {
    if (s == null) return "";
    const str = String(s);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  }

  function buildCsv(allRows) {
    const header = ["Timestamp", "Name", "Attendance", "Guests", "Message"];
    const lines = [header.join(",")];
    allRows.forEach((r) => {
      lines.push(
        [r.timestamp, r.name, r.attendance, r.guests, r.message]
          .map(csvEscape)
          .join(",")
      );
    });
    return lines.join("\n");
  }

  function downloadCsv(filename, content) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  rsvpForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(rsvpForm);
    const entry = {
      timestamp: new Date().toISOString(),
      name: fd.get("name") || "",
      attendance: fd.get("attendance") || "",
      guests: fd.get("guests") || "",
      message: fd.get("message") || "",
    };
    rsvps.push(entry);

    // UI feedback
    rsvpForm.classList.add("hidden");
    rsvpSuccess.classList.remove("hidden");

    const csv = buildCsv(rsvps);
    const filename = `rsvp_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, csv);

    setTimeout(() => {
      rsvpForm.reset();
      rsvpForm.classList.remove("hidden");
      rsvpSuccess.classList.add("hidden");
    }, 2000);
  });

  downloadAllBtn?.addEventListener("click", () => {
    if (rsvps.length === 0) {
      showTempMessage("Belum ada RSVP di sesi ini.");
      return;
    }
    const csv = buildCsv(rsvps);
    downloadCsv(`rsvp_all_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  });

  /* --------- Auto-open if open=true --------- */
  if (new URLSearchParams(window.location.search).get("open") === "true") {
    openBtn?.click();
  }

  // Accessibility: esc closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const iv = document.getElementById("imageViewer");
      if (iv && !iv.classList.contains("hidden")) closeViewer();
    }
  });

  // Start simple animation observer once mainContent shown sometimes
  // (animateOnScroll is called after opening)
});
async function loadRSVPList() {
  try {
    const res = await fetch("get_rsvp.php");
    const data = await res.json();

    const container = document.getElementById("rsvpList");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = `<p class="text-center text-pink-500">Belum ada yang mengisi RSVP 💌</p>`;
      return;
    }

    data.reverse().forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "bg-pink-50 border border-pink-100 rounded-xl p-4 shadow-sm";

      card.innerHTML = `
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold text-pink-700">${item.Nama}</p>
            <p class="text-sm text-pink-500">${item.Tanggal}</p>
          </div>
          <div class="text-sm font-medium ${
            item.Status === "Hadir" ? "text-green-600" : "text-gray-400"
          }">
            ${item.Status}
          </div>
        </div>
        <p class="mt-2 text-gray-700">${item.Pesan}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Gagal memuat data RSVP:", err);
  }
}
// Setelah sukses kirim RSVP
rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    nama: document.getElementById("name").value,
    status: document.getElementById("attendance").value,
    ucapan: document.getElementById("message").value,
  };

  const res = await fetch("save_rsvp.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await res.json();
  if (result.success) {
    rsvpForm.reset();
    loadRSVPList(); // ← refresh daftar ucapan
  }
});

// Saat halaman pertama kali dibuka
window.addEventListener("DOMContentLoaded", loadRSVPList);
