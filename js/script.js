
// Fungsi untuk menonaktifkan scroll
  function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  }

  // Fungsi untuk mengaktifkan scroll
  function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.height = '';
  }

  // Pastikan saat refresh halaman kembali ke cover
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.onbeforeunload = () => {
    window.scrollTo(0, 0);
    disableScroll();
  };

  // Saat halaman pertama kali dimuat → scroll dimatikan
  window.addEventListener('DOMContentLoaded', () => {
    disableScroll();
    window.scrollTo(0, 0);
  });

  // Klik tombol "Buka Undangan" → aktifkan scroll & sembunyikan cover
  document.getElementById('openInvitation').addEventListener('click', function(e) {
    e.preventDefault();
    enableScroll();
    document.getElementById('cover').style.display = 'none';
  });

// gallery.js

document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item img');

  // Saat klik thumbnail
  galleryItems.forEach(img => {
    img.addEventListener('click', function () {
      const src = this.getAttribute('src');
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('active');
    });
  });

  // Tutup ketika klik tombol close
  lightboxClose.addEventListener('click', function () {
    lightbox.classList.remove('active');
    lightboxImg.setAttribute('src', '');
  });

  // Tutup ketika klik di luar gambar (pada overlay)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      lightboxImg.setAttribute('src', '');
    }
  });

  // Opsional: tutup dengan tombol ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      lightboxImg.setAttribute('src', '');
    }
  });
});







// 1. Set tanggal dan waktu target (format: YYYY-MM-DDTHH:MM:SS)
// MINGGU, 14 DESEMBER 2025 jam 09:00 WIB
const TARGET_DATE = '2028-12-14T09:00:00';

// 2. Ambil elemen-elemen timer
const elDays = document.getElementById('days');
const elHours = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');

// 3. Fungsi untuk menghitung dan memperbarui tampilan
function updateCountdown() {
  const now = new Date();
  const target = new Date(TARGET_DATE);
  const diffMs = target - now;  // selisih dalam milidetik

  if (diffMs <= 0) {
    clearInterval(timerInterval);
    elDays.textContent = '0';
    elHours.textContent = '0';
    elMinutes.textContent = '0';
    elSeconds.textContent = '0';
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  elDays.textContent = days;
  elHours.textContent = hours.toString().padStart(2, '0');
  elMinutes.textContent = minutes.toString().padStart(2, '0');
  elSeconds.textContent = seconds.toString().padStart(2, '0');
}

// 4. Jalankan updateCountdown() setiap 1 detik
const timerInterval = setInterval(updateCountdown, 1000);

// 5. Panggil sekali agar langsung tampil tanpa menunggu 1 detik
updateCountdown();




// Javascript Rsvp
// Fungsi untuk submit RSVP
function submitAttendance() {
  const nama = document.getElementById('guest-name').value.trim(); // sesuai HTML
  const status = document.getElementById('attendance').value;

  if (!nama || !status) {
    alert("Mohon lengkapi semua data.");
    return;
  }

  const kehadiranData = {
    nama: nama,
    status: status,
    waktu: new Date().toISOString()
  };

  // Simpan ke localStorage
  localStorage.setItem('rsvp_' + Date.now(), JSON.stringify(kehadiranData));

  // Kirim ke Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbzupSAUngEwT_F7jkMH81Hxqg4yiGM1cxsqqG9gc6gLQR0gDoGP4Ir6CkbgIMuOX66v/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(kehadiranData)
  })
  .then(() => {
    alert("Terima kasih! Kehadiran Anda telah dikonfirmasi.");
    // Kosongkan form
    document.getElementById('guest-name').value = '';
    document.getElementById('attendance').value = '';
  })
  .catch((err) => {
    console.error("Gagal mengirim data ke Google Sheets", err);
  });
}

// Event listener untuk tombol submit
window.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('.rsvp-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitAttendance);
  }
});












// Javascript Gift
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.gift-btn');
  const overlay = document.getElementById('giftModal');
  const select = document.getElementById('bank-select');
  const infoBox = overlay.querySelector('.bank-info');
  const acctSpan = document.getElementById('acct-number');
  const ownerSpan = document.getElementById('acct-owner');
  const copyBtn = overlay.querySelector('.copy-btn');
  const closeBtn = overlay.querySelector('.close-btn');

  // Data rekening per bank
  const banks = {
    Mandiri: { no: '1320017524795', name: 'RESTI ADRIANI' },
    BCA: { no: '9876-5432-1098', name: 'MUHAMAD RENDY' }
  };

  // Tampilkan popup
  btn.addEventListener('click', () => {
    overlay.style.display = 'flex';
  });

  // Tutup popup
  closeBtn.addEventListener('click', () => overlay.style.display = 'none');
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.style.display = 'none';
  });

  // Pilih bank dan tampilkan info
  select.addEventListener('change', () => {
    const bank = select.value;
    const data = banks[bank];
    acctSpan.textContent = data.no;
    ownerSpan.textContent = data.name;
    infoBox.style.display = 'block';
  });

  // Salin nomor rekening
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(acctSpan.textContent.trim())
      .then(() => {
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => copyBtn.textContent = 'Salin Nomor', 1500);
      });
  });
});






// Javscript untuk guest-wish
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".wish-form");
  const nameInput = document.getElementById("wish-name");
  const messageInput = document.getElementById("wish-message");
  const wishListContainer = document.querySelector(".wish-messages");
  const wishCounter = wishListContainer.querySelector(".count span");

  const scriptURL = "https://script.google.com/macros/s/AKfycbz1vLLzKnn6GpqOIrxrPP0I-iYTzNaLdpLrvwg0sE4NijBrc45-I2lbEPG4VpdJvx70qQ/exec";
  const renderedWishes = new Set();

  // Kirim data form ke Google Sheets
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
      const wish = { name, message };
      sendToGoogleSheets(wish);
      form.reset();
    }
  });

  // Tambah ucapan ke DOM
  function addGuestWish({ name, message }) {
    const uniqueKey = `${name}::${message}`.toLowerCase();
    if (renderedWishes.has(uniqueKey)) return;

    const wishItem = document.createElement("div");
    wishItem.classList.add("message");
    wishItem.innerHTML = `
      <p class="name">${name}</p>
      <p class="text">${message}</p>
      <p class="time">${new Date().toLocaleString()}</p>
    `;
    wishListContainer.appendChild(wishItem);
    renderedWishes.add(uniqueKey);
    updateWishCounter();
  }

  // Kirim data ke Google Sheets
  function sendToGoogleSheets(wish) {
    const formData = new FormData();
    formData.append("nama", wish.name);
    formData.append("pesan", wish.message);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
    .then(() => addGuestWish(wish))
    .catch((error) => console.error("Gagal mengirim ke Google Sheets:", error));
  }

  // Ambil semua data ucapan dari Google Sheets
  function loadWishesFromGoogleSheets() {
    fetch(scriptURL)
      .then(res => res.json())
      .then(data => {
        data.reverse().forEach(wish => {
          addGuestWish({
            name: wish.nama,
            message: wish.pesan
          });
        });
      })
      .catch(err => console.error("Gagal mengambil data:", err));
  }

  // Update jumlah ucapan
  function updateWishCounter() {
    const totalWishes = wishListContainer.querySelectorAll(".message").length;
    wishCounter.innerText = `${totalWishes} Ucapan`;
  }

  // Load data awal dari Google Sheets
  loadWishesFromGoogleSheets();
});







// Javascript Footer
// Fungsi untuk email newsletter-form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".newsletter-form");
  if (!form) return; // Cegah error kalau form-nya tidak ada

  const emailInput = form.querySelector("input[type='email']");
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNLmDr4cN3ccFrW-VQS9gFAM33NxC_mDqzKemqilbxd3FgCGSJUJwaKFF34RVH_-qs/exec"; // Ganti dengan URL kamu

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes("@gmail.com")) {
      alert("Mohon masukkan alamat Gmail yang valid.");
      return;
    }

    // Simpan ke localStorage
    let savedEmails = JSON.parse(localStorage.getItem("newsletterEmails")) || [];
    savedEmails.push(email);
    localStorage.setItem("newsletterEmails", JSON.stringify(savedEmails));

    // Kirim ke Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `email=${encodeURIComponent(email)}`
    })
      .then(() => {
        alert("Terima kasih telah mendaftar!");
        form.reset();
      })
      .catch((error) => {
        console.error("Gagal mengirim ke Google Sheets:", error);
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
      });
  });
});





// Fungsi untuk contact whatsapp footer-section contact
document.addEventListener("DOMContentLoaded", () => {
  const contactButton = document.querySelector(".contact-button");
  const phoneNumber = "+62 895-2348-4553";  // Ganti dengan nomor WhatsApp yang sesuai
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;  // Format link WhatsApp

  contactButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Arahkan ke WhatsApp
    window.open(whatsappUrl, "_blank");
  });
});






document.addEventListener("DOMContentLoaded", function () {
  const bukaUndanganBtn = document.getElementById("openInvitation"); // pakai ID sesuai HTML
  const audio = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  let isPlaying = false;

  function toggleMusic() {
    if (isPlaying) {
      audio.pause();
      musicToggle.classList.remove("playing");
    } else {
      audio.play().catch(err => {
        console.warn("Audio tidak bisa diputar:", err);
      });
      musicToggle.classList.add("playing");
    }
    isPlaying = !isPlaying;
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }

  if (bukaUndanganBtn) {
    bukaUndanganBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.style.overflow = "auto";
      document.getElementById("cover")?.classList.add("hidden");

      if (audio) {
        audio.play().then(() => {
          isPlaying = true;
          musicToggle.classList.add("playing");
        }).catch(e => {
          console.warn("Gagal memutar audio:", e);
        });
      }
    });
  } else {
    console.warn("Tombol buka undangan tidak ditemukan!");
  }
});
















// Javascript Untuk Animasi 1 Untuk semua css

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.classList.contains("word-by-word")) {
          const words = entry.target.textContent.trim().split(/\s+/); // split dengan aman
          entry.target.innerHTML = "";

          words.forEach((word, i) => {
            const span = document.createElement("span");
            span.textContent = word;
            span.style.setProperty("--i", i);
            entry.target.appendChild(span);
            entry.target.appendChild(document.createTextNode(" ")); // tambahkan spasi nyata
          });

          entry.target.classList.add("visible");
        }

      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".animate").forEach(el => observer.observe(el));

  // Optional: Parallax scroll effect
  window.addEventListener("scroll", () => {
    document.querySelectorAll("[data-parallax]").forEach(el => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.5;
      const offset = window.scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
});












