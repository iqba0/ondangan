document.addEventListener("DOMContentLoaded", () => {
  // ========== SET TITLE DARI CONFIG ==========
  if (config.title) {
    document.title = config.title;
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) pageTitle.textContent = config.title;
  }

  // ========== SET DATA ACARA ==========
  if (config.event) {
    const dateElem = document.getElementById("eventDate");
    const homeDate = document.getElementById("eventDateReadable");
    const homeTime = document.getElementById("eventTimeReadable");

    if (dateElem) {
      dateElem.textContent = `${config.event.dateReadable} • ${config.event.timeReadable}`;
    }
    if (homeDate) homeDate.textContent = config.event.dateReadable;
    if (homeTime) homeTime.textContent = config.event.timeReadable;
  }

  // ========== NAMA TAMU DARI URL ==========
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");

  const guestSection = document.getElementById("guestSection");
  const guestElem = document.getElementById("guestName");

  if (guestName && guestElem && guestSection) {
    guestElem.textContent = decodeURIComponent(guestName);
    guestSection.style.display = "block";
  } else if (guestSection) {
    guestSection.style.display = "none";
  }
});




// ubah title bar dan favicon otomatis
document.title = INVITE_CONFIG.site.title;

// kalau ada favicon, ubah juga
if (INVITE_CONFIG.site.favicon) {
  const link =
    document.querySelector("link[rel~='icon']") ||
    document.createElement("link");
  link.rel = "icon";
  link.href = INVITE_CONFIG.site.favicon;
  document.head.appendChild(link);
}

const countdown = setInterval(() => {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "Acara telah dimulai 🎉";
    clearInterval(countdown);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown").innerHTML = `
    <div class="countdown-item"><strong>${days}</strong><span>Hari</span></div>
    <div class="countdown-item"><strong>${hours}</strong><span>Jam</span></div>
    <div class="countdown-item"><strong>${minutes}</strong><span>Menit</span></div>
    <div class="countdown-item"><strong>${seconds}</strong><span>Detik</span></div>
  `;
}, 1000);
