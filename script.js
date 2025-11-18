// ------------------------
// Mobile menu toggle
// ------------------------
const menuToggle = document.getElementById("menuToggle");
const headerNav = document.querySelector(".site-header__nav");

if (menuToggle && headerNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    headerNav.classList.toggle("is-open");
  });

  // Close menu when nav link is clicked
  headerNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      headerNav.classList.remove("is-open");
    });
  });
}

// ------------------------
// Background music toggle
// ------------------------
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

if (musicToggle && bgMusic) {
  let isPlaying = false;

  const toggleMusic = () => {
    if (!isPlaying) {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          musicToggle.classList.add("music-btn--playing");
          musicToggle.querySelector(".music-btn__label").textContent = t('music.pause') || "Pause";
        })
        .catch(() => {
          // playback blocked (user gesture issue) – silently ignore
        });
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove("music-btn--playing");
      musicToggle.querySelector(".music-btn__label").textContent = t('music.play') || "Music";
    }
  };

  musicToggle.addEventListener("click", toggleMusic);
}

// ------------------------
// Share button (uses Web Share API with fallback)
// ------------------------
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: document.title || "Wedding Invitation",
      text: "You're invited! Check out our wedding invitation.",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: open WhatsApp with text or copy link
        const text = encodeURIComponent(`${shareData.title} - ${shareData.url}`);
        const whatsapp = `https://wa.me/?text=${text}`;
        window.open(whatsapp, "_blank");
      }
    } catch (err) {
      // ignore user cancel
      console.warn("Share failed", err);
    }
  });
}

// ------------------------
// Simple i18n / Language loader (lazy-loaded JSON files)
// ------------------------
const LANG_KEY = "invitation_lang";
const langEnBtn = document.getElementById("langEn");
const langViBtn = document.getElementById("langVi");

// runtime translations will be stored here after fetching
window.__translations = window.__translations || {};

// Fallback embedded translations so the page still works when opened via file://
// (fetching JSON is blocked on file:// in many browsers). This ensures graceful
// degradation if loading locales fails due to CORS/protocol restrictions.
const FALLBACK_TRANSLATIONS = {
  en: {
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.rsvp": "Celebration",
    "nav.contact": "Contact",
    "hero.eyebrow": "We are getting married",
    "hero.cta": "Confirm Your Attendance",
    "hero.location": "Hồ Chí Minh City",
    "count.days": "Days",
    "count.hours": "Hours",
    "count.minutes": "Minutes",
    "count.seconds": "Seconds",
    "share.label": "Share",
    "family.eyebrow": "Meet the Families",
    "family.title": "A union of hearts",
    "events.eyebrow": "Wedding Events",
    "events.title": "Save the moments",
    "gallery.eyebrow": "Album",
    "gallery.title": "A glimpse of our love",
    "rsvp.title": "📋 Confirm Your Attendance",
    "rsvp.name.label": "Your full name*",
    "rsvp.phone.label": "Phone number*",
    "rsvp.attend.label": "Will you attend?*",
    "rsvp.attend.yes": "✓ Yes, I'll be there",
    "rsvp.attend.no": "✗ Sorry, I can't",
    "rsvp.message.label": "Message to the couple",
    "rsvp.message.placeholder": "Share travel plans, blessings, allergens...",
    "rsvp.message.hint": "Optional, but we’d love to read it.",
    "rsvp.dietary.label": "Dietary preferences",
    "rsvp.button": "Send RSVP",
    "rsvp.sending": "Sending…",
    "map.eyebrow": "Location",
    "map.title": "How to get there",
    "map.directions": "📍 Get Directions",
    "family.groom.title": "Groom's Family",
    "family.groom.parents": "Mr. Hưng & Mrs. Chi",
    "family.groom.label": "Parents of the groom",
    "family.groom.text": "Hosts of the morning tea ceremony and keepers of treasured family traditions. They look forward to welcoming each guest personally.",
    "family.groom.list.0": "Ceremony home: 123 Đường Hoa Hồng",
    "family.groom.list.1": "Contact: +84 90 234 5678",
    "family.groom.list.2": "Requests: Kindly arrive by 07:45",
    "family.bride.title": "Bride's Family",
    "family.bride.parents": "Mr. Nhanh & Mrs. Nga",
    "family.bride.label": "Parents of the bride",
    "family.bride.text": "Warm hosts of the reception who curated the floral palette and menu pairings to make the afternoon unforgettable.",
    "family.bride.list.0": "Reception lead: The Rose Garden Hall",
    "family.bride.list.1": "Contact: +84 93 111 2468",
    "family.bride.list.2": "Requests: Share dietary notes in RSVP",
    "events.ceremony.title": "Lễ Vu Quy (Bride's Ceremony)",
    "events.ceremony.description": "A warm family ceremony to honor our parents and ancestors.",
    "events.ceremony.location": "📍 123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
    "events.ceremony.badge.scope": "Family only",
    "events.ceremony.dress": "Traditional tones / pastels",
    "events.reception.title": "Wedding Ceremony & Reception",
    "events.reception.description": "Join us for vows, dinner, and dancing under the lights.",
    "events.reception.location": "📍 The Rose Garden Hall, 456 Đường Ánh Trăng, TP. Hồ Chí Minh",
    "events.reception.badge.scope": "All guests",
    "events.reception.program": "Welcome drinks · Ceremony · Feast · First dance",
    "events.labels.date": "Date",
    "events.labels.venue": "Venue",
    "events.labels.dress": "Dress",
    "events.labels.program": "Program",
    "rsvp.name.placeholder": "Your full name",
    "rsvp.phone.placeholder": "Phone number",
    "rsvp.errors.name": "Please enter your name",
    "rsvp.errors.phone": "Please enter your phone",
    "rsvp.errors.guests": "Please specify number of guests",
    "rsvp.errors.attendance": "Please select an option",
    "rsvp.success": "✓ Thank you! Your RSVP has been recorded. We can't wait to see you.",
    "rsvp.success.details": "{name}, we reserved {guests} seats for you.",
    "music.play": "Music",
    "music.pause": "Pause",
    "sticky.label": "RSVP",
    "footer.thanks": "Thank you for being part of our day.",
    "footer.back": "Back to top ↑",
    "gallery.caption.0": "A sweet moment together",
    "gallery.caption.1": "Walking by the river",
    "gallery.caption.2": "Laughs and lights",
    "gallery.caption.3": "Our favorite place"
  },
  vi: {
    "nav.events": "Sự kiện",
    "nav.gallery": "Album",
    "nav.rsvp": "Lễ",
    "nav.contact": "Liên hệ",
    "hero.eyebrow": "Chúng tôi sắp kết hôn",
    "hero.cta": "Xác nhận tham dự",
    "hero.location": "TP. Hồ Chí Minh",
    "count.days": "Ngày",
    "count.hours": "Giờ",
    "count.minutes": "Phút",
    "count.seconds": "Giây",
    "share.label": "Chia sẻ",
    "family.eyebrow": "Gặp gỡ gia đình",
    "family.title": "Hòa hợp trái tim",
    "events.eyebrow": "Sự kiện cưới",
    "events.title": "Lưu giữ khoảnh khắc",
    "gallery.eyebrow": "Album",
    "gallery.title": "Khoảnh khắc của chúng tôi",
    "rsvp.title": "📋 Xác nhận tham dự",
    "rsvp.name.label": "Họ và tên*",
    "rsvp.phone.label": "Số điện thoại*",
    "rsvp.attend.label": "Bạn có tham dự không?*",
    "rsvp.attend.yes": "✓ Tôi sẽ tham dự",
    "rsvp.attend.no": "✗ Xin lỗi, tôi không thể",
    "rsvp.message.label": "Lời nhắn gửi đôi trẻ",
    "rsvp.message.placeholder": "Chia sẻ kế hoạch di chuyển, lời chúc, lưu ý món ăn...",
    "rsvp.message.hint": "Không bắt buộc, nhưng chúng tôi rất muốn đọc!",
    "rsvp.dietary.label": "Yêu cầu chế độ ăn",
    "rsvp.button": "Gửi RSVP",
    "rsvp.sending": "Đang gửi…",
    "map.eyebrow": "Địa điểm",
    "map.title": "Cách đến",
    "map.directions": "📍 Chỉ đường",
    "family.groom.title": "Gia đình chú rể",
    "family.groom.parents": "Ông Hưng & Bà Chi",
    "family.groom.label": "Gia đình nhà trai",
    "family.groom.text": "Chủ trì lễ trà sáng và giữ gìn những nghi thức truyền thống. Gia đình mong được chào đón từng vị khách.",
    "family.groom.list.0": "Nhà tổ chức lễ: 123 Đường Hoa Hồng",
    "family.groom.list.1": "Liên hệ: +84 90 234 5678",
    "family.groom.list.2": "Lưu ý: Vui lòng đến trước 07:45",
    "family.bride.title": "Gia đình cô dâu",
    "family.bride.parents": "Ông Nhanh & Bà Nga",
    "family.bride.label": "Gia đình nhà gái",
    "family.bride.text": "Chủ nhà tiếp đón tiệc trưa, chăm chút hoa và thực đơn để tạo nên bữa tiệc đáng nhớ.",
    "family.bride.list.0": "Điều phối: The Rose Garden Hall",
    "family.bride.list.1": "Liên hệ: +84 93 111 2468",
    "family.bride.list.2": "Lưu ý: Ghi chú thực đơn trong RSVP",
    "events.ceremony.title": "Lễ Vu Quy",
    "events.ceremony.description": "Một nghi lễ ấm áp tôn vinh cha mẹ và tổ tiên của chúng tôi.",
    "events.ceremony.location": "📍 123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
    "events.ceremony.badge.scope": "Thành viên gia đình",
    "events.ceremony.dress": "Tông truyền thống / pastel",
    "events.reception.title": "Lễ cưới & Tiệc",
    "events.reception.description": "Hãy tham gia cùng chúng tôi trong lời thề, bữa tối và khiêu vũ dưới ánh đèn.",
    "events.reception.location": "📍 The Rose Garden Hall, 456 Đường Ánh Trăng, TP. Hồ Chí Minh",
    "events.reception.badge.scope": "Toàn bộ khách mời",
    "events.reception.program": "Đón khách · Nghi lễ · Tiệc · Khiêu vũ",
    "events.labels.date": "Ngày",
    "events.labels.venue": "Địa điểm",
    "events.labels.dress": "Trang phục",
    "events.labels.program": "Chương trình",
    "rsvp.name.placeholder": "Họ và tên",
    "rsvp.phone.placeholder": "Số điện thoại",
    "rsvp.errors.name": "Vui lòng nhập họ và tên",
    "rsvp.errors.phone": "Vui lòng nhập số điện thoại",
    "rsvp.errors.guests": "Vui lòng nhập số khách",
    "rsvp.errors.attendance": "Vui lòng chọn một tùy chọn",
    "rsvp.success": "✓ Cảm ơn! RSVP của bạn đã được ghi nhận. Chúng tôi rất mong được gặp bạn.",
    "rsvp.success.details": "{name}, chúng tôi đã giữ {guests} chỗ cho bạn.",
    "music.play": "Nhạc",
    "music.pause": "Tạm dừng",
    "sticky.label": "Xác nhận",
    "footer.thanks": "Cảm ơn bạn đã là một phần của ngày hôm nay.",
    "footer.back": "Lên đầu trang ↑",
    "gallery.caption.0": "Khoảnh khắc ngọt ngào bên nhau",
    "gallery.caption.1": "Dạo bước bên sông",
    "gallery.caption.2": "Tiếng cười và ánh đèn",
    "gallery.caption.3": "Nơi ta yêu thích"
  }
};
function loadTranslations(lang) {
  // Use embedded translations only (no network fetch) to keep the app minimal
  const base = FALLBACK_TRANSLATIONS.en || {};
  const overlay = (lang && FALLBACK_TRANSLATIONS[lang]) || {};
  window.__translations = Object.assign({}, base, overlay);
}

function t(key) {
  return (window.__translations && window.__translations[key]) || key;
}

function applyTranslations() {
  const dict = window.__translations || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    el.setAttribute('placeholder', text);
  });

  // update any dynamic labels that rely on t()
  const musicLabel = document.querySelector('.music-btn__label');
  if (musicLabel) musicLabel.textContent = t('music.play');
  const sticky = document.getElementById('stickyRsvp');
  if (sticky) sticky.textContent = t('sticky.label');
  const footerThanks = document.querySelector('[data-i18n="footer.thanks"]');
  if (footerThanks) footerThanks.textContent = t('footer.thanks');
}

function setLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
  loadTranslations(lang);
  applyTranslations();
  if (langEnBtn && langViBtn) {
    langEnBtn.classList.toggle('active', lang === 'en');
    langViBtn.classList.toggle('active', lang === 'vi');
    langEnBtn.setAttribute('aria-pressed', String(lang === 'en'));
    langViBtn.setAttribute('aria-pressed', String(lang === 'vi'));
  }
}

// initialize language from storage or browser
const savedLang = localStorage.getItem(LANG_KEY);
const defaultLang = savedLang || (navigator.language && navigator.language.startsWith('vi') ? 'vi' : 'en');
if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
if (langViBtn) langViBtn.addEventListener('click', () => setLanguage('vi'));

// apply initial language (load translations then apply)
// Apply initial language synchronously using embedded translations
setLanguage(defaultLang);

// ------------------------
// Scroll reveal animation
// ------------------------
const revealElements = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(el => observer.observe(el));
} else {
  // Fallback
  revealElements.forEach(el => el.classList.add("is-visible"));
}

// ------------------------
// Family hero animation (each hero animates independently when it enters viewport)
// ------------------------
const familyHeroes = document.querySelectorAll(".family-hero");

if (familyHeroes.length > 0 && "IntersectionObserver" in window) {
  const familyHeroObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Hero entered viewport - trigger animation
          entry.target.classList.add("family-hero--animated");
        } else {
          // Hero exited viewport - reset animation so it can replay when entering again
          entry.target.classList.remove("family-hero--animated");
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of hero section is visible
  );

  familyHeroes.forEach(hero => {
    familyHeroObserver.observe(hero);
  });
} else if (familyHeroes.length > 0) {
  // Fallback - trigger immediately
  familyHeroes.forEach(hero => {
    hero.classList.add("family-hero--animated");
  });
}

// ------------------------
// Countdown (includes seconds)
// ------------------------
const targetDate = new Date("2026-01-11T11:30:00+07:00"); // adjust time zone

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "0";
    if (hoursEl) hoursEl.textContent = "0";
    if (minutesEl) minutesEl.textContent = "0";
    if (secondsEl) secondsEl.textContent = "0";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  if (daysEl) daysEl.textContent = String(days);
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

if (daysEl && hoursEl && minutesEl && secondsEl) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ------------------------
// RSVP form validation
// ------------------------
const rsvpForm = document.getElementById("rsvpForm");
const rsvpSuccess = document.getElementById("rsvpSuccess");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    rsvpForm
      .querySelectorAll(".rsvp-form__error")
      .forEach(el => el.classList.remove("is-visible"));
    if (rsvpSuccess) rsvpSuccess.textContent = "";

    const name = rsvpForm.elements["name"];
    const phone = rsvpForm.elements["phone"];
    const guests = rsvpForm.elements["guests"];
    const attendance = rsvpForm.elements["attendance"];
    const message = rsvpForm.elements["message"];

    if (!name.value.trim()) {
      showError("name");
    }
    if (!phone.value.trim()) {
      showError("phone");
    }
    if (!guests.value || Number(guests.value) <= 0) {
      showError("guests");
    }
    if (!rsvpForm.querySelector('input[name="attendance"]:checked')) {
      showError("attendance");
    }

    function showError(fieldName) {
      valid = false;
      const field = rsvpForm.elements[fieldName];
      let row;
      if (field && field.closest) {
        row = field.closest(".rsvp-form__row");
      } else {
        // radio group (attendance) — fallback to find the attendance row
        row = rsvpForm.querySelector('.rsvp-form__row:has(input[name="attendance"])') || rsvpForm.querySelector('.rsvp-form__row');
      }
      const error = row && row.querySelector(".rsvp-form__error");
      if (error) {
        // Use localized error string when available
        const key = `rsvp.errors.${fieldName}`;
        const localized = t(key);
        if (localized) {
          error.textContent = localized;
        }
        error.classList.add("is-visible");
      }
    }

    if (!valid) return;

    // Add loading state to button
    const submitBtn = rsvpForm.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = t('rsvp.sending') || "Sending…";
    submitBtn.disabled = true;

    const submissionSnapshot = {
      name: name.value.trim(),
      guests: guests.value || "1",
      attendance: rsvpForm.querySelector('input[name="attendance"]:checked')?.value || "",
      message: message ? message.value.trim() : ""
    };

    // Here you would send data via fetch/AJAX
    // fetch('/api/rsvp', {method:'POST', body: new FormData(rsvpForm)})

    setTimeout(() => {
      rsvpForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
        if (rsvpSuccess) {
          const safeName = escapeHtml(submissionSnapshot.name || "Friend");
          const guestCount = submissionSnapshot.guests;
          const detailsTemplate = t('rsvp.success.details') || "{name}, we reserved {guests} seats for you.";
          const detailText = detailsTemplate.replace("{name}", safeName).replace("{guests}", guestCount);
          rsvpSuccess.innerHTML = `<strong>${t('rsvp.success') || "✓ Thank you! Your RSVP has been recorded."}</strong><br><span>${detailText}</span>`;
          rsvpSuccess.style.color = "#2f7e4b";
        }
    }, 1500);
  });
}

// ------------------------
// Lightbox for gallery
// ------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox__image");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxInner = document.querySelector(".lightbox__inner");
let _previousFocus = null;
if (lightbox && lightboxImg && lightboxClose) {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function openLightbox(src) {
    _previousFocus = document.activeElement;
    lightboxImg.setAttribute("src", src);
    lightbox.classList.add("is-visible");
    lightbox.setAttribute("aria-hidden", "false");
    // set caption from matching carousel image (if any)
    try {
      const captionEl = document.getElementById('lightboxCaption');
      let captionText = '';
      // try match image in carousel by src
      const match = document.querySelector(`#albumCarousel img[src="${src}"]`);
      if (match) {
        const key = match.getAttribute('data-caption-key');
        if (key) captionText = t(key);
      }
      if (captionEl) {
        captionEl.textContent = captionText || '';
        captionEl.setAttribute('aria-hidden', captionText ? 'false' : 'true');
      }
    } catch (err) {
      // ignore
    }
    document.body.classList.add("is-locked");
    // move focus into the dialog
    if (lightboxInner) {
      lightboxInner.focus();
    } else {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.setAttribute("src", "");
    document.body.classList.remove("is-locked");
    // restore focus to previously focused element
    try {
      if (_previousFocus && typeof _previousFocus.focus === "function") {
        _previousFocus.focus();
      }
    } catch (err) {
      // ignore
    }
  }

  // Hook data-lightbox buttons (thumbnails etc.)
  document.querySelectorAll("[data-lightbox]").forEach(btn => {
    btn.addEventListener("click", e => {
      const src = btn.getAttribute("data-lightbox");
      openLightbox(src);
    });
    // allow keyboard activation (Enter/Space handled by button element)
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox.classList.contains("is-visible")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("is-visible") || e.key !== "Tab") return;
    const focusable = lightboxInner ? lightboxInner.querySelectorAll(focusableSelectors) : [];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Expose openLightbox globally for other handlers (used below)
  window.openLightbox = openLightbox;
}

// ------------------------
// Carousel -> Lightbox bridge and thumbnail active state
// ------------------------
const albumCarousel = document.getElementById("albumCarousel");
if (albumCarousel) {
  // Open lightbox when carousel image is clicked
  albumCarousel.querySelectorAll(".carousel-item img").forEach(img => {
    img.addEventListener("click", () => {
      if (typeof window.openLightbox === "function") {
        window.openLightbox(img.getAttribute("src"));
      }
    });
    // make images keyboard-operable
    img.setAttribute("tabindex", "0");
    img.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (typeof window.openLightbox === "function") window.openLightbox(img.getAttribute("src"));
      }
    });
  });

  // Keep thumbnails in sync with carousel slides
  const thumbBtns = document.querySelectorAll(".thumb-btn");
  const indicators = albumCarousel.querySelectorAll('.carousel-indicators button');

  function syncActive(index) {
    thumbBtns.forEach((b, i) => {
      b.classList.toggle("active", i === index);
      if (i === index) {
        b.setAttribute('aria-current', 'true');
      } else {
        b.removeAttribute('aria-current');
      }
    });
    indicators.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      if (i === index) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
    });
  }

  // initial sync
  syncActive(0);

  albumCarousel.addEventListener("slid.bs.carousel", function (event) {
    const idx = event.to;
    syncActive(idx);
  });

  // make thumbnails keyboard-operable and clickable
  thumbBtns.forEach((b, i) => {
    b.addEventListener('click', () => {
      // trigger slide via indicator button
      const indicator = indicators[i];
      if (indicator) indicator.click();
      syncActive(i);
    });
    b.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        b.click();
      }
    });
  });

  // keyboard left/right on carousel container
  const prevBtn = albumCarousel.querySelector('.carousel-control-prev');
  const nextBtn = albumCarousel.querySelector('.carousel-control-next');
  albumCarousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { if (prevBtn) prevBtn.click(); }
    if (e.key === 'ArrowRight') { if (nextBtn) nextBtn.click(); }
  });
}

// ------------------------
// Floating petals
// ------------------------
const petalsContainer = document.querySelector(".petals");

if (petalsContainer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const PETAL_COUNT = 16;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    const duration = 12 + Math.random() * 12;
    const delay = Math.random() * -duration;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--start-x", `${Math.random() * 20 - 10}%`);
    petal.style.setProperty("--end-x", `${Math.random() * 20 - 10}%`);
    petalsContainer.appendChild(petal);
  }
}


// ------------------------
// QR Code Modal
// ------------------------
const qrModal = document.getElementById("qrModal");
const qrModalOverlay = document.getElementById("qrModalOverlay");
const qrModalClose = document.getElementById("qrModalClose");
const qrExpandBtn = document.getElementById("qrExpandBtn");

if (qrModal && qrExpandBtn) {
  function openQRModal() {
    qrModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeQRModal() {
    qrModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  qrExpandBtn.addEventListener("click", openQRModal);
  if (qrModalOverlay) qrModalOverlay.addEventListener("click", closeQRModal);
  if (qrModalClose) qrModalClose.addEventListener("click", closeQRModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && qrModal.getAttribute("aria-hidden") === "false") {
      closeQRModal();
    }
  });
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
