console.log('App.js loaded');
const API_URL = 'https://api.aladhan.com/v1/timings';
// Default Coordinates (Istanbul)
let currentUserLat = 41.0082;
let currentUserLng = 28.9784;
const RAMADAN_START_DATE = new Date('2025-12-16T00:00:00'); // TEST MODE: Starts Today!
let prayerTimesData = null; // Global variable to store fetched data

// TEST MODE: Enable Adhan Outside Ramadan (for testing Dec 18)
const TEST_MODE_ADHAN = true; // Set to false after testing
let prayerAlertsShown = {}; // Track which prayers have triggered today

// MOBILE AUDIO FIX: Track if user has enabled audio
let audioEnabled = localStorage.getItem('audioEnabled') === 'true';

// Show/hide audio enable banner based on permission status
function checkAudioPermission() {
    const banner = document.getElementById('audio-enable-banner');
    if (!banner) return;

    if (audioEnabled) {
        banner.style.display = 'none';
        console.log('✅ Audio already enabled by user');
    } else {
        banner.style.display = 'flex';
        console.log('⚠️ Audio not enabled - showing banner');
    }
}

// Called when user clicks "Enable Audio" button
function enableAudioOnUserInteraction() {
    console.log('🔊 User clicked Enable Audio...');

    const audio = document.getElementById('adhan-audio');
    const banner = document.getElementById('audio-enable-banner');

    if (audio) {
        // Play briefly to unlock audio on mobile
        audio.volume = 0.5;
        audio.currentTime = 0;

        audio.play().then(() => {
            console.log('✅ Audio permission granted!');

            // Stop after 0.5 seconds (just enough to unlock)
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1.0;
            }, 500);

            // Save permission
            audioEnabled = true;
            localStorage.setItem('audioEnabled', 'true');

            // Hide banner
            if (banner) {
                banner.style.display = 'none';
            }

            // Show success feedback
            alert('✅ Ezan sesi etkinleştirildi!\n\nNamaz vaktinde ezan otomatik çalacak.');

        }).catch(e => {
            console.error('❌ Audio enable failed:', e);
            alert('❌ Ses etkinleştirilemedi. Lütfen tekrar deneyin.');
        });
    }
}

// GLOBAL BLOCK: Disable Right-Click immediately (Capture Phase)
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, true); // true = capture phase

const translations = {
    tr: {
        title: "HOŞGELDİN RAMAZAN 2026",
        menuTitle: "Menü",
        menuHome: "Ana Sayfa",
        menuPrayers: "Dualar",
        menuDhikr: "Zikirmatik",
        prayersTitle: "Dualar",
        nextEventLabel: "18 Şubat 2026 - Ramazan Başlangıcına Kalan Süre",
        loading: "Yükleniyor...",
        hours: "Saat",
        minutes: "Dakika",
        seconds: "Saniye",
        days: "Gün",
        locationFound: "Konum Algılandı",
        locationDefault: "İstanbul (Varsayılan)",
        ramadanStart: "Ramazan 2026 Başlangıcı",
        imsakLeft: "İmsak'a Kalan Süre",
        iftarLeft: "İftar'a Kalan Süre",
        tomorrowImsak: "Yarınki İmsak'a Kalan Süre",
        todayPrayers: "Bugünün Vakitleri",
        dhikrTitle: "Günlük Zikirlerim",
        dhikrLabel: "Zikir",
        historyTitle: "Zikir Geçmişi",
        historyEmpty: "Henüz kayıt yok.",
        resetBtn: "Sıfırla",
        vibrateBtn: "Titreşim",
        historyBtn: "Geçmiş",
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
        },
        menuQibla: "Kıble",
        qiblaTitle: "Kıble Bulucu",
        qiblaStatus: "Cihazı düz tutun ve kalibre edin.",
        qiblaInstructions: "Cihazınızı 8 şeklinde hareket ettirerek kalibre edin. Kırmızı ibre Kuzeyi, Kabe simgesi Kıble yönünü gösterir.",
        qiblaAltText: "--- veya ---",
        googleQiblaBtn: "Haritada Göster (Google)",
        startCompass: "Pusulayı Başlat",
        imsakiyeBtn: "2026 Ramazan İmsakiyesi",
        daySuffix: ".gün",
        imsakiyeTitle: "Ramazan 2026 İmsakiyesi",
        imsakiyeHeaders: ["Trh", "İms", "Gün", "Öğl", "İkn", "İft", "Yat"],
        monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        daysShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]
    },
    en: {
        title: "Welcome Ramadan 2026",
        menuTitle: "Menu",
        menuHome: "Home",
        menuPrayers: "Prayers",
        menuDhikr: "Tasbih",
        prayersTitle: "Prayers",
        nextEventLabel: "Feb 18, 2026 - Next Prayer",
        loading: "Loading...",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        days: "Days",
        locationFound: "Location Detected",
        locationDefault: "Istanbul (Default)",
        ramadanStart: "Ramadan 2026 Start",
        imsakLeft: "Time until Imsak",
        iftarLeft: "Time until Iftar",
        tomorrowImsak: "Time until Tomorrow's Imsak",
        todayPrayers: "Today's Prayers",
        dhikrTitle: "My Daily Dhikr",
        dhikrLabel: "Dhikr",
        historyTitle: "Dhikr History",
        historyEmpty: "No records yet.",
        resetBtn: "Reset",
        vibrateBtn: "Vibrate",
        historyBtn: "History",
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
        },
        menuQibla: "Qibla",
        qiblaTitle: "Qibla Finder",
        qiblaStatus: "Keep device flat and calibrate.",
        qiblaInstructions: "Calibrate by moving your device in a figure 8 motion. The red needle points North, the Kaaba icon points to Qibla.",
        qiblaAltText: "--- or ---",
        googleQiblaBtn: "Show on Map (Google)",
        startCompass: "Start Compass",
        imsakiyeBtn: "2026 Ramadan Calendar",
        imsakiyeTitle: "Ramadan 2026 Calendar",
        imsakiyeHeaders: ["Date", "Fajr", "Sun", "Dhu", "Asr", "Mag", "Ish"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daySuffix: ". day"
    },
    ar: {
        menuTitle: "القائمة",
        menuHome: "الرئيسية",
        menuPrayers: "أدعية",
        menuDhikr: "السبحة",
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
        dhikrTitle: "أذكاري اليومية",
        dhikrLabel: "ذكر",
        historyTitle: "سجل الذكر",
        historyEmpty: "لا توجد سجلات بعد.",
        resetBtn: "إعادة تعيين",
        resetBtn: "إعادة تعيين",
        vibrateBtn: "اهتزاز",
        historyBtn: "السجل",
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
        },
        menuQibla: "القبلة",
        qiblaTitle: "اتجاه القبلة",
        qiblaStatus: "حافظ على وضع الجهاز مسطحًا وقم بالمعايرة.",
        qiblaInstructions: "قم بمعايرة جهازك بتحريكه على شكل رقم 8. الإبرة الحمراء تشير إلى الشمال، ورمز الكعبة يشير إلى القبلة.",
        qiblaAltText: "--- أو ---",
        googleQiblaBtn: "إظهار على الخريطة (Google)",
        startCompass: "بدء البوصلة",
        imsakiyeBtn: "إمساكية رمضان ٢٠٢٦",
        daySuffix: ". يوم",
        imsakiyeTitle: "إمساكية رمضان ٢٠٢٦",
        imsakiyeHeaders: ["تاريخ", "فجر", "شروق", "ظهر", "عصر", "مغرب", "عشاء"],
        monthsShort: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        daysShort: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
    },
    id: {
        title: "Selamat Datang Ramadan 2026",
        menuTitle: "Menu",
        menuHome: "Beranda",
        menuPrayers: "Doa-doa",
        menuDhikr: "Dzikir",
        menuQibla: "Kiblat",
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
        resetBtn: "RESET",
        vibrateBtn: "GETAR",
        historyBtn: "RIWAYAT",
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
        },
        qiblaTitle: "Pencari Kiblat",
        qiblaStatus: "Jaga perangkat tetap datar.",
        qiblaInstructions: "Kalibrasi dengan menggerakkan perangkat Anda membentuk angka 8. Jarum merah menunjuk ke Utara, ikon Ka'bah menunjuk ke Kiblat.",
        qiblaAltText: "--- atau ---",
        googleQiblaBtn: "Tampilkan di Peta (Google)",
        startCompass: "MULAI KOMPAS",
        imsakiyeBtn: "JADWAL IMSAKIYAH 2026",
        daySuffix: ". hari",
        imsakiyeTitle: "Jadwal Imsakiyah 2026",
        imsakiyeHeaders: ["Tgl", "Ims", "Trb", "Dzh", "Ash", "Mag", "Isy"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        daysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    },
    ur: {
        title: "خوش آمدید رمضان 2026",
        menuTitle: "مینو",
        menuHome: "ہوم",
        menuPrayers: "دعائیں",
        menuDhikr: "تسبیح",
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
        resetBtn: "ری سیٹ",
        vibrateBtn: "تھر تھراہٹ",
        historyBtn: "تاریخ",
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
        },
        menuQibla: "قبلہ",
        qiblaTitle: "قبلہ رخ",
        qiblaStatus: "ڈیوائس کو ہموار رکھیں",
        qiblaInstructions: "اپنے آلے کو 8 کی شکل میں گھما کر کیلیبریٹ کریں۔ سرخ سوئی شمال کی طرف اشارہ کرتی ہے، کعبہ کا نشان قبلہ کی طرف۔",
        qiblaAltText: "--- یا ---",
        googleQiblaBtn: "نقشے پر دکھائیں (Google)",
        startCompass: "کمپاس شروع کریں",
        imsakiyeBtn: "رمضان 2026 کیلنڈر",
        daySuffix: ". دن",
        imsakiyeTitle: "رمضان 2026 کیلنڈر",
        imsakiyeHeaders: ["تاریخ", "فجر", "طلوع", "ظہر", "عصر", "مغرب", "عشاء"],
        monthsShort: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"],
        daysShort: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"]
    },
    fr: {
        title: "Bienvenue Ramadan 2026",
        menuTitle: "Menu",
        menuHome: "Accueil",
        menuPrayers: "Prières",
        menuDhikr: "Dhikr/Tasbih",
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
        resetBtn: "RÉINITIALISER",
        vibrateBtn: "VIBRER",
        historyBtn: "HISTORIQUE",
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
        },
        menuQibla: "Qibla",
        qiblaTitle: "Boussole Qibla",
        qiblaStatus: "Gardez l'appareil à plat.",
        qiblaInstructions: "Calibrez en déplaçant votre appareil en forme de 8. L'aiguille rouge indique le Nord, l'icône de la Kaaba indique la Qibla.",
        qiblaAltText: "--- ou ---",
        googleQiblaBtn: "Afficher sur la carte (Google)",
        startCompass: "DÉMARRER LA BOUSSOLE",
        imsakiyeBtn: "CALENDRIER RAMADAN 2026",
        daySuffix: ". jour",
        imsakiyeTitle: "Calendrier Ramadan 2026",
        imsakiyeHeaders: ["Date", "Fajr", "Lev", "Dhu", "Asr", "Mag", "Ish"],
        monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
        daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
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
    resetBtn: document.getElementById('reset-dhikr-btn'), // FIX: Updated ID from reset-btn to reset-dhikr-btn
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
    document.documentElement.lang = lang; // Fix: Update HTML lang for correct capitalization (i vs İ)
    const t = translations[lang];

    // Update Static Text
    elements.appTitle.textContent = t.title;
    elements.nextEventLabel.textContent = t.nextEventLabel;
    elements.todayPrayersTitle.textContent = t.todayPrayers;

    // Update Zikirmatik Text
    if (elements.dhikrTitle) elements.dhikrTitle.textContent = t.dhikrTitle;
    if (elements.dhikrLabel) elements.dhikrLabel.textContent = t.dhikrLabel;

    // Update Sidebar Menu Text (Added 2025-12-15)
    document.getElementById('menu-sidebar-title').textContent = t.menuTitle || "Menu";
    document.getElementById('menu-home-text').textContent = t.menuHome || "Home";
    document.getElementById('menu-prayers-text').textContent = t.menuPrayers || "Prayers";
    document.getElementById('menu-prayers-text').textContent = t.menuPrayers || "Prayers";
    document.getElementById('menu-dhikr-text').textContent = t.menuDhikr || "Dhikr";
    const menuQibla = document.getElementById('menu-qibla-text');
    if (menuQibla) menuQibla.textContent = t.menuQibla || "Qibla";

    // Update Qibla View
    const qiblaTitle = document.getElementById('qibla-title');
    const qiblaStatus = document.getElementById('qibla-status');
    const startCompassBtn = document.getElementById('start-compass-btn');
    if (qiblaTitle) qiblaTitle.textContent = t.qiblaTitle || "Qibla Finder";
    if (qiblaStatus) qiblaStatus.textContent = t.qiblaStatus || "Status";
    if (startCompassBtn) startCompassBtn.textContent = t.startCompass || "START";

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

    // Update History Button (New)
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn && t.historyBtn) {
        historyBtn.setAttribute('title', t.historyBtn);
        const txt = historyBtn.querySelector('.btn-text');
        if (txt) txt.textContent = t.historyBtn;
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

    // Update Imsakiye Button (New)
    const imsakiyeBtnEl = document.getElementById('imsakiye-btn');
    if (imsakiyeBtnEl && t.imsakiyeBtn) {
        const txtSpan = imsakiyeBtnEl.querySelector('.text');
        if (txtSpan) txtSpan.textContent = t.imsakiyeBtn;
        else imsakiyeBtnEl.textContent = t.imsakiyeBtn;
    }

    // Update Imsakiye Modal Title & Headers
    const imsakiyeModalTitle = document.querySelector('#imsakiye-modal .modal-header h3');
    if (imsakiyeModalTitle && t.imsakiyeTitle) {
        imsakiyeModalTitle.textContent = t.imsakiyeTitle;
    }

    // Update Table Headers
    if (t.imsakiyeHeaders) {
        const ths = document.querySelectorAll('#imsakiye-table thead th');
        if (ths.length > 0) {
            t.imsakiyeHeaders.forEach((headerText, index) => {
                if (ths[index]) ths[index].textContent = headerText;
            });
        }
    }

    // Update Dynamic Text (Countdown labels, Date, etc.)
    updateDate();
    // Update Dynamic Text (Countdown labels, Date, etc.)
    updateDate();
    updateCountdown();

    // Sync Dropdown (if user changed it via code or stored pref)
    if (elements.languageSelector) {
        elements.languageSelector.value = lang;
    }

    // IMSAKIYE FIX: Clear table so it re-renders in new language
    const imsakiyeBody = document.getElementById('imsakiye-body');
    if (imsakiyeBody) imsakiyeBody.innerHTML = '';

    // If modal is open, refresh immediately
    const imsakiyeModal = document.getElementById('imsakiye-modal');
    if (imsakiyeModal && imsakiyeModal.classList.contains('active')) {
        fetchRamadanCalendar();
    }

    // Update Qibla Instructions
    const qiblaInstructionEl = document.getElementById('qibla-instructions');
    if (qiblaInstructionEl && t.qiblaInstructions) {
        qiblaInstructionEl.textContent = t.qiblaInstructions;
    }

    // Update Alt Text
    const qiblaAltText = document.getElementById('qibla-alt-text');
    if (qiblaAltText && t.qiblaAltText) {
        qiblaAltText.textContent = t.qiblaAltText;
    }

    // Update Google Qibla Button
    const googleQiblaBtn = document.getElementById('google-qibla-btn');
    if (googleQiblaBtn && t.googleQiblaBtn) {
        googleQiblaBtn.textContent = t.googleQiblaBtn;
    }
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
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Update Global Vars
                currentUserLat = latitude;
                currentUserLng = longitude;
                fetchPrayerTimes(latitude, longitude);
                elements.cityName.textContent = t.locationFound;
            },
            (error) => {
                console.error("Error getting location:", error);
                // Fallback to Istanbul
                currentUserLat = 41.0082;
                currentUserLng = 28.9784;
                elements.cityName.textContent = t.locationDefault;
                fetchPrayerTimes(currentUserLat, currentUserLng);
            },
            options
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
            throw new Error("API Error");
        }
    } catch (error) {
        console.error('Fetch Error, using Fallback Data:', error);
        // FALLBACK FOR TESTING (Ensure UI works even if API fails)
        prayerTimesData = {
            Imsak: "05:00",
            Sunrise: "06:30",
            Dhuhr: "13:00",
            Asr: "15:30",
            Maghrib: "19:30", // Ensure Iftar is in future (assuming testing in evening)
            Isha: "21:00"
        };
        updatePrayerTimesUI(prayerTimesData);
        startCountdown();
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

    // If inside Ramadan (or after start date)
    if (prayerTimesData) {
        // Parse Prayer Times for TODAY
        const imsakTime = parseTime(prayerTimesData.Imsak);
        const maghribTime = parseTime(prayerTimesData.Maghrib);

        let targetTime, labelText, eventName, isIftar = false;

        if (now < imsakTime) {
            // Case 1: Before Imsak (Sahur Time)
            targetTime = imsakTime;
            labelText = t.imsakLeft;
            eventName = t.prayers.Imsak;
        } else if (now < maghribTime) {
            // Case 2: Fasting Period (Counting to Iftar)
            targetTime = maghribTime;
            labelText = t.iftarLeft;
            eventName = t.prayers.Maghrib;
            isIftar = true; // Mark as Iftar countdown
        } else {
            // Case 3: After Iftar (Counting to Tomorrow's Imsak)

            // CHECK FOR IFTAR ALERT (Fix 2026)
            // Check if we are within 1 minute after Maghrib
            const timeSinceIftar = now - maghribTime;
            if (timeSinceIftar >= 0 && timeSinceIftar < 60000) { // 1 minute window
                triggerIftarAlert();
            }

            // Note: We are using Today's imsak + 24h as an approximation 
            // OR ideally fetching tomorrow's data, but for simplicity + 24h is usually close enough 
            // for the countdown until we fetch new data at midnight/refresh.
            // Better: Create tomorrow's imsak date object.
            targetTime = new Date(imsakTime);
            targetTime.setDate(targetTime.getDate() + 1);
            labelText = t.tomorrowImsak || t.imsakLeft;
            eventName = t.prayers.Imsak;
        }

        elements.nextEventLabel.textContent = labelText;
        elements.nextEventName.textContent = eventName;

        const diff = targetTime - now;

        // Render Countdown

        // Render Countdown
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // If > 24 hours (unlikely here but safety), add days to hours or show days
        // For purely Iftar/Sahur, days are usually 0.
        if (elements.days) {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            elements.days.textContent = d.toString().padStart(2, '0');
            if (elements.days.nextElementSibling) elements.days.nextElementSibling.textContent = t.days;
        }

        // Safety check for negative (passed) times
        if (diff < 0) {
            elements.hours.textContent = "00";
            elements.minutes.textContent = "00";
            elements.seconds.textContent = "00";
        } else {
            elements.hours.textContent = h.toString().padStart(2, '0');
            elements.hours.nextElementSibling.textContent = t.hours;

            elements.minutes.textContent = m.toString().padStart(2, '0');
            elements.minutes.nextElementSibling.textContent = t.minutes;

            elements.seconds.textContent = s.toString().padStart(2, '0');
            elements.seconds.nextElementSibling.textContent = t.seconds;
        }

        // TEST MODE: Check prayer times for adhan (Ikindi + Maghrib)
        if (TEST_MODE_ADHAN) {
            checkAllPrayerTimesForAdhan(now, prayerTimesData);
        }
    }
}

// ALERT LOGIC
let alertShown = false;
function triggerIftarAlert() {
    if (alertShown) return;
    alertShown = true;

    console.log('🌙 Triggering Iftar Alert!'); // Debug log

    // 1. Browser Notification
    if (Notification.permission === "granted") {
        new Notification("📢 İftar Vakti!", {
            body: "Allah kabul etsin. Hayırlı iftarlar!",
            icon: "icon-kabe-192.png",
            requireInteraction: true
        });
    }

    // 2. Play Adhan Audio
    const audio = document.getElementById('adhan-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.play().then(() => {
            console.log('✅ Iftar Adhan started playing');
        }).catch(e => {
            console.warn('⚠️ Iftar audio blocked:', e);
            window.pendingAdhanPlay = true;
        });
    }

    // 3. Vibrate
    try {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
    } catch (e) { }

    // Reset flag after 2 minutes so it doesn't loop
    setTimeout(() => { alertShown = false; }, 120000);
}

// TEST MODE: Check All Prayer Times (Öğle + Ikindi + Maghrib + Yatsı)
function checkAllPrayerTimesForAdhan(now, timings) {
    if (!timings) return;

    const prayers = [
        { name: 'Dhuhr', time: parseTime(timings.Dhuhr), label: '📢 ÖĞLE VAKTİ!', body: 'Allah kabul etsin.' },
        { name: 'Asr', time: parseTime(timings.Asr), label: '📢 İKİNDİ VAKTİ!', body: 'Allah kabul etsin.' },
        { name: 'Maghrib', time: parseTime(timings.Maghrib), label: '📢 İFTAR VAKTİ!', body: 'Allah orucunuzu kabul etsin.' },
        { name: 'Isha', time: parseTime(timings.Isha), label: '📢 YATSI VAKTİ!', body: 'Allah kabul etsin.' }
    ];

    // Debug: Log current time and prayer times every 30 seconds
    if (now.getSeconds() % 30 === 0) {
        console.log('⏰ Prayer Time Check:', {
            currentTime: now.toLocaleTimeString('tr-TR'),
            isha: timings.Isha,
            alertsShown: Object.keys(prayerAlertsShown)
        });
    }

    prayers.forEach(prayer => {
        const timeSince = now - prayer.time;
        const key = `${prayer.name}_${getTodayKey()}`;

        // Within 2 minutes after prayer time AND not shown today (increased window)
        if (timeSince >= 0 && timeSince < 120000 && !prayerAlertsShown[key]) {
            console.log('🕌 ADHAN TRIGGER:', prayer.name, 'at', now.toLocaleTimeString('tr-TR'));
            prayerAlertsShown[key] = true;
            playAdhanAlert(prayer.label, prayer.body);
        }
    });
}

function playAdhanAlert(title, body) {
    console.log('🔊 Playing Adhan Alert:', title); // Debug log

    // 1. Browser Notification
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: "icon-kabe-192.png",
            requireInteraction: true // Keep notification visible until user dismisses
        });
    } else if (Notification.permission !== "denied") {
        // Request permission if not yet asked
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, {
                    body: body,
                    icon: "icon-kabe-192.png"
                });
            }
        });
    }

    // 2. Play Adhan Audio with retry logic
    const audio = document.getElementById('adhan-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 1.0; // Full volume

        // Try to play with multiple attempts
        const attemptPlay = (attempt = 1) => {
            console.log(`🎵 Audio play attempt ${attempt}...`);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Adhan started playing successfully on attempt', attempt);
                }).catch(e => {
                    console.warn(`⚠️ Audio attempt ${attempt} failed:`, e.message);
                    if (attempt < 3) {
                        setTimeout(() => attemptPlay(attempt + 1), 500);
                    } else {
                        showVisualAdhanAlert(title);
                        window.pendingAdhanPlay = true;
                    }
                });
            }
        };
        attemptPlay();
    } else {
        console.error('❌ adhan-audio element not found!');
        showVisualAdhanAlert(title);
    }

    // 3. Vibrate
    try {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
    } catch (e) { }
}

// Visual notification when audio can't play
function showVisualAdhanAlert(title) {
    const existingAlert = document.getElementById('visual-adhan-alert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.id = 'visual-adhan-alert';
    alert.innerHTML = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;text-align:center;padding:20px;">
            <div style="font-size:60px;margin-bottom:20px;">🕌</div>
            <div style="font-size:28px;font-weight:bold;margin-bottom:15px;">${title}</div>
            <div style="font-size:18px;margin-bottom:30px;">Ezan vakti geldi!</div>
            <button onclick="testAdhanManual(); this.parentElement.parentElement.remove();" style="padding:15px 40px;font-size:18px;background:#d4af37;color:#000;border:none;border-radius:8px;cursor:pointer;">
                🔊 Ezanı Çal
            </button>
            <button onclick="this.parentElement.parentElement.remove();" style="margin-top:15px;padding:10px 30px;font-size:14px;background:transparent;color:#888;border:1px solid #888;border-radius:8px;cursor:pointer;">
                Kapat
            </button>
        </div>
    `;
    document.body.appendChild(alert);
}

// Manual test function
function testAdhanManual() {
    console.log('🧪 Manual Adhan Test triggered');
    const audio = document.getElementById('adhan-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.play().then(() => {
            console.log('✅ Manual adhan playing!');
        }).catch(e => {
            console.error('❌ Manual adhan failed:', e);
            alert('Ses çalınamadı. Lütfen sessize almayı kontrol edin.');
        });
    }
}

function getTodayKey() {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}


// Helper to parse "HH:mm" to Date object for today
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// --- INITIALIZATION WRAPPER ---
function init() {
    // Request Notification Permission
    if ('Notification' in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Check Audio Permission (Mobile Fix)
    checkAudioPermission();

    getLocation();
    updateDate();
    startCountdown(); // Start ticking immediately (handles loading/countdown logic)
    setInterval(updateDate, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
        initZikirmatik();
        initQibla(); // Moved here from redundant listener
        renderPrayers();

        // Qibla Button Listener (Robust Fix)
        const startCompassBtn = document.getElementById('start-compass-btn');
        if (startCompassBtn) {
            startCompassBtn.addEventListener('click', startCompass);
            console.log('Compass Button Listener Attached');
        }

        // Sidebar Logic
        const sidebar = document.getElementById('app-sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const menuToggleBtn = document.getElementById('menu-toggle');
        const menuCloseBtn = document.getElementById('menu-close');

        if (menuToggleBtn) {
            menuToggleBtn.addEventListener('click', toggleSidebar);
            console.log('Menu Toggle Listener Attached');
        } else {
            console.error('Menu Toggle Button NOT FOUND');
        }
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

// --- IMSAKIYE 2026 LOGIC ---
const IMSAKIYE_BTN = document.getElementById('imsakiye-btn');
const IMSAKIYE_MODAL = document.getElementById('imsakiye-modal');
const CLOSE_IMSAKIYE_BTN = document.getElementById('close-imsakiye-btn');

if (IMSAKIYE_BTN) IMSAKIYE_BTN.addEventListener('click', openImsakiyeModal);
if (CLOSE_IMSAKIYE_BTN) CLOSE_IMSAKIYE_BTN.addEventListener('click', closeImsakiyeModal);
if (IMSAKIYE_MODAL) IMSAKIYE_MODAL.addEventListener('click', (e) => {
    if (e.target === IMSAKIYE_MODAL) closeImsakiyeModal();
});

function openImsakiyeModal() {
    if (IMSAKIYE_MODAL) IMSAKIYE_MODAL.classList.add('active');
    fetchRamadanCalendar();
}

function closeImsakiyeModal() {
    if (IMSAKIYE_MODAL) IMSAKIYE_MODAL.classList.remove('active');
}

async function fetchRamadanCalendar() {
    const tableBody = document.getElementById('imsakiye-body');
    const loadingSpinner = document.getElementById('imsakiye-loading');

    if (!tableBody) return;

    // Check if already populated to avoid re-fetching
    if (tableBody.children.length > 0) return;

    if (loadingSpinner) loadingSpinner.style.display = 'block';

    try {
        // Fetch Feb 2026 and March 2026
        // Ramadan 2026 starts approx Feb 18 and ends March 19

        // Use cached global coordinates
        const lat = currentUserLat;
        const lng = currentUserLng;

        const [febData, marData] = await Promise.all([
            fetch(`https://api.aladhan.com/v1/calendar/2026/2?latitude=${lat}&longitude=${lng}&method=13`).then(res => res.json()),
            fetch(`https://api.aladhan.com/v1/calendar/2026/3?latitude=${lat}&longitude=${lng}&method=13`).then(res => res.json())
        ]);

        let combinedData = [];
        if (febData.code === 200) combinedData = combinedData.concat(febData.data);
        if (marData.code === 200) combinedData = combinedData.concat(marData.data);

        // Filter for Ramadan Range (approx Feb 18 - Mar 19)
        const startStr = '2026-02-18';
        const endStr = '2026-03-19';

        const ramadanData = combinedData.filter(item => {
            // Robust parsing: DD-MM-YYYY -> YYYY-MM-DD
            const [gDay, gMonth, gYear] = item.date.gregorian.date.split('-');
            const dateStr = `${gYear}-${gMonth}-${gDay}`;
            return dateStr >= startStr && dateStr <= endStr;
        });

        renderImsakiyeTable(ramadanData);

    } catch (error) {
        console.error("Calendar Fetch Error:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Liste yüklenemedi. İnternet bağlantınızı kontrol edin.</td></tr>`;
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

function renderImsakiyeTable(data) {
    const tableBody = document.getElementById('imsakiye-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const t = translations[currentLang];
    const days = t.daysShort || ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const months = t.monthsShort || ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    data.forEach((dayData, index) => {
        const timings = dayData.timings;
        // Parse Date
        const [gDay, gMonth, gYear] = dayData.date.gregorian.date.split('-');
        const dateObj = new Date(Number(gYear), Number(gMonth) - 1, Number(gDay)); // Month is 0-indexed

        const dayName = days[dateObj.getDay()];
        const monthName = months[dateObj.getMonth()];
        const formattedDate = `${Number(gDay)} ${monthName}`;

        const row = document.createElement('tr');

        // Compact Row Structure:
        // Col 1: Index + Date + Day
        // Using translations based on current language
        const suffix = translations[currentLang].daySuffix || ".gün";
        row.innerHTML = `
            <td class="date-cell">
                <div class="day-index">${index + 1}<span class="day-suffix">${suffix}</span></div>
                <div class="day-date">${formattedDate}</div>
                <div class="day-name">${dayName}</div>
            </td>
            <td class="time-cell imsak">${timings.Imsak.split(' ')[0]}</td>
            <td class="time-cell gunes">${timings.Sunrise.split(' ')[0]}</td>
            <td class="time-cell ogle">${timings.Dhuhr.split(' ')[0]}</td>
            <td class="time-cell ikindi">${timings.Asr.split(' ')[0]}</td>
            <td class="time-cell iftar">${timings.Maghrib.split(' ')[0]}</td>
            <td class="time-cell yatsi">${timings.Isha.split(' ')[0]}</td>
        `;

        tableBody.appendChild(row);
    });
}


// Sidebar Toggle Function (Global)
// Sidebar Toggle Function (Global)
function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Toggle menu button visibility to prevent overlap
    if (sidebar.classList.contains('active')) {
        if (menuToggle) menuToggle.style.display = 'none';
    } else {
        if (menuToggle) menuToggle.style.display = 'flex';
    }
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
    } else if (tabId === 'qibla') {
        header.classList.add('hidden');
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

    // Vibrate Toggle (REMOVED UI, but kept logic default ON)
    // if (vibrateBtn) { ... }

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
        const locale = currentLang === 'tr' ? 'tr-TR' : currentLang;
        const dateStr = dateObj.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

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
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",
        arabic: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ<br>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ<br>الرَّحْمَنِ الرَّحِيمِ<br>مَالِكِ يَوْمِ الدِّينِ<br>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ<br>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ<br>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ",
        reading: "Bismillahirrahmanirrahîm.<br>Elhamdü lillâhi rabbil'alemin.<br>Errahmânir'rahim.<br>Mâliki yevmid'din.<br>İyyâke na'budü ve iyyâke neste'în.<br>İhdinessırâtal müstakîm.<br>Sırâtallezine en'amte aleyhim ğayrilmağdûbi aleyhim ve leddâllîn.",
        meaning: "Rahmân ve Rahîm olan Allah'ın adıyla.<br>Hamd (övme ve övülme), âlemlerin Rabbi Allah'a mahsustur.<br>O, Rahmân'dır ve Rahîm'dir.<br>Ceza gününün mâlikidir.<br>(Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden medet umarız.<br>Bize doğru yolu göster.<br>Kendilerine lütuf ve ikramda bulunduğun kimselerin yolunu; gazaba uğramışların ve sapmışların yolunu değil!"
    },
    {
        id: "ayetelkursi",
        title: "Ayetel Kürsi",
        audio: "https://cdn.islamic.network/quran/ayah/128/ar.alafasy/262.mp3",
        arabic: "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        reading: "Allahü lâ ilâhe illâ hüvel hayyül kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti vemâ fil erd. Menzellezî yeşfeu indehû illâ biiznih. Ya'lemü mâ beyne eydîhim vemâ halfehüm velâ yühîtûne bişey'in min ilmihî illâ bimâ şâ'. Vesia kürsiyyühüssemâvâti vel erd. Velâ yeûdühû hıfzuhumâ ve hüvel aliyyül azîm.",
        meaning: "Allah, O'ndan başka ilah yoktur; O, hayydır (diridir), kayyumdur. O'nu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki her şey, yerdeki her şey O'nundur. İzni olmaksızın O'nun katında şefaatte bulunacak kimdir? O, kulların önlerindekileri ve arkalarındakileri (yaptıklarını ve yapacaklarını) bilir. Onlar O'nun ilminden, kendisinin dilediği kadarından başka bir şey kavrayamazlar. O'nun kürsüsü bütün gökleri ve yeri kaplayıp kuşatmıştır. (O, göklere, yere, bütün evrene hükmetmektedir.) Gökleri ve yeri koruyup gözetmek O'na güç gelmez. O, yücedir, büyüktür."
    },
    {
        id: "fil",
        title: "Fil Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/105.mp3",
        arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ<br>أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ<br>وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ<br>تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ<br>فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ",
        reading: "Elem tera keyfe fe'ale rabbüke biashâbilfîl.<br>Elem yec'al keydehüm fî tadlîl.<br>Ve ersele aleyhim tayran ebâbîl.<br>Termîhim bihicâratin min siccîl.<br>Fece'alehüm ke'asfin me'kûl.",
        meaning: "Rabbinin, fil sahiplerine ne yaptığını görmedin mi?<br>Onların tuzaklarını boşa çıkarmadı mı?<br>Üzerlerine sürü sürü kuşlar gönderdi.<br>Onlara çamurdan sertleşmiş taşlar atıyorlardı.<br>Nihayet onları yenilmiş ekin yaprağı gibi yaptı."
    },
    {
        id: "kureys",
        title: "Kureyş Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/106.mp3",
        arabic: "لِإِيلَافِ قُرَيْشٍ<br>إِيلَافِهِمْ رِحْلَةَ الشِّتَاء وَالصَّيْفِ<br>فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ<br>الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
        reading: "Liîlâfi Kurayşin.<br>Îlâfihim rihleteşşitâi vessayf.<br>Felya'budû rabbe hâzelbeyt.<br>Ellezî et'amehüm min cû'in ve âmenehüm min havf.",
        meaning: "Kureyş'i ısındırıp alıştırdığı için.<br>Onları kış ve yaz yolculuğuna alıştırdığı için.<br>Şu Beyt'in (Kabe'nin) Rabbine kulluk etsinler.<br>O ki kendilerini açlıktan doyurdu ve korkudan emin kıldı."
    },
    {
        id: "maun",
        title: "Maun Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/107.mp3",
        arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ<br>فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ<br>وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ<br>فَوَيْلٌ لِّلْمُصَلِّينَ<br>الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ<br>الَّذِينَ هُمْ يُرَاؤُونَ<br>وَيَمْنَعُونَ الْمَاعُونَ",
        reading: "Era'eytellezî yükezzibü biddîn.<br>Fezâlikellezî yedu'ul-yetîm.<br>Ve lâ yehuddu alâ ta'âmil-miskîn.<br>Feveylün lil-musallîn.<br>Ellezîne hüm an salâtihim sâhûn.<br>Ellezîne hüm yürâûne.<br>Ve yemne'ûnel-mâ'ûn.",
        meaning: "Gördün mü, o hesap ve ceza gününü yalanlayanı!<br>İşte o, yetimi itip kakan,<br>Yoksulu doyurmaya teşvik etmeyendir.<br>Yazıklar olsun o namaz kılanlara ki,<br>Onlar namazlarını ciddiye almazlar.<br>Onlar (namazlarıyla) gösteriş yaparlar.<br>Ufacık bir yardıma bile engel olurlar."
    },
    {
        id: "kevser",
        title: "Kevser Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/108.mp3",
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ<br>فَصَلِّ لِرَبِّكَ وَانْحَرْ<br>إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        reading: "İnnâ a'taynâkel-kevser.<br>Fesalli lirabbike venhar.<br>İnne şâni'eke hüvel-ebter.",
        meaning: "Şüphesiz biz sana Kevser'i verdik.<br>Öyleyse Rabbin için namaz kıl ve kurban kes.<br>Asıl soyu kesik olan, şüphesiz sana hınç besleyendir."
    },
    {
        id: "kafirun",
        title: "Kafirun Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/109.mp3",
        arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ<br>لَا أَعْبُدُ مَا تَعْبُدُونَ<br>وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ<br>وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ<br>وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ<br>لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
        reading: "Kul yâ eyyühel-kâfirûn.<br>Lâ a'büdü mâ ta'büdûn.<br>Ve lâ entüm âbidûne mâ a'büd.<br>Ve lâ ene âbidün mâ abedtüm.<br>Ve lâ entüm âbidûne mâ a'büd.<br>leküm dînüküm veliye dîn.",
        meaning: "De ki: Ey kâfirler!<br>Ben sizin taptıklarınıza tapmam.<br>Siz de benim taptığıma tapacak değilsiniz.<br>Ben sizin taptıklarınıza tapacak değilim.<br>Siz de benim taptığıma tapacak değilsiniz.<br>Sizin dininiz size, benim dinim banadır."
    },
    {
        id: "nasr",
        title: "Nasr Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/110.mp3",
        arabic: "إِذَا جَاء نَصْرُ اللَّهِ وَالْفَتْحُ<br>وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا<br>فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا",
        reading: "İzâ câe nasrullâhi velfeth.<br>Ve raeytennâse yedhulûne fî dînillâhi efvâcâ.<br>Fesebbih bihamdi rabbike vestağfirh. İnnehû kâne tevvâbâ.",
        meaning: "Allah'ın yardımı ve fetih geldiği zaman,<br>Ve insanların dalga dalga Allah'ın dinine girdiklerini gördüğün zaman,<br>Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. Şüphesiz O, tövbeleri çok kabul edendir."
    },
    {
        id: "tebbet",
        title: "Tebbet Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/111.mp3",
        arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ<br>مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ<br>سَيَصْلَى نَارًا ذَاتَ لَهَبٍ<br>وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ<br>فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ",
        reading: "Tebbet yedâ ebî lehebin ve tebb.<br>Mâ eğnâ anhü mâlühû ve mâ keseb.<br>Seyaslâ nâran zâte leheb.<br>Vemraetühû hammâletelhatab.<br>Fî cîdihâ hablün min mesed.",
        meaning: "Ebû Leheb'in iki eli kurusun! Kurudu da.<br>Malı ve kazandıkları ona fayda vermedi.<br>O, alevli bir ateşte yanacak.<br>Odun taşıyıcı olarak karısı da (ateşe girecek).<br>Boynunda hurma lifinden bükülmüş bir ip olduğu halde."
    },
    YASIN_FULL_DATA,
    {
        id: "ihlas",
        title: "İhlas Suresi (Kulvallah)",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ<br>اللَّهُ الصَّمَدُ<br>لَمْ يَلِدْ وَلَمْ يُولَدْ<br>وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        reading: "Kul hüvellâhü ehad.<br>Allâhüssamed.<br>Lem yelid ve lem yûled.<br>Ve lem yekün lehû küfüven ehad.",
        meaning: "De ki: O, Allah'tır, tektir.<br>Allah Samed'dir. (Her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir.)<br>O, doğurmamış ve doğmamıştır.<br>O'nun hiçbir dengi yoktur."
    },
    {
        id: "felak",
        title: "Felak Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ<br>مِن شَرِّ مَا خَلَقَ<br>وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ<br>وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ<br>وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        reading: "Kul e'ûzü birabbil felak.<br>Min şerri mâ halak.<br>Ve min şerri ğâsikın izâ vekab.<br>Ve min şerri neffâsâti fil ukad.<br>Ve min şerri hâsidin izâ hased.",
        meaning: "De ki: Yarattığı şeylerin şerrinden,<br>Karanlığı çöktüğü zaman gecenin şerrinden,<br>Düğümlere üfleyenlerin şerrinden,<br>Ve haset ettiği zaman hasetçinin şerrinden,<br>Sabahın Rabbine sığınırım."
    },
    {
        id: "nas",
        title: "Nas Suresi",
        audio: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ<br>مَلِكِ النَّاسِ<br>إِلَهِ النَّASİ<br>مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ<br>الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ<br>مِنَ الْجِنَّةِ وَ النَّاسِ",
        reading: "Kul e'ûzü birabbin-nâs.<br>Melikin-nâs.<br>İlâhin-nâs.<br>Min şerril-vesvâsil-hannâs.<br>Ellezî yüvesvisü fî sudûrin-nâs.<br>Minel-cinneti ven-nâs.",
        meaning: "De ki: İnsanların Rabbine sığınırım.<br>İnsanların Melik'ine (hakimine/kralına).<br>İnsanların İlah'ına.<br>O sinsi vesvesecinin şerrinden.<br>O ki, insanların göğüslerine vesvese verir.<br>Gerek cinlerden, gerek insanlardan (olan vesvesecilerin şerrinden)."
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
                <span style="font-family: Arial, sans-serif; font-size: 2rem; color: #ffffff; margin-right: 12px; line-height: 0.7;">•</span>
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

    // Check for Audio
    let audioHTML = '';
    if (dua.audio) {
        audioHTML = `
                <div class="audio-player-container" style="margin: 15px 0; text-align: center;">
                    <audio controls style="width: 100%; border-radius: 30px; opacity: 0.9;">
                        <source src="${dua.audio}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
    }

    // --- TRANSLATION LOGIC (Added 2025-12-15) ---
    const prayerTranslations = {
        en: {
            fatiha: {
                title: "Surah Al-Fatiha",
                meaning: "In the name of Allah, the Most Merciful, the Most Kind.<br>All praise is for Allah, the Lord of all worlds.<br>The Most Merciful, the Most Kind.<br>Master of the Day of Judgment.<br>You alone we worship, and You alone we ask for help.<br>Guide us on the straight path,<br>The path of those You have blessed, not of those who earned Your anger, nor those who went astray."
            },
            ayetelkursi: {
                title: "Ayatul Kursi",
                meaning: "Allah – there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
            },
            fil: {
                title: "Surah Al-Fil",
                meaning: "Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant?<br>Did He not make their plan into misguidance?<br>And He sent against them birds in flocks,<br>Striking them with stones of hard clay,<br>And He made them like eaten straw."
            },
            kureys: {
                title: "Surah Quraysh",
                meaning: "For the accustomed security of the Quraysh -<br>Their accustomed security [in] the caravan of winter and summer -<br>Let them worship the Lord of this House,<br>Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear."
            },
            maun: {
                title: "Surah Al-Ma'un",
                meaning: "Have you seen him who denies the Recompense?<br>That is he who repulses the orphan,<br>And urges not the feeding of the poor.<br>So woe unto those performers of Salah (prayers),<br>Who delay their prayer from their stated fixed times,<br>Those who do good deeds only to be seen,<br>And refuse small kindnesses."
            },
            kevser: {
                title: "Surah Al-Kawthar",
                meaning: "Indeed, We have granted you, [O Muhammad], the Abundance.<br>So pray to your Lord and sacrifice [to Him alone].<br>Indeed, the one who hates you is truly cut off."
            },
            kafirun: {
                title: "Surah Al-Kafirun",
                meaning: "Say, “O disbelievers,<br>I do not worship what you worship.<br>Nor are you worshippers of what I worship.<br>Nor will I be a worshipper of what you worship.<br>Nor will you be worshippers of what I worship.<br>For you is your religion, and for me is my religion.”"
            },
            nasr: {
                title: "Surah An-Nasr",
                meaning: "When comes the Help of Allah and the victory,<br>And you see that the people enter Allah's religion in crowds,<br>So glorify the Praises of your Lord, and ask for His Forgiveness. Verily, He is the One Who accepts the repentance."
            },
            tebbet: {
                title: "Surah Al-Masad",
                meaning: "Perish the two hands of Abu Lahab, and perish he!<br>His wealth and his children will not benefit him!<br>He will be burnt in a Fire of blazing flames!<br>And his wife, too, who carries wood,<br>In her neck is a twisted rope of palm fibre."
            },
            ihlas: {
                title: "Surah Al-Ikhlas",
                meaning: "Say, “He is God, the One.<br>God, the Absolute.<br>He begets not, nor was He begotten.<br>And there is nothing comparable to Him.”"
            },
            felak: {
                title: "Surah Al-Falaq",
                meaning: "Say: I seek refuge with the Lord of the daybreak,<br>From the evil of what He has created;<br>And from the evil of the darkening (night) as it comes with its darkness;<br>And from the evil of the witchcrafts when they blow in the knots,<br>And from the evil of the envier when he envies."
            },
            nas: {
                title: "Surah An-Nas",
                meaning: "Say, “I seek refuge in the Lord of mankind,<br>The King of mankind,<br>The God of mankind,<br>From the evil of the whispering deceiver,<br>Who whispers in the hearts of mankind,<br>From among jinn and humans.”"
            },
            nazar: {
                title: "Prayer for Protection (Nazar)",
                meaning: "And indeed, those who disbelieve would almost make you slip with their eyes when they hear the message, and they say, 'Indeed, he is mad.' But it is not except a reminder to the worlds. (Al-Qalam 51-52)"
            },
            yemek: {
                title: "Prayer After Eating",
                meaning: "Praise be to Allah, who has fed us and given us drink and made us Muslims."
            },
            rabbena: {
                title: "Rabbana Prayers",
                meaning: "<strong>Rabbana Atina:</strong><br>Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.<br><br><strong>Rabbeneğfirli:</strong><br>Our Lord, forgive me and my parents and the believers the Day the account is established."
            },
            yasin: {
                title: "Surah Yasin (Full)",
                meaning: "<i>(English translation for full Surah Yasin is coming soon in the next update.)</i>"
            }
        },
        fr: {
            fatiha: {
                title: "Sourate Al-Fatiha",
                meaning: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.<br>Louange à Allah, Seigneur de l'univers.<br>Le Tout Miséricordieux, le Très Miséricordieux.<br>Maître du Jour de la Rétribution.<br>C'est Toi Seul que nous adorons, et Toi Seul dont nous implorons l'aide.<br>Guide-nous sur la voie droite,<br>La voie de ceux que Tu as comblés de bienfaits, non celle de ceux qui ont encouru Ta colère, ni celle des égarés."
            },
            ayetelkursi: {
                title: "Ayat al-Kursi",
                meaning: "Allah! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission? Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand."
            },
            fil: {
                title: "Sourate Al-Fil",
                meaning: "N'as-tu pas vu comment ton Seigneur a agi envers les gens de l'Éléphant?<br>N'a-t-Il pas rendu leur ruse complètement vaine?<br>Et envoyé sur eux des oiseaux par volées,<br>qui leur lançaient des pierres d'argile?<br>Et Il les a rendus semblables à une paille mâchée."
            },
            kureys: {
                title: "Sourate Quraish",
                meaning: "À cause du pacte des Quraysh,<br>De leur pacte [concernant] les voyages d'hiver et d'été.<br>Qu'ils adorent donc le Seigneur de cette Maison (la Kaaba),<br>Qui les a nourris contre la faim et rassurés de la crainte!"
            },
            maun: {
                title: "Sourate Al-Ma'un",
                meaning: "Vois-tu celui qui traite de mensonge la Rétribution?<br>C'est bien lui qui repousse l'orphelin,<br>Et qui n'encourage point à nourrir le pauvre.<br>Malheur donc, à ceux qui prient<br>tout en négligeant (et retardant) leur Salat,<br>Qui sont pleins d'ostentation,<br>Et refusent l'ustensile (l'aide)."
            },
            kevser: {
                title: "Sourate Al-Kawthar",
                meaning: "Nous t'avons certes, accordé l'Abondance.<br>Accomplis la Salat pour ton Seigneur et sacrifie.<br>Celui qui te hait sera certes, sans postérité."
            },
            kafirun: {
                title: "Sourate Al-Kafirun",
                meaning: "Dis: «Ô vous les infidèles!<br>Je n'adore pas ce que vous adorez.<br>Et vous n'êtes pas adorateurs de ce que j'adore.<br>Je ne suis pas adorateur de ce que vous adorez.<br>Et vous n'êtes pas adorateurs de ce que j'adore.<br>À vous votre religion, et à moi ma religion.»"
            },
            nasr: {
                title: "Sourate An-Nasr",
                meaning: "Lorsque vient le secours d'Allah ainsi que la victoire,<br>Et que tu vois les gens entrer en foule dans la religion d'Allah,<br>Alors, par la louange, célèbre la gloire de ton Seigneur et implore Son pardon. Car c'est Lui qui accueille toujours le repentir."
            },
            tebbet: {
                title: "Sourate Al-Masad",
                meaning: "Que périssent les deux mains d'Abû-Lahab et que lui-même périsse.<br>Sa fortune ne lui sert à rien, ni ce qu'il a acquis.<br>Il sera brûlé dans un Feu plein de flammes,<br>De même sa femme, la porteuse de bois,<br>À son cou, une corde de fibres."
            },
            ihlas: {
                title: "Sourate Al-Ikhlas",
                meaning: "Dis: «Il est Allah, Unique.<br>Allah, Le Seul à être imploré pour ce que nous désirons.<br>Il n'a jamais engendré, n'a pas été engendré non plus.<br>Et nul n'est égal à Lui.»"
            },
            felak: {
                title: "Sourate Al-Falaq",
                meaning: "Dis: «Je cherche protection auprès du Seigneur de l'aube naissante,<br>Contre le mal des êtres qu'Il a créés,<br>Contre le mal de l'obscurité quand elle s'approfondit,<br>Contre le mal de celles qui soufflent (les sorcières) sur les nœuds,<br>Et contre le mal de l'envieux quand il envie.»"
            },
            nas: {
                title: "Sourate An-Nas",
                meaning: "Dis: «Je cherche protection auprès du Seigneur des hommes.<br>Le Souverain des hommes,<br>Dieu des hommes,<br>Contre le mal du mauvais conseiller, furtif,<br>Qui souffle le mal dans les poitrines des hommes,<br>Qu'il (le conseiller) soit un djinn, ou un être humain.»"
            },
            nazar: {
                title: "Prière de Protection (Nazar)",
                meaning: "Peu s'en faut que ceux qui mécroient ne te transpercent par leurs regards, quand ils entendent le Coran, ils disent: «Il est certes fou!» Et ce n'est qu'un Rappel, adressé aux mondes. (Al-Qalam 51-52)"
            },
            yemek: {
                title: "Prière Après le Repas",
                meaning: "Louange à Allah qui nous a nourris, nous a abreuvés et nous a fait Musulmans."
            },
            rabbena: {
                title: "Prières Rabbana",
                meaning: "<strong>Rabbana Atina:</strong><br>Seigneur! Accorde-nous belle part ici-bas, et belle part aussi dans l'au-delà; et protège-nous du châtiment du Feu!<br><br><strong>Rabbeneğfirli:</strong><br>Ô notre Seigneur! Pardonne-moi, ainsi qu'à mes père et mère et aux croyants, le jour de la reddition des comptes."
            },
            yasin: {
                title: "Sourate Yasin",
                meaning: "<i>(La traduction française de la sourate Yasin sera bientôt disponible.)</i>"
            }
        }
    };

    let displayTitle = dua.title;
    let displayMeaning = dua.meaning;

    // Apply Translation if available and not Turkish
    if (currentLang !== 'tr') {
        const targetLang = prayerTranslations[currentLang] ? currentLang : 'en'; // Default to EN if lang missing

        if (prayerTranslations[targetLang] && prayerTranslations[targetLang][dua.id]) {
            displayTitle = prayerTranslations[targetLang][dua.id].title;
            displayMeaning = prayerTranslations[targetLang][dua.id].meaning;
        } else if (targetLang !== 'en' && prayerTranslations['en'] && prayerTranslations['en'][dua.id]) {
            // Second fallback to English
            displayTitle = prayerTranslations['en'][dua.id].title;
            displayMeaning = prayerTranslations['en'][dua.id].meaning;
        }
    }

    displayArea.innerHTML = `
            <div class="prayer-page-header fade-appear">
                <h2 class="page-title">${displayTitle}</h2>
                <div class="ornament"></div>
                ${audioHTML}
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
            <p class="meaning-text">${displayMeaning}</p>
        </div>
    `;

    // Scroll to top
    displayArea.scrollTop = 0;
}

function closePrayerDetail() {
    const bookContainer = document.getElementById('prayers-book-container');
    const detailView = document.getElementById('prayer-detail-view');

    // Stop Audio if playing
    const audio = detailView.querySelector('audio');
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    if (detailView) {
        detailView.classList.remove('active');
        setTimeout(() => {
            detailView.style.display = 'none';
            if (bookContainer) bookContainer.style.display = 'flex';
        }, 300); // Wait for transition
    }
}

// Initial Render
// Redundant Qibla Init Removed
// document.addEventListener('DOMContentLoaded', () => {
//     init(); // Master Init
//     initQibla(); // Qibla Init
//     renderPrayers();
// });

/* --- QIBLA FINDER LOGIC --- */

let qiblaBearing = 0;
let compassActive = false;

function initQibla() {
    // If we have location, pre-calculate Qibla
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            qiblaBearing = calculateQibla(pos.coords.latitude, pos.coords.longitude);
            document.getElementById('qibla-angle').textContent = Math.round(qiblaBearing) + "°";
        }, (err) => {
            console.log("Qibla Location Error", err);
        });
    }
}

function startCompass() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    compassActive = true;
                    document.getElementById('qibla-status').textContent = translations[currentLang].qiblaStatus || "Cihazı düz tutun ve kalibre edin.";
                } else {
                    alert("Pusula için izin gerekiyor.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Pusula Hatası: " + error);
            });
    } else {
        // Android / Standard
        try {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);
            compassActive = true;
            document.getElementById('qibla-status').textContent = translations[currentLang].qiblaStatus || "Cihazı düz tutun ve kalibre edin.";
        } catch (e) {
            console.error(e);
            alert("Pusula Hatası: " + e);
        }
    }
}

function handleOrientation(e) {
    if (!compassActive) return;

    let compassHeading = 0;

    // Calculate Compass Heading (North)
    if (e.webkitCompassHeading) {
        // iOS
        compassHeading = e.webkitCompassHeading;
    } else if (e.alpha) {
        // Android (alpha is z-axis rotation, usually requires diff logic to get North, but basic approx:)
        // Best practice for Android is 'deviceorientationabsolute' and alpha, but 'alpha' varies by device/browser.
        // Simple fallback:
        compassHeading = 360 - e.alpha;
    }

    // Update UI Values
    document.getElementById('compass-heading').textContent = Math.round(compassHeading) + "°";

    // Rotate the Compass Face so North matches North
    // If heading is 90 (East), we rotate face -90 degrees so 'N' points left (North).
    const face = document.getElementById('compass-face');
    if (face) {
        face.style.transform = `rotate(${-compassHeading}deg)`;
    }

    // Position the Kaaba Pointer relative to North
    // The Compass Face is N at Top (0 deg).
    // If Qibla is 150 deg, we want the Kaaba icon at 150 deg on the circle.
    // CSS Rotation will rotate the whole face relative to phone. 

    // We want the Kaaba Icon to stay at the correct bearing relative to North.
    // Since the FACE rotates to match North, the Kaaba Icon (which is inside the Face) just needs 
    // to be placed at the Qibla Angle relative to the Face's North.
    const kaabaPointer = document.getElementById('kaaba-pointer');
    if (kaabaPointer) {
        // Radius is 140px (half of 280). 
        // We can just rotate the icon element itself from center?
        // No, let's just rotate the icon container.

        // Actually simpler:
        // The Face rotates so N is accurate.
        // We just need the Kaaba pointer to be at X degrees on that face.
        // So we rotate the Kaaba pointer to X degrees relative to the face container.
        kaabaPointer.style.transform = `translate(-50%, -50%) rotate(${qiblaBearing}deg) translate(0, -110px) rotate(${-qiblaBearing}deg)`;
        // Explanation:
        // 1. Center anchor.
        // 2. Rotate to bearing angle.
        // 3. Push out to radius (110px).
        // 4. Counter-rotate to keep icon upright (optional).
    }
}

function calculateQibla(lat, lng) {
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    const phiK = kaabaLat * Math.PI / 180.0;
    const lambdaK = kaabaLng * Math.PI / 180.0;
    const phi = lat * Math.PI / 180.0;
    const lambda = lng * Math.PI / 180.0;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

    let bearing = Math.atan2(y, x) * 180.0 / Math.PI;

    return (bearing + 360) % 360;
}
