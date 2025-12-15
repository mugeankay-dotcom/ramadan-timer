const API_URL = 'https://api.aladhan.com/v1/timings';
const RAMADAN_START_DATE = new Date('2026-02-18T00:00:00'); // Estimated Start

// GLOBAL BLOCK: Disable Right-Click immediately (Capture Phase)
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, true); // true = capture phase

const translations = {
    tr: {
        title: "Hoşgeldin Ramazan 2026",
        menuTitle: "Menü",
        prayersTitle: "Dualar",
        nextEventLabel: "18 Şubat 2026 - Ramazan Başlangıcına Kalan Süre",
        loading: "Yükleniyor...",
        hours: "Saat",
        minutes: "Dakika",
        seconds: "Saniye",
        days: "GÜN",
        locationFound: "Konum Algılandı",
        locationDefault: "İstanbul (Varsayılan)",
        ramadanStart: "Ramazan 2026 Başlangıcı",
        imsakLeft: "İmsak'a Kalan Süre",
        iftarLeft: "İftar'a Kalan Süre",
        tomorrowImsak: "Yarınki İmsak'a Kalan Süre",
        todayPrayers: "Bugünün Vakitleri",
        // Zikirmatik translation
        dhikrTitle: "Günlük Zikirlerim",
        dhikrLabel: "Zikir",
        historyTitle: "Zikir Geçmişi",
        historyEmpty: "Henüz kayıt yok.",
        resetBtn: "SIFIRLA",
        vibrateBtn: "TİTREŞİM",
        dhikrOptions: {
            custom: "Serbest Zikir",
            subhanallah: "Sübhanallah (33)",
            elhamdulillah: "Elhamdülillah (33)",
            allahuekber: "Allahuekber (33)",
            lailaheillallah: "La İlahe İllallah (99)"
        },
        prayers: {
            Imsak: "İmsak",
            Sunrise: "Güneş",
            Dhuhr: "Öğle",
            Asr: "İkindi",
            Maghrib: "İftar",
            Isha: "Yatsı"
        }
    },
    en: {
        title: "Welcome Ramadan 2026",
        prayersTitle: "Prayers",
        nextEventLabel: "Feb 18, 2026 - Next Prayer",
        loading: "Loading...",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        days: "DAYS",
        locationFound: "Location Detected",
        locationDefault: "Istanbul (Default)",
        ramadanStart: "Ramadan 2026 Start",
        imsakLeft: "Time until Imsak",
        iftarLeft: "Time until Iftar",
        tomorrowImsak: "Time until Tomorrow's Imsak",
        todayPrayers: "Today's Prayers",
        // Zikirmatik translation
        dhikrTitle: "My Daily Dhikr",
        dhikrLabel: "Dhikr",
        historyTitle: "Dhikr History",
        historyEmpty: "No records yet.",
        resetBtn: "RESET",
        vibrateBtn: "VIBRATE",
        dhikrOptions: {
            custom: "Free Dhikr",
            subhanallah: "Subhanallah (33)",
            elhamdulillah: "Alhamdulillah (33)",
            allahuekber: "Allahu Akbar (33)",
            lailaheillallah: "La Ilaha Illallah (99)"
        },
        prayers: {
            Imsak: "Imsak",
            Sunrise: "Sunrise",
            Dhuhr: "Dhuhr",
            Asr: "Asr",
            Maghrib: "Iftar",
            Isha: "Isha"
        }
    },
    ar: {
        menuTitle: "القائمة", // Assuming menuTitle key exists or adding it if missing
        prayersTitle: "أدعية",
        nextEventLabel: " ١٨ فبراير ٢٠٢٦ - الصلاة القادمة",
        loading: "جار التحميل...",
        hours: "ساعات",
        minutes: "دقيقة",
        seconds: "ثانية",
        days: "أيام",
        locationFound: "تم تحديد الموقع",
        locationDefault: "إسطنبول (افتراضي)",
        ramadanStart: "بداية رمضان 2026",
        imsakLeft: "الوقت المتبقي للإمساك",
        iftarLeft: "الوقت المتبقي للإفطار",
        tomorrowImsak: "الوقت المتبقي لإمساك الغد",
        todayPrayers: "أوقات الصلاة اليوم",
        // Zikirmatik translation
        dhikrTitle: "أذكاري اليومية",
        dhikrLabel: "ذكر",
        historyTitle: "سجل الذكر",
        historyEmpty: "لا توجد سجلات بعد.",
        resetBtn: "إعادة تعيين",
        vibrateBtn: "اهتزاز",
        dhikrOptions: {
            custom: "ذكر حر",
            subhanallah: "سبحان الله (٣٣)",
            elhamdulillah: "الحمد لله (٣٣)",
            allahuekber: "الله أكبر (٣٣)",
            lailaheillallah: "لا إله إلا الله (٩٩)"
        },
        prayers: {
            Imsak: "الفجر (الإمساك)",
            Sunrise: "الشروق",
            Dhuhr: "الظهر",
            Asr: "العصر",
            Maghrib: "المغرب (الإفطار)",
            Isha: "العشاء"
        }
    },
    id: {
        title: "Selamat Datang Ramadan 2026",
        prayersTitle: "Doa-doa",
        nextEventLabel: "18 Februari 2026 - Waktu Berikutnya",
        loading: "Memuat...",
        hours: "Jam",
        minutes: "Menit",
        seconds: "Detik",
        days: "HARI",
        locationFound: "Lokasi Terdeteksi",
        locationDefault: "Istanbul (Default)",
        ramadanStart: "Awal Ramadan 2026",
        imsakLeft: "Waktu hingga Imsak",
        iftarLeft: "Waktu hingga Buka Puasa",
        tomorrowImsak: "Waktu hingga Imsak Besok",
        todayPrayers: "Jadwal Sholat Hari Ini",
        dhikrTitle: "Dzikir Harian Saya",
        dhikrLabel: "Dzikir",
        historyTitle: "Riwayat Dzikir",
        historyEmpty: "Belum ada catatan.",
        resetBtn: "RESET",
        vibrateBtn: "GETAR",
        dhikrOptions: {
            custom: "Dzikir Bebas",
            subhanallah: "Subhanallah (33)",
            elhamdulillah: "Alhamdulillah (33)",
            allahuekber: "Allahu Akbar (33)",
            lailaheillallah: "La Ilaha Illallah (99)"
        },
        prayers: {
            Imsak: "Imsak",
            Sunrise: "Terbit",
            Dhuhr: "Dzuhur",
            Asr: "Ashar",
            Maghrib: "Maghrib",
            Isha: "Isya"
        }
    },
    ur: {
        title: "خوش آمدید رمضان 2026",
        prayersTitle: "دعائیں",
        nextEventLabel: "18 فروری 2026 - اگلی نماز",
        loading: "لوڈ ہو رہا ہے...",
        hours: "گھنٹے",
        minutes: "منٹ",
        seconds: "سیکنڈ",
        days: "دن",
        locationFound: "مقام کا تعین ہو گیا",
        locationDefault: "استنبول (طے شدہ)",
        ramadanStart: "رمضان 2026 کا آغاز",
        imsakLeft: "سحری کا وقت باقی ہے",
        iftarLeft: "افطار کا وقت باقی ہے",
        tomorrowImsak: "کل کی سحری کا وقت باقی ہے",
        todayPrayers: "آج کے نماز کے اوقات",
        dhikrTitle: "میرے روزانہ کے اذکار",
        dhikrLabel: "ذکر",
        historyTitle: "ذکر کی تاریخ",
        historyEmpty: "ابھی تک کوئی ریکارڈ نہیں ہے۔",
        resetBtn: "ری سیٹ",
        vibrateBtn: "تھر تھراہٹ",
        dhikrOptions: {
            custom: "مفت ذکر",
            subhanallah: "سبحان اللہ (33)",
            elhamdulillah: "الحمد للہ (33)",
            allahuekber: "اللہ اکبر (33)",
            lailaheillallah: "لا الہ الا اللہ (99)"
        },
        prayers: {
            Imsak: "فجر (امساک)",
            Sunrise: "طلوع آفتاب",
            Dhuhr: "ظہر",
            Asr: "عصر",
            Maghrib: "مغرب (افطار)",
            Isha: "عشاء"
        }
    },
    fr: {
        title: "Bienvenue Ramadan 2026",
        menuTitle: "Menu",
        prayersTitle: "Prières",
        nextEventLabel: "18 Fév 2026 - Prochaine Prière",
        loading: "Chargement...",
        hours: "Heures",
        minutes: "Minutes",
        seconds: "Secondes",
        days: "JOURS",
        locationFound: "Localisation Détectée",
        locationDefault: "Istanbul (Défaut)",
        ramadanStart: "Début du Ramadan 2026",
        imsakLeft: "Temps avant Imsak",
        iftarLeft: "Temps avant Iftar",
        tomorrowImsak: "Temps avant l'Imsak de demain",
        todayPrayers: "Prières d'aujourd'hui",
        dhikrTitle: "Mon Dhikr Quotidien",
        dhikrLabel: "Dhikr",
        historyTitle: "Historique du Dhikr",
        historyEmpty: "Aucun enregistrement.",
        resetBtn: "RÉINITIALISER",
        vibrateBtn: "VIBRER",
        dhikrOptions: {
            custom: "Dhikr Libre",
            subhanallah: "Subhanallah (33)",
            elhamdulillah: "Alhamdulillah (33)",
            allahuekber: "Allahu Akbar (33)",
            lailaheillallah: "La Ilaha Illallah (99)"
        },
        prayers: {
            Imsak: "Imsak",
            Sunrise: "Lever",
            Dhuhr: "Dhuhr",
            Asr: "Asr",
            Maghrib: "Maghrib",
            Isha: "Isha"
        }
    }
};

let currentLang = 'tr';
let countdownInterval;

const elements = {
    cityName: document.getElementById('city-name'),
    nextEventName: document.getElementById('next-event-name'),
    nextEventLabel: document.getElementById('next-event-label'),
    appTitle: document.getElementById('app-title'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    currentDate: document.getElementById('current-date'),
    languageSelector: document.getElementById('language-selector'),
    todayPrayersTitle: document.querySelector('.prayer-times-list h3'),
    // Zikirmatik Elements
    dhikrTitle: document.querySelector('.dhikr-header h3'),
    dhikrLabel: document.querySelector('.dhikr-label'),
    resetBtn: document.getElementById('reset-btn'),
    vibrateBtn: document.getElementById('vibrate-btn'),
    dhikrSelector: document.getElementById('dhikr-selector'),

    prayerRows: {
        Imsak: document.getElementById('imsak-row'),
        Sunrise: document.getElementById('gunes-row'),
        Dhuhr: document.getElementById('ogle-row'),
        Asr: document.getElementById('ikindi-row'),
        Maghrib: document.getElementById('aksam-row'),
        Isha: document.getElementById('yatsi-row')
    },
    prayerTimes: {
        Imsak: document.getElementById('imsak-time'),
        Sunrise: document.getElementById('gunes-time'),
        Dhuhr: document.getElementById('ogle-time'),
        Asr: document.getElementById('ikindi-time'),
        Maghrib: document.getElementById('aksam-time'),
        Isha: document.getElementById('yatsi-time')
    }
};

// ... (existing code)

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update Static Text
    elements.appTitle.textContent = t.title;
    elements.nextEventLabel.textContent = t.nextEventLabel;
    elements.todayPrayersTitle.textContent = t.todayPrayers;

    // Update Zikirmatik Text
    if (elements.dhikrTitle) elements.dhikrTitle.textContent = t.dhikrTitle;
    if (elements.dhikrLabel) elements.dhikrLabel.textContent = t.dhikrLabel;

    // Update History Modal Title
    const historyTitle = document.getElementById('history-modal-title');
    if (historyTitle && t.historyTitle) {
        historyTitle.textContent = t.historyTitle;
    }

    // Update Control Buttons (Text + Title)
    if (elements.resetBtn) {
        elements.resetBtn.setAttribute('title', t.resetBtn);
        const txt = elements.resetBtn.querySelector('.btn-text');
        if (txt) txt.textContent = t.resetBtn;
    }
    if (elements.vibrateBtn) {
        elements.vibrateBtn.setAttribute('title', t.vibrateBtn);
        const txt = elements.vibrateBtn.querySelector('.btn-text');
        if (txt) txt.textContent = t.vibrateBtn;
    }

    // Update Selector Options
    if (elements.dhikrSelector) {
        const options = elements.dhikrSelector.options;
        for (let i = 0; i < options.length; i++) {
            const key = options[i].value;
            if (t.dhikrOptions[key]) {
                options[i].text = t.dhikrOptions[key];
            }
        }
    }

    // Update Prayer Names
    document.querySelector('#imsak-row .prayer-name').textContent = t.prayers.Imsak;
    document.querySelector('#gunes-row .prayer-name').textContent = t.prayers.Sunrise;
    document.querySelector('#ogle-row .prayer-name').textContent = t.prayers.Dhuhr;
    document.querySelector('#ikindi-row .prayer-name').textContent = t.prayers.Asr;
    document.querySelector('#aksam-row .prayer-name').textContent = t.prayers.Maghrib;
    document.querySelector('#yatsi-row .prayer-name').textContent = t.prayers.Isha;

    // RTL Handling
    if (lang === 'ar' || lang === 'ur') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Update Prayers View Title (New)
    const prayersTitleLabel = document.getElementById('prayers-title-label');
    if (prayersTitleLabel && t.prayersTitle) {
        prayersTitleLabel.textContent = t.prayersTitle;
    }

    // Update Dynamic Text (Countdown labels, Date, etc.)
    updateDate();
    updateCountdown();
}

function updateDate() {
    const now = new Date();
    // Use locale based on selected language
    let locale = 'tr-TR';
    if (currentLang === 'en') locale = 'en-US';
    if (currentLang === 'ar') locale = 'ar-SA';
    if (currentLang === 'id') locale = 'id-ID';
    if (currentLang === 'ur') locale = 'ur-PK';
    if (currentLang === 'fr') locale = 'fr-FR';

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = now.toLocaleDateString(locale, options);
}

function getLocation() {
    const t = translations[currentLang];
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchPrayerTimes(latitude, longitude);
                elements.cityName.textContent = t.locationFound;
            },
            (error) => {
                console.error("Error getting location:", error);
                elements.cityName.textContent = t.locationDefault;
                fetchPrayerTimes(41.0082, 28.9784);
            }
        );
    } else {
        elements.cityName.textContent = t.locationDefault;
        // Default to Istanbul if no geolocation support or permission
        fetchPrayerTimes(41.0082, 28.9784);
    }
}

async function fetchPrayerTimes(lat, lng) {
    try {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${day}-${month}-${date.getFullYear()}`;
        const response = await fetch(`${API_URL}/${formattedDate}?latitude=${lat}&longitude=${lng}&method=13`); // Diyanet Method = 13
        const data = await response.json();

        if (data.code === 200) {
            prayerTimesData = data.data.timings;

            // CACHE THE DATA: Save to LocalStorage
            try {
                const cacheKey = `prayer_times_${formattedDate}`; // Uses same var from above
                localStorage.setItem(cacheKey, JSON.stringify(prayerTimesData));
            } catch (e) {
                console.warn("Storage warning", e);
            }

            updatePrayerTimesUI(prayerTimesData);
            startCountdown();
        } else {
            console.error('API Error:', data.status);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

function updatePrayerTimesUI(timings) {
    elements.prayerTimes.Imsak.textContent = timings.Imsak;
    elements.prayerTimes.Sunrise.textContent = timings.Sunrise;
    elements.prayerTimes.Dhuhr.textContent = timings.Dhuhr;
    elements.prayerTimes.Asr.textContent = timings.Asr;
    elements.prayerTimes.Maghrib.textContent = timings.Maghrib;
    elements.prayerTimes.Isha.textContent = timings.Isha;
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const t = translations[currentLang];
    const now = new Date();

    if (now < RAMADAN_START_DATE) {
        elements.nextEventName.textContent = t.ramadanStart;

        const diff = RAMADAN_START_DATE - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (elements.days) {
            elements.days.textContent = d.toString().padStart(2, '0');
            elements.days.nextElementSibling.textContent = t.days;
        }

        elements.hours.textContent = h.toString().padStart(2, '0');
        elements.hours.nextElementSibling.textContent = t.hours;

        elements.minutes.textContent = m.toString().padStart(2, '0');
        elements.minutes.nextElementSibling.textContent = t.minutes;

        elements.seconds.textContent = s.toString().padStart(2, '0');
        elements.seconds.nextElementSibling.textContent = t.seconds;
        return;
    }

    // Since we are likely testing for 2026, the above block runs.
    // If inside Ramadan (future logic), we would use prayerTimesData here.
    if (!prayerTimesData) return;
}

// --- INITIALIZATION WRAPPER ---
function init() {
    getLocation();
    updateDate();
    setInterval(updateDate, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
        initZikirmatik();
        renderPrayers();

        // Sidebar Logic
        const sidebar = document.getElementById('app-sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const menuToggleBtn = document.getElementById('menu-toggle');
        const menuCloseBtn = document.getElementById('menu-close');

        if (menuToggleBtn) menuToggleBtn.addEventListener('click', toggleSidebar);
        if (menuCloseBtn) menuCloseBtn.addEventListener('click', toggleSidebar);
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

        // Language Selector Listener
        const langSelect = document.getElementById('language-selector');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                setLanguage(e.target.value);
            });
        }
    } catch (e) {
        alert("Hata: " + e.message);
    }
});

// Sidebar Toggle Function (Global)
function toggleSidebar() {
    document.getElementById('app-sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function switchTab(tabId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
    });

    // Show selected view
    const selectedView = document.getElementById(`${tabId}-view`);
    if (selectedView) {
        selectedView.style.display = 'flex';
        setTimeout(() => selectedView.classList.add('active'), 10); // Fade in

        // Special reset for Prayers View to ensure Book is visible
        if (tabId === 'prayers') {
            const bookContainer = document.getElementById('prayers-book-container');
            const detailView = document.getElementById('prayer-detail-view');
            if (bookContainer) bookContainer.style.display = 'flex';
            if (detailView) detailView.style.display = 'none';
            renderPrayers(); // Ensure content is rendered
        }
    }

    // Toggle Header & Background Mode
    const header = document.querySelector('.app-header');

    // Reset classes
    document.body.classList.remove('dhikr-mode', 'prayers-mode');
    header.classList.remove('hidden');

    if (tabId === 'dhikr') {
        header.classList.add('hidden');
        document.body.classList.add('dhikr-mode');
    } else if (tabId === 'prayers') {
        header.classList.add('hidden');
        document.body.classList.add('prayers-mode');
    }

    // Update Sidebar Active State
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.sidebar-item')).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    // Close Sidebar on Selection (Robust)
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Always force close if active
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
}

// ZIKIRMATIK LOGIC
let dhikrCount = 0;
let dhikrHistory = {}; // Store daily history { "YYYY-MM-DD": count }
let isVibrateOn = true; // Default to true

function initZikirmatik() {
    const btn = document.getElementById('dhikr-btn');
    const resetBtn = document.getElementById('reset-dhikr-btn');
    const vibrateBtn = document.getElementById('vibrate-btn');
    const historyBtn = document.getElementById('history-btn');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const countDisplay = document.getElementById('dhikr-display') || document.getElementById('dhikr-count');

    // Load Session Count
    const savedCount = localStorage.getItem('dhikrCount');
    if (savedCount) {
        dhikrCount = parseInt(savedCount, 10);
        if (countDisplay) countDisplay.textContent = dhikrCount;
    }

    // Load History
    const savedHistory = localStorage.getItem('dhikrHistory');
    if (savedHistory) {
        try {
            dhikrHistory = JSON.parse(savedHistory);
        } catch (e) {
            console.error("History parse error", e);
            dhikrHistory = {};
        }
    }
    // Load Vibrate State
    if (localStorage.getItem('isVibrateOn')) {
        isVibrateOn = localStorage.getItem('isVibrateOn') === 'true';
        if (vibrateBtn) updateVibrateBtnUI();
    }

    // Event Listeners
    if (btn) btn.addEventListener('click', handleDhikrClick);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm(translations[currentLang].resetConfirm || "Sıfırlamak istediğinize emin misiniz?")) {
                dhikrCount = 0;
                if (countDisplay) countDisplay.textContent = dhikrCount;
                saveDhikrState();
            }
        });
    }

    // Vibrate Toggle
    if (vibrateBtn) {
        vibrateBtn.addEventListener('click', () => {
            isVibrateOn = !isVibrateOn;
            updateVibrateBtnUI();
            saveDhikrState();
        });
    }

    // History Modal Listeners
    if (historyBtn) historyBtn.addEventListener('click', openHistoryModal);
    if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeHistoryModal);

    // Close modal on outside click
    const historyOverlay = document.getElementById('history-modal-overlay');
    if (historyOverlay) historyOverlay.addEventListener('click', (e) => {
        if (e.target === historyOverlay) closeHistoryModal();
    });

    function updateVibrateBtnUI() {
        if (!vibrateBtn) return;
        if (isVibrateOn) {
            vibrateBtn.classList.add('active');
            vibrateBtn.innerHTML = '<span class="btn-icon">📳</span><span class="btn-text">TİTREŞİM</span>';
        } else {
            vibrateBtn.classList.remove('active');
            vibrateBtn.innerHTML = '<span class="btn-icon">📴</span><span class="btn-text">TİTREŞİM</span>';
        }
    }

    function saveDhikrState() {
        localStorage.setItem('dhikrCount', dhikrCount);
        localStorage.setItem('isVibrateOn', isVibrateOn);
    }
}

// Helper Functions (Must be defined!)
function handleDhikrClick() {
    dhikrCount++;
    const display = document.getElementById('dhikr-display') || document.getElementById('dhikr-count');
    if (display) display.textContent = dhikrCount;

    // Save
    localStorage.setItem('dhikrCount', dhikrCount);

    // History
    addToHistory(1);

    // Vibrate (Robust)
    if (localStorage.getItem('isVibrateOn') === 'true') {
        try {
            if (navigator.vibrate) {
                navigator.vibrate(100); // Increased duration
            } else {
                console.log('Vibration API not supported');
            }
        } catch (e) {
            console.warn('Vibration failed', e);
        }
    }

    // Animation
    const btn = document.getElementById('dhikr-btn');
    if (btn) {
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 100);
    }
}

function addToHistory(amount) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (!dhikrHistory[today]) {
        dhikrHistory[today] = 0;
    }
    dhikrHistory[today] += amount;
    localStorage.setItem('dhikrHistory', JSON.stringify(dhikrHistory));
}

function openHistoryModal() {
    renderHistoryList();
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeHistoryModal() {
    const overlay = document.getElementById('history-modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

function renderHistoryList() {
    const listContainer = document.getElementById('history-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    const sortedDates = Object.keys(dhikrHistory).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        const emptyMsg = translations[currentLang].historyEmpty || "Henüz kayıt yok.";
        listContainer.innerHTML = `<li class="empty-msg">${emptyMsg}</li>`;
        return;
    }

    sortedDates.forEach(date => {
        const count = dhikrHistory[date];
        const li = document.createElement('li');
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('tr-TR');

        li.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-count">${count}</span>
        `;
        listContainer.appendChild(li);
    });
}

// --- PRAYERS (DUALAR) LOGIC ---
const prayersData = [
    {
        id: "fatiha",
        title: "Fatiha Suresi",
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ<br>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ<br>الرَّحْمَٰنِ الرَّحِيمِ<br>مَالِكِ يَوْمِ الدِّينِ<br>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ<br>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ<br>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        reading: "Bismillâhirrahmânirrahîm. Elhamdülillâhi rabbil'alemin. Errahmânir'rahîm. Mâliki yevmiddîn. İyyâke na'budü ve iyyâke neste'în. İhdinessırâtel müstakîm. Sırâtellezîne en'amte aleyhim ğayrilmağdûbi aleyhim ve leddâllîn.",
        meaning: "Rahmân ve Rahîm olan Allah'ın adıyla. Hamd (övme ve övülme), âlemlerin Rabbi Allah'a mahsustur. O, Rahmân'dır ve Rahîm'dir. Ceza gününün mâlikidir. (Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden medet umarız. Bize doğru yolu göster. Kendilerine lütuf ve ikramda bulunduğun kimselerin yolunu; gazaba uğramışların ve sapmışların yolunu değil!"
    },
    {
        id: "ayetel_kursi",
        title: "Ayetel Kürsi",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        reading: "Allahü lâ ilâhe illâ hüvel hayyül kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti vemâ fil erd. Menzellezî yeşfeu indehû illâ biiznih. Ya'lemü mâ beyne eydîhim vemâ halfehüm velâ yühîtûne bişey'in min ilmihî illâ bimâ şâ'. Vesia kürsiyyühüssemâvâti vel erd. Velâ yeûdühû hıfzuhumâ ve hüvel aliyyül azîm.",
        meaning: "Allah, O'ndan başka ilah yoktur; O, hayydır (diridir), kayyumdur. O'nu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki her şey, yerdeki her şey O'nundur. İzni olmaksızın O'nun katında şefaatte bulunacak kimdir? O, kulların önlerindekileri ve arkalarındakileri (yaptıklarını ve yapacaklarını) bilir. Onlar O'nun ilminden, kendisinin dilediği kadarından başka bir şey kavrayamazlar. O'nun kürsüsü bütün gökleri ve yeri kaplayıp kuşatmıştır. (O, göklere, yere, bütün evrene hükmetmektedir.) Gökleri ve yeri koruyup gözetmek O'na güç gelmez. O, yücedir, büyüktür."
    },
    {
        id: "ihlas",
        title: "İhlas Suresi",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ<br>اللَّهُ الصَّمَدُ<br>لَمْ يَلِدْ وَلَمْ يُولَدْ<br>وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        reading: "Bismillâhirrahmânirrahîm. Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
        meaning: "De ki: O Allah birdir. Allah sameddir. (Her şey O'na muhtaçtır; O, hiçbir şeye muhtaç değildir.) O doğurmamış ve doğmamıştır. O'nun hiçbir dengi yoktur."
    },
    {
        id: "felak",
        title: "Felak Suresi",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ<br>مِنْ شَرِّ مَا خَلَقَ<br>وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ<br>وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ<br>وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        reading: "Bismillâhirrahmânirrahîm. Kul e'ûzü birabbil felak. Min şerri mâ halak. Ve min şerri ğasikın izâ vekab. Ve min şerrinneffâsâti fil ukad. Ve min şerri hâsidin izâ hased.",
        meaning: "De ki: Yarattığı şeylerin kötülüğünden, karanlığı çöktüğü zaman gecenin kötülüğünden, düğümlere üfleyenlerin kötülüğünden, haset ettiği zaman hasetçinin kötülüğünden, sabah aydınlığının Rabbine sığınırım."
    },
    {
        id: "nas",
        title: "Nas Suresi",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ<br>مَلِكِ النَّاسِ<br>إِلَٰهِ النَّاسِ<br>مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ<br>الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ<br>مِنَ الْجِنَّةِ وَالنَّاسِ",
        reading: "Bismillâhirrahmânirrahîm. Kul e'ûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti ven nâs.",
        meaning: "De ki: Sinsice vesvese veren, (Allah anıldığında) sinip kaybolan cin ve insan şeytanlarının şerrinden; insanların kalplerine vesvese veren o sinsi vesvesecinin şerrinden insanların Rabbine, insanların Melikine, insanların İlahına sığınırım."
    },
    {
        id: "nazar",
        title: "Nazar Duası (Kalem 51-52)",
        arabic: "وَإِن يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُولُونَ إِنَّهُ لَمَجْنُونٌ<br>وَمَا هُوَ إِلَّا ذِكْرٌ لِّلْعَالَمِينَ",
        reading: "Ve in yekâdüllezîne keferû leyüzlikûneke biebsârihim lemmâ semiûz zikra ve yekûlûne innehû lemecnûn. Ve mâ hüve illâ zikrun lil âlemîn.",
        meaning: "O inkâr edenler Zikr'i (Kur'an'ı) işittikleri zaman, seni neredeyse gözleriyle devireceklerdi. 'O, gerçekten bir delidir' diyorlar. Oysa o (Kur'an), âlemlerin için ancak bir öğüttür."
    },
    {
        id: "yemek",
        title: "Yemek Duası (Bereket)",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        reading: "Elhamdülillâhillezî et'amenâ ve sekânâ ve cealenâ müslimîn.",
        meaning: "Bizi yediren, içiren ve bizi Müslümanlardan kılan Allah'a hamdolsun."
    },
    {
        id: "rabbena",
        title: "Rabbena Duaları",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ<br><br>رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        reading: "<strong>Rabbena Atina:</strong><br>Rabbenâ âtinâ fiddünyâ haseneten ve fil âhireti haseneten ve kınâ azâbennâr.<br><br><strong>Rabbenağfirli:</strong><br>Rabbenâğfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül hisâb.",
        meaning: "<strong>Rabbena Atina:</strong><br>Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.<br><br><strong>Rabbenağfirli:</strong><br>Rabbimiz! Beni, anamı-babamı ve bütün mü'minleri hesap gününde (herkesin sorguya çekileceği günde) bağışla."
    },
];

function renderPrayers() {
    const leftPage = document.getElementById('book-page-left');
    const rightPage = document.getElementById('book-page-right');

    // Check if new containers exist, if not, wait or return (safety)
    if (!leftPage || !rightPage) return;

    leftPage.innerHTML = '';
    rightPage.innerHTML = '';

    // Split data into two columns
    const midPoint = Math.ceil(prayersData.length / 2);

    prayersData.forEach((dua, index) => {
        const item = document.createElement('div');
        item.className = 'prayer-book-item';
        item.onclick = () => displayPrayer(dua.id);
        item.innerHTML = `
            <span class="book-item-title" style="display: flex; align-items: center;">
                <span style="font-family: Arial, sans-serif; font-size: 2rem; color: #d4af37; margin-right: 12px; line-height: 0.7;">•</span>
                ${dua.title}
            </span>
        `;

        if (index < midPoint) {
            leftPage.appendChild(item);
        } else {
            rightPage.appendChild(item);
        }
    });
}

function displayPrayer(id) {
    const bookContainer = document.getElementById('prayers-book-container');
    const detailView = document.getElementById('prayer-detail-view');
    const displayArea = document.getElementById('prayer-content-full');
    const dua = prayersData.find(p => p.id === id);

    if (!dua || !displayArea) return;

    // Toggle Views
    bookContainer.style.display = 'none';
    detailView.style.display = 'flex'; // Full screen flex

    // Animate fade in
    setTimeout(() => {
        detailView.classList.add('active');
    }, 10);

    // Render Content
    const readingLabel = currentLang === 'tr' ? 'Okunuşu:' : 'Reading:';
    const meaningLabel = currentLang === 'tr' ? 'Anlamı:' : 'Meaning:';

    displayArea.innerHTML = `
        <div class="prayer-page-header fade-appear">
            <h2 class="page-title">${dua.title}</h2>
            <div class="ornament"></div>
        </div>
        <div class="prayer-body fade-appear" style="animation-delay: 0.1s">
            <p class="arabic-text large">${dua.arabic}</p>
            
            <div class="section-divider">
                <span>${readingLabel}</span>
            </div>
            <p class="reading-text">${dua.reading}</p>
            
            <div class="section-divider">
                <span>${meaningLabel}</span>
            </div>
            <p class="meaning-text">${dua.meaning}</p>
        </div>
    `;

    // Scroll to top
    displayArea.scrollTop = 0;
}

function closePrayerDetail() {
    const bookContainer = document.getElementById('prayers-book-container');
    const detailView = document.getElementById('prayer-detail-view');

    if (detailView) {
        detailView.classList.remove('active');
        setTimeout(() => {
            detailView.style.display = 'none';
            if (bookContainer) bookContainer.style.display = 'flex';
        }, 300); // Wait for transition
    }
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    // ... Existing logic ...
    renderPrayers();
});
