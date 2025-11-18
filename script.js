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
    // Meta tags
    "meta.title": "Thiên Ân & Huỳnh Trúc – Wedding Invitation",
    "meta.description": "Celebrate the wedding of Thiên Ân & Huỳnh Trúc in Hồ Chí Minh City on 11 January 2026. View event details, RSVP, gallery, gifts, and travel info.",
    "meta.og.title": "Thiên Ân & Huỳnh Trúc – Wedding Invitation",
    "meta.og.description": "Join us on 11 January 2026 in Hồ Chí Minh City. View schedule, gallery, RSVP, and travel tips.",
    "meta.og.locale": "en_US",
    "meta.og.siteName": "Thiên Ân & Huỳnh Trúc Wedding",
    "meta.twitter.title": "Thiên Ân & Huỳnh Trúc – Wedding Invitation",
    "meta.twitter.description": "We are getting married! Discover our story, events, gallery, RSVP, and travel details.",
    
    // Header
    "header.label": "Wedding of",
    "header.menu.toggle": "Toggle navigation menu",
    
    // Navigation
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.rsvp": "Celebration",
    "nav.contact": "Contact",
    
    // Hero
    "hero.eyebrow": "We are getting married",
    "hero.cta": "Confirm Your Attendance",
    "hero.location": "Hồ Chí Minh City",
    "hero.image.alt": "Photo of the couple",
    
    // Countdown
    "count.days": "Days",
    "count.hours": "Hours",
    "count.minutes": "Minutes",
    "count.seconds": "Seconds",
    
    // Music & Share
    "music.play": "Music",
    "music.pause": "Pause",
    "music.ariaLabel": "Toggle background music",
    "share.label": "Share",
    "share.ariaLabel": "Share this invitation",
    "share.title": "Share this invitation",
    
    // Couple Section
    "couple.eyebrow": "Meet Us",
    "couple.title": "Two hearts, one promise",
    "couple.groom.vietnameseLabel": "Chú Rể",
    "couple.groom.eyebrow": "The Groom",
    "couple.groom.name": "Nguyễn Thiên Ân",
    "couple.groom.text": "A patient listener, designer by day, and amateur guitarist by night. Thiên Ân believes in slow mornings, handwritten letters, and love that grows quietly and steadily.",
    "couple.groom.fact1": "Architect & coffee devotee",
    "couple.groom.fact2": "Most likely to whistle our favorite song",
    "couple.groom.fact3": "Vows to keep every promise he makes",
    "couple.groom.image.alt": "Portrait of Thiên Ân",
    "couple.bride.vietnameseLabel": "Cô Dâu",
    "couple.bride.eyebrow": "The Bride",
    "couple.bride.name": "Huỳnh Trúc",
    "couple.bride.text": "A joyful storyteller, educator, and floral enthusiast. Trúc lights up every room with her laugh and keeps everyone calm with a warm embrace.",
    "couple.bride.fact1": "Lover of poetry & playlists",
    "couple.bride.fact2": "Will never say no to a sunset walk",
    "couple.bride.fact3": "Cannot wait to dance with you",
    "couple.bride.image.alt": "Portrait of Huỳnh Trúc",
    
    // Family Section
    "family.eyebrow": "Meet the Families",
    "family.title": "A union of hearts",
    "family.groom.title": "Groom's Family",
    "family.groom.label": "Parents of the groom",
    "family.groom.parents": "Mr. Hưng & Mrs. Chi",
    "family.groom.image.alt": "Groom's family photo",
    "family.bride.title": "Bride's Family",
    "family.bride.label": "Parents of the bride",
    "family.bride.parents": "Mr. Nhanh & Mrs. Nga",
    "family.bride.image.alt": "Bride's family photo",
    "family.union.title": "Two Families, One Celebration",
    "family.union.text": "We joyfully unite our families and invite you to celebrate this union with us.",
    "family.union.image.alt": "Our united families",
    
    // Events Section
    "events.eyebrow": "Wedding Events",
    "events.title": "Save the moments",
    "events.date.full": "11 January 2026",
    "events.ceremony.title": "Lễ Vu Quy (Bride's Ceremony)",
    "events.ceremony.description": "A warm family ritual to honor our parents and ancestors, complete with tea blessings and intimate vows.",
    "events.ceremony.location": "123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
    "events.ceremony.badge.scope": "Family only",
    "events.ceremony.dress": "Traditional tones / pastels",
    "events.reception.title": "Wedding Ceremony & Reception",
    "events.reception.description": "Join us for vows beneath hanging lights, followed by a chef-curated lunch, champagne toasts, and a lively dance floor.",
    "events.reception.location": "The Rose Garden Hall, 456 Đường Ánh Trăng, TP. Hồ Chí Minh",
    "events.reception.badge.scope": "All guests",
    "events.reception.program": "Welcome drinks · Ceremony · Feast · First dance",
    "events.labels.date": "Date",
    "events.labels.venue": "Venue",
    "events.labels.dress": "Dress",
    "events.labels.program": "Program",
    
    // Gallery Section
    "gallery.eyebrow": "Album",
    "gallery.title": "A glimpse of our love",
    "gallery.caption.0": "A sweet moment together",
    "gallery.caption.1": "Walking by the river",
    "gallery.caption.2": "Laughs and lights",
    "gallery.caption.3": "Our favorite place",
    "gallery.image.1.alt": "Gallery image 1",
    "gallery.image.2.alt": "Gallery image 2",
    "gallery.image.3.alt": "Gallery image 3",
    "gallery.image.4.alt": "Gallery image 4",
    "gallery.slide.1": "Slide 1",
    "gallery.slide.2": "Slide 2",
    "gallery.slide.3": "Slide 3",
    "gallery.slide.4": "Slide 4",
    "gallery.thumb.1": "Show slide 1",
    "gallery.thumb.2": "Show slide 2",
    "gallery.thumb.3": "Show slide 3",
    "gallery.thumb.4": "Show slide 4",
    "gallery.thumb.1.alt": "Thumbnail 1",
    "gallery.thumb.2.alt": "Thumbnail 2",
    "gallery.thumb.3.alt": "Thumbnail 3",
    "gallery.thumb.4.alt": "Thumbnail 4",
    "gallery.carousel.prev": "Previous",
    "gallery.carousel.next": "Next",
    "gallery.lightbox.ariaLabel": "Gallery preview",
    "gallery.lightbox.close.ariaLabel": "Close image",
    "gallery.lightbox.image.alt": "Gallery large view",
    
    // RSVP Section
    "rsvp.eyebrow": "Celebrate With Us",
    "rsvp.subtitle": "Will you join us?",
    "rsvp.title": "📋 Confirm Your Attendance",
    "rsvp.name.label": "Your full name*",
    "rsvp.name.placeholder": "Your full name",
    "rsvp.phone.label": "Phone number*",
    "rsvp.phone.placeholder": "Phone number",
    "rsvp.guests.label": "Number of guests*",
    "rsvp.attend.label": "Will you attend?*",
    "rsvp.attend.yes": "✓ Yes, I'll be there",
    "rsvp.attend.no": "✗ Sorry, I can't",
    "rsvp.message.label": "Message to the couple",
    "rsvp.message.placeholder": "Share travel plans, blessings, allergens...",
    "rsvp.message.hint": "Optional, but we'd love to read it.",
    "rsvp.dietary.label": "Dietary preferences",
    "rsvp.dietary.none": "No restrictions",
    "rsvp.dietary.vegetarian": "Vegetarian",
    "rsvp.dietary.vegan": "Vegan",
    "rsvp.dietary.halal": "Halal",
    "rsvp.dietary.glutenFree": "Gluten-free",
    "rsvp.dietary.other": "Other (please specify in message)",
    "rsvp.button": "Send RSVP",
    "rsvp.sending": "Sending…",
    "rsvp.errors.name": "Please enter your name",
    "rsvp.errors.phone": "Please enter your phone",
    "rsvp.errors.guests": "Please specify number of guests",
    "rsvp.errors.attendance": "Please select an option",
    "rsvp.success": "✓ Thank you! Your RSVP has been recorded. We can't wait to see you.",
    "rsvp.success.details": "{name}, we reserved {guests} seats for you.",
    
    // Gifts Section
    "gifts.eyebrow": "Love & Practicalities",
    "gifts.title": "Gifts, dress code & travel tips",
    "gifts.card.title": "Gửi quà mừng cưới",
    "gifts.card.subtitle": "Your presence is enough",
    "gifts.card.text": "Sharing this day with you is the greatest gift. If you'd still like to bless us, scan the QR code below:",
    "gifts.card.qr.alt": "Banking QR Code",
    "gifts.card.expand.label": "Tap to enlarge",
    "gifts.card.expand.ariaLabel": "Expand QR code",
    "gifts.card.bank.label": "Bank:",
    "gifts.card.bank.value": "Vietcombank",
    "gifts.card.accountName.label": "Acc Name:",
    "gifts.card.accountNo.label": "Acc No:",
    "gifts.card.modal.ariaLabel": "QR Code",
    "gifts.card.modal.close.ariaLabel": "Close QR code",
    "gifts.card.modal.image.alt": "Banking QR Code - Large View",
    "gifts.dress.title": "Dress in soft pastels",
    "gifts.dress.text": "Think airy fabrics, pastel tones, and comfortable shoes for dancing. Gentlemen, smart-casual or semi-formal works perfectly.",
    "gifts.dress.tip1": "Pastel pink, champagne, or sage",
    "gifts.dress.tip2": "Comfortable heels or loafers",
    "gifts.dress.tip3": "Bring a light shawl for air-conditioned halls",
    "gifts.travel.title": "Travel & stay",
    "gifts.travel.text": "The venue offers valet parking. Guests arriving from afar can choose nearby hotels in District 1 (5-10 minutes away).",
    "gifts.travel.tip1": "Rose Garden Hall, 456 Đường Ánh Trăng",
    "gifts.travel.tip2": "Grab / Taxi drop-off lane available",
    "gifts.travel.tip3": "Suggested hotels: The Myst Đồng Khởi, Liberty Riverside",
    
    // Map Section
    "map.eyebrow": "Location",
    "map.title": "How to get there",
    "map.directions": "📍 Get Directions",
    
    // Contact Section
    "contact.eyebrow": "Stay in touch",
    "contact.title": "We would love to hear from you",
    "contact.phone.title": "Call us",
    "contact.phone.text": "Need help with transportation or directions? Call anytime.",
    "contact.email.title": "Email",
    "contact.email.text": "Send your questions, song requests, or travel plans.",
    "contact.social.title": "Social & updates",
    "contact.social.text": "Follow along for behind-the-scenes moments and live updates.",
    "contact.social.instagram": "Instagram",
    "contact.social.facebook": "Facebook",
    "contact.social.youtube": "YouTube",
    
    // Footer
    "footer.thanks": "Thank you for being part of our day.",
    "footer.back": "Back to top ↑",
    "footer.date": "11 • 01 • 2026 — Hồ Chí Minh City",
    
    // Sticky
    "sticky.label": "RSVP",
    "sticky.ariaLabel": "Open RSVP"
  },
  vi: {
    // Meta tags
    "meta.title": "Thiên Ân & Huỳnh Trúc – Thiệp Mời Cưới",
    "meta.description": "Tham dự lễ cưới của Thiên Ân & Huỳnh Trúc tại TP. Hồ Chí Minh vào ngày 11 tháng 1 năm 2026. Xem chi tiết sự kiện, xác nhận tham dự, album ảnh, quà tặng và thông tin đi lại.",
    "meta.og.title": "Thiên Ân & Huỳnh Trúc – Thiệp Mời Cưới",
    "meta.og.description": "Tham gia cùng chúng tôi vào ngày 11 tháng 1 năm 2026 tại TP. Hồ Chí Minh. Xem lịch trình, album ảnh, xác nhận tham dự và mẹo đi lại.",
    "meta.og.locale": "vi_VN",
    "meta.og.siteName": "Đám Cưới Thiên Ân & Huỳnh Trúc",
    "meta.twitter.title": "Thiên Ân & Huỳnh Trúc – Thiệp Mời Cưới",
    "meta.twitter.description": "Chúng tôi sắp kết hôn! Khám phá câu chuyện của chúng tôi, sự kiện, album ảnh, xác nhận tham dự và chi tiết đi lại.",
    
    // Header
    "header.label": "Đám Cưới Của",
    "header.menu.toggle": "Chuyển đổi menu điều hướng",
    
    // Navigation
    "nav.events": "Sự kiện",
    "nav.gallery": "Album",
    "nav.rsvp": "Lễ",
    "nav.contact": "Liên hệ",
    
    // Hero
    "hero.eyebrow": "Chúng tôi sắp kết hôn",
    "hero.cta": "Xác nhận tham dự",
    "hero.location": "TP. Hồ Chí Minh",
    "hero.image.alt": "Ảnh đôi bạn trẻ",
    
    // Countdown
    "count.days": "Ngày",
    "count.hours": "Giờ",
    "count.minutes": "Phút",
    "count.seconds": "Giây",
    
    // Music & Share
    "music.play": "Nhạc",
    "music.pause": "Tạm dừng",
    "music.ariaLabel": "Bật/tắt nhạc nền",
    "share.label": "Chia sẻ",
    "share.ariaLabel": "Chia sẻ thiệp mời này",
    "share.title": "Chia sẻ thiệp mời này",
    
    // Couple Section
    "couple.eyebrow": "Gặp Gỡ Chúng Tôi",
    "couple.title": "Hai trái tim, một lời hứa",
    "couple.groom.vietnameseLabel": "Chú Rể",
    "couple.groom.eyebrow": "Chú Rể",
    "couple.groom.name": "Nguyễn Thiên Ân",
    "couple.groom.text": "Người kiên nhẫn lắng nghe, nhà thiết kế ban ngày, và tay guitar nghiệp dư ban đêm. Thiên Ân tin vào những buổi sáng chậm rãi, những lá thư viết tay, và tình yêu phát triển một cách lặng lẽ và ổn định.",
    "couple.groom.fact1": "Kiến trúc sư & người yêu cà phê",
    "couple.groom.fact2": "Rất có khả năng sẽ huýt sáo bài hát yêu thích của chúng tôi",
    "couple.groom.fact3": "Hứa sẽ giữ mọi lời hứa mình đã nói",
    "couple.groom.image.alt": "Chân dung Thiên Ân",
    "couple.bride.vietnameseLabel": "Cô Dâu",
    "couple.bride.eyebrow": "Cô Dâu",
    "couple.bride.name": "Huỳnh Trúc",
    "couple.bride.text": "Người kể chuyện vui vẻ, nhà giáo dục, và người yêu hoa. Trúc làm bừng sáng mọi căn phòng bằng tiếng cười của cô và khiến mọi người bình tĩnh bằng vòng tay ấm áp.",
    "couple.bride.fact1": "Người yêu thơ ca & danh sách nhạc",
    "couple.bride.fact2": "Sẽ không bao giờ từ chối đi dạo lúc hoàng hôn",
    "couple.bride.fact3": "Không thể chờ đợi để nhảy cùng bạn",
    "couple.bride.image.alt": "Chân dung Huỳnh Trúc",
    
    // Family Section
    "family.eyebrow": "Gặp gỡ gia đình",
    "family.title": "Hòa hợp trái tim",
    "family.groom.title": "Gia đình chú rể",
    "family.groom.label": "Gia đình nhà trai",
    "family.groom.parents": "Ông Hưng & Bà Chi",
    "family.groom.image.alt": "Ảnh gia đình nhà trai",
    "family.bride.title": "Gia đình cô dâu",
    "family.bride.label": "Gia đình nhà gái",
    "family.bride.parents": "Ông Nhanh & Bà Nga",
    "family.bride.image.alt": "Ảnh gia đình nhà gái",
    "family.union.title": "Hai Gia Đình, Một Lễ Kỷ Niệm",
    "family.union.text": "Chúng tôi vui mừng kết hợp gia đình của mình và mời bạn cùng chúng tôi kỷ niệm sự kết hợp này.",
    "family.union.image.alt": "Gia đình chúng tôi đoàn tụ",
    
    // Events Section
    "events.eyebrow": "Sự kiện cưới",
    "events.title": "Lưu giữ khoảnh khắc",
    "events.date.full": "11 tháng 1 năm 2026",
    "events.ceremony.title": "Lễ Vu Quy",
    "events.ceremony.description": "Nghi lễ gia đình ấm áp để tôn vinh cha mẹ và tổ tiên của chúng tôi, bao gồm nghi thức trà và lời thề thân mật.",
    "events.ceremony.location": "123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
    "events.ceremony.badge.scope": "Thành viên gia đình",
    "events.ceremony.dress": "Tông truyền thống / pastel",
    "events.reception.title": "Lễ Cưới & Tiệc",
    "events.reception.description": "Tham gia cùng chúng tôi trong lời thề dưới ánh đèn treo, tiếp theo là bữa trưa do đầu bếp chuẩn bị, chúc rượu champagne, và sàn nhảy sôi động.",
    "events.reception.location": "The Rose Garden Hall, 456 Đường Ánh Trăng, TP. Hồ Chí Minh",
    "events.reception.badge.scope": "Toàn bộ khách mời",
    "events.reception.program": "Đón khách · Nghi lễ · Tiệc · Điệu nhảy đầu tiên",
    "events.labels.date": "Ngày",
    "events.labels.venue": "Địa điểm",
    "events.labels.dress": "Trang phục",
    "events.labels.program": "Chương trình",
    
    // Gallery Section
    "gallery.eyebrow": "Album",
    "gallery.title": "Khoảnh khắc của chúng tôi",
    "gallery.caption.0": "Khoảnh khắc ngọt ngào bên nhau",
    "gallery.caption.1": "Dạo bước bên sông",
    "gallery.caption.2": "Tiếng cười và ánh đèn",
    "gallery.caption.3": "Nơi ta yêu thích",
    "gallery.image.1.alt": "Ảnh album 1",
    "gallery.image.2.alt": "Ảnh album 2",
    "gallery.image.3.alt": "Ảnh album 3",
    "gallery.image.4.alt": "Ảnh album 4",
    "gallery.slide.1": "Trang 1",
    "gallery.slide.2": "Trang 2",
    "gallery.slide.3": "Trang 3",
    "gallery.slide.4": "Trang 4",
    "gallery.thumb.1": "Hiển thị trang 1",
    "gallery.thumb.2": "Hiển thị trang 2",
    "gallery.thumb.3": "Hiển thị trang 3",
    "gallery.thumb.4": "Hiển thị trang 4",
    "gallery.thumb.1.alt": "Ảnh nhỏ 1",
    "gallery.thumb.2.alt": "Ảnh nhỏ 2",
    "gallery.thumb.3.alt": "Ảnh nhỏ 3",
    "gallery.thumb.4.alt": "Ảnh nhỏ 4",
    "gallery.carousel.prev": "Trước",
    "gallery.carousel.next": "Tiếp",
    "gallery.lightbox.ariaLabel": "Xem trước album",
    "gallery.lightbox.close.ariaLabel": "Đóng ảnh",
    "gallery.lightbox.image.alt": "Xem ảnh lớn",
    
    // RSVP Section
    "rsvp.eyebrow": "Cùng Chúng Tôi Kỷ Niệm",
    "rsvp.subtitle": "Bạn sẽ tham gia cùng chúng tôi chứ?",
    "rsvp.title": "📋 Xác nhận tham dự",
    "rsvp.name.label": "Họ và tên*",
    "rsvp.name.placeholder": "Họ và tên",
    "rsvp.phone.label": "Số điện thoại*",
    "rsvp.phone.placeholder": "Số điện thoại",
    "rsvp.guests.label": "Số lượng khách*",
    "rsvp.attend.label": "Bạn có tham dự không?*",
    "rsvp.attend.yes": "✓ Tôi sẽ tham dự",
    "rsvp.attend.no": "✗ Xin lỗi, tôi không thể",
    "rsvp.message.label": "Lời nhắn gửi đôi trẻ",
    "rsvp.message.placeholder": "Chia sẻ kế hoạch di chuyển, lời chúc, lưu ý món ăn...",
    "rsvp.message.hint": "Không bắt buộc, nhưng chúng tôi rất muốn đọc!",
    "rsvp.dietary.label": "Yêu cầu chế độ ăn",
    "rsvp.dietary.none": "Không có hạn chế",
    "rsvp.dietary.vegetarian": "Chay",
    "rsvp.dietary.vegan": "Thuần chay",
    "rsvp.dietary.halal": "Halal",
    "rsvp.dietary.glutenFree": "Không chứa gluten",
    "rsvp.dietary.other": "Khác (vui lòng ghi rõ trong tin nhắn)",
    "rsvp.button": "Gửi RSVP",
    "rsvp.sending": "Đang gửi…",
    "rsvp.errors.name": "Vui lòng nhập họ và tên",
    "rsvp.errors.phone": "Vui lòng nhập số điện thoại",
    "rsvp.errors.guests": "Vui lòng nhập số khách",
    "rsvp.errors.attendance": "Vui lòng chọn một tùy chọn",
    "rsvp.success": "✓ Cảm ơn! RSVP của bạn đã được ghi nhận. Chúng tôi rất mong được gặp bạn.",
    "rsvp.success.details": "{name}, chúng tôi đã giữ {guests} chỗ cho bạn.",
    
    // Gifts Section
    "gifts.eyebrow": "Tình Yêu & Thực Tế",
    "gifts.title": "Quà tặng, trang phục & mẹo đi lại",
    "gifts.card.title": "Gửi quà mừng cưới",
    "gifts.card.subtitle": "Sự hiện diện của bạn là đủ",
    "gifts.card.text": "Chia sẻ ngày này cùng bạn là món quà tuyệt vời nhất. Nếu bạn vẫn muốn chúc phúc cho chúng tôi, hãy quét mã QR bên dưới:",
    "gifts.card.qr.alt": "Mã QR Ngân hàng",
    "gifts.card.expand.label": "Nhấn để phóng to",
    "gifts.card.expand.ariaLabel": "Phóng to mã QR",
    "gifts.card.bank.label": "Ngân hàng:",
    "gifts.card.bank.value": "Vietcombank",
    "gifts.card.accountName.label": "Tên tài khoản:",
    "gifts.card.accountNo.label": "Số tài khoản:",
    "gifts.card.modal.ariaLabel": "Mã QR",
    "gifts.card.modal.close.ariaLabel": "Đóng mã QR",
    "gifts.card.modal.image.alt": "Mã QR Ngân hàng - Xem Lớn",
    "gifts.dress.title": "Trang phục màu pastel nhẹ nhàng",
    "gifts.dress.text": "Nghĩ đến vải mỏng nhẹ, tông màu pastel, và giày dép thoải mái để nhảy. Các bạn nam, smart-casual hoặc bán trang trọng hoàn toàn phù hợp.",
    "gifts.dress.tip1": "Hồng pastel, champagne, hoặc xanh lá cây",
    "gifts.dress.tip2": "Giày cao gót thoải mái hoặc giày lười",
    "gifts.dress.tip3": "Mang theo khăn choàng nhẹ cho các phòng có điều hòa",
    "gifts.travel.title": "Đi lại & nghỉ ngơi",
    "gifts.travel.text": "Địa điểm có dịch vụ đỗ xe. Khách từ xa đến có thể chọn các khách sạn gần đó ở Quận 1 (cách 5-10 phút).",
    "gifts.travel.tip1": "Rose Garden Hall, 456 Đường Ánh Trăng",
    "gifts.travel.tip2": "Có làn đưa đón Grab / Taxi",
    "gifts.travel.tip3": "Khách sạn đề xuất: The Myst Đồng Khởi, Liberty Riverside",
    
    // Map Section
    "map.eyebrow": "Địa điểm",
    "map.title": "Cách đến",
    "map.directions": "📍 Chỉ đường",
    
    // Contact Section
    "contact.eyebrow": "Giữ liên lạc",
    "contact.title": "Chúng tôi rất muốn nghe từ bạn",
    "contact.phone.title": "Gọi cho chúng tôi",
    "contact.phone.text": "Cần giúp đỡ về phương tiện đi lại hoặc chỉ đường? Gọi bất cứ lúc nào.",
    "contact.email.title": "Email",
    "contact.email.text": "Gửi câu hỏi, yêu cầu bài hát hoặc kế hoạch đi lại của bạn.",
    "contact.social.title": "Mạng xã hội & cập nhật",
    "contact.social.text": "Theo dõi để xem những khoảnh khắc hậu trường và cập nhật trực tiếp.",
    "contact.social.instagram": "Instagram",
    "contact.social.facebook": "Facebook",
    "contact.social.youtube": "YouTube",
    
    // Footer
    "footer.thanks": "Cảm ơn bạn đã là một phần của ngày hôm nay.",
    "footer.back": "Lên đầu trang ↑",
    "footer.date": "11 • 01 • 2026 — TP. Hồ Chí Minh",
    
    // Sticky
    "sticky.label": "Xác nhận",
    "sticky.ariaLabel": "Mở xác nhận tham dự"
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
  
  // Apply text content translations
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

  // Apply placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    el.setAttribute('placeholder', text);
  });

  // Apply alt attribute translations
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    el.setAttribute('alt', text);
  });

  // Apply aria-label translations
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    el.setAttribute('aria-label', text);
  });

  // Apply title attribute translations
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    el.setAttribute('title', text);
  });

  // Apply select option translations
  document.querySelectorAll('select option[data-i18n]').forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (!key) return;
    const text = dict[key];
    if (typeof text === 'undefined') return;
    option.textContent = text;
  });

  // Update meta tags
  const metaTitle = document.getElementById('meta-title');
  if (metaTitle && dict['meta.title']) {
    metaTitle.textContent = dict['meta.title'];
    document.title = dict['meta.title'];
  }

  const metaDescription = document.getElementById('meta-description');
  if (metaDescription && dict['meta.description']) {
    metaDescription.setAttribute('content', dict['meta.description']);
  }

  const ogTitle = document.getElementById('og-title');
  if (ogTitle && dict['meta.og.title']) {
    ogTitle.setAttribute('content', dict['meta.og.title']);
  }

  const ogDescription = document.getElementById('og-description');
  if (ogDescription && dict['meta.og.description']) {
    ogDescription.setAttribute('content', dict['meta.og.description']);
  }

  const ogLocale = document.getElementById('og-locale');
  if (ogLocale && dict['meta.og.locale']) {
    ogLocale.setAttribute('content', dict['meta.og.locale']);
  }

  const ogSiteName = document.getElementById('og-site-name');
  if (ogSiteName && dict['meta.og.siteName']) {
    ogSiteName.setAttribute('content', dict['meta.og.siteName']);
  }

  const twitterTitle = document.getElementById('twitter-title');
  if (twitterTitle && dict['meta.twitter.title']) {
    twitterTitle.setAttribute('content', dict['meta.twitter.title']);
  }

  const twitterDescription = document.getElementById('twitter-description');
  if (twitterDescription && dict['meta.twitter.description']) {
    twitterDescription.setAttribute('content', dict['meta.twitter.description']);
  }

  // Update HTML lang attribute
  const htmlLang = document.getElementById('html-lang');
  if (htmlLang) {
    const currentLang = localStorage.getItem(LANG_KEY) || (navigator.language && navigator.language.startsWith('vi') ? 'vi' : 'en');
    htmlLang.setAttribute('lang', currentLang);
  }

  // Update any dynamic labels that rely on t()
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
