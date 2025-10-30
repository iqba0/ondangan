document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvpForm");
  const message = document.getElementById("rsvpMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nama: form.nama.value.trim(),
      status: form.status.value,
      ucapan: form.ucapan.value.trim(),
    };

    try {
      const response = await fetch("save_rsvp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log(result);

      message.style.display = "block";
      form.reset();
      setTimeout(() => (message.style.display = "none"), 3000);
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(err);
    }
  });
});
