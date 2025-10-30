const INVITE_CONFIG = {
  site: {
    title: "Undangan Shafira & M Iqbal 💕", // teks di tab browser
    favicon: "assets/icon/favicon.png", // opsional
  },
  cover: {
    emoji: "💕",
    title: "Undangan Pernikahan",
  },
  couple: {
    bride: "Shafira",
    groom: "Iqbal",
    display: "Shafira & Iqbal",
  },
  inviteText: "Dengan penuh sukacita, kami mengundang Anda",
  inviteSubText: "untuk berbagi kebahagiaan di hari istimewa kami",

  event: {
    // gunakan ISO (wajib) untuk countdown
    // gunakan format: YYYY-MM-DDTHH:MM:SS+07:00
    // contoh berikut berarti: 15 Desember 2025 pukul 10.00 WIB
    weddingDateISO: "2025-12-15T10:00:00+07:00",
    dateReadable: "15 Desember 2025",
    timeReadable: "Senin, 10:00 WIB",
  },

  events: [
    {
      icon: "💒",
      type: "Akad Nikah",
      date: "15 Desember 2025",
      time: "10:00 - 11:00 WIB",
      place: "Masjid Agung Kota",
    },
    {
      icon: "🎉",
      type: "Resepsi",
      date: "15 Desember 2025",
      time: "13:00 - 16:00 WIB",
      place: "Gedung Serbaguna",
    },
  ],

  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.1234567890123!2d110.369!3d-7.7956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a123456789abc%3A0xabcdef0123456789!2sContoh%20Lokasi!5e0!3m2!1sid!2sid!4v0000000000000",

  gallery: [
    {
      image: "assets/photos/foto1.jpg",
      title: "Foto Pre-Wedding 1",
      desc: "Momen romantis kami di taman bunga",
      emoji: "📸",
    },
    {
      image: "assets/photos/foto2.jpg",
      title: "Foto Couple 1",
      desc: "Kebahagiaan terpancar dari senyuman kami",
      emoji: "💑",
    },
    {
      image: "assets/photos/foto3.png",
      title: "Foto Romantis",
      desc: "Bunga mawar sebagai simbol cinta kami",
      emoji: "🌹",
    },
  ],

  prewedding: [
    {
      image: "assets/photos/foto.png",
      title: "Romantic Garden",
      desc: "Di taman bunga",
      emoji: "📷",
    },
    {
      image: "assets/prewedding/pre2.mp4",
      title: "Sunset Moment (video)",
      desc: "Senja yang romantis",
      emoji: "🎥",
    },
    {
      image: "assets/prewedding/pre3.jpg",
      title: "Beach Love",
      desc: "Di tepi pantai",
      emoji: "🏖️",
    },
  ],

  gifts: {
    banks: [
      {
        bank: "BNI",
        account: "1234567890",
        name: "Ahmad & Sarah",
        qr: "assets/qr/bni.png",
      },
      { bank: "BCA", account: "0987654321", name: "Ahmad & Sarah" },
    ],
    ewallets: [
      { type: "OVO", number: "081234567890", name: "Ahmad" },
      { type: "Dana", number: "082345678901", name: "Sarah" },
    ],
  },

  story: {
    content:
      "Kami bertemu di sebuah taman pada musim semi... (ganti dengan cerita kalian).",
  },

  footerText: "Terima kasih atas doa dan dukungan Anda",
};
