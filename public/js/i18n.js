// Global supported language options
const GLOBAL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'zh-CN', name: '中文 (Chinese Simplified)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe (Turkish)' }
];

// Initialize Google Translate Widget quietly in background
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google_translate_element');
}

// Set cookie required by Google Translate engine across pages
function setTranslateCookie(langCode) {
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=/en/${langCode}; path=/;`;
}

// Change language globally and refresh/apply
function setGlobalLanguage(langCode) {
  localStorage.setItem('siteLanguage', langCode);
  setTranslateCookie(langCode);

  // Close modal if open
  const modalEl = document.getElementById('langModal');
  if (modalEl && window.bootstrap) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  }

  // Reload page to force entire DOM translation
  window.location.reload();
}

// Render dynamic language lists into modal and dropdown
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = localStorage.getItem('siteLanguage');

  // Populate Navbar Select Options
  const navSelect = document.getElementById('navLangSelect');
  if (navSelect) {
    navSelect.innerHTML = GLOBAL_LANGUAGES.map(l => 
      `<option value="${l.code}" ${currentLang === l.code ? 'selected' : ''}>${l.name}</option>`
    ).join('');

    navSelect.addEventListener('change', (e) => {
      setGlobalLanguage(e.target.value);
    });
  }

  // Populate Modal Language Buttons
  const modalGrid = document.getElementById('modalLangGrid');
  if (modalGrid) {
    modalGrid.innerHTML = GLOBAL_LANGUAGES.map(l => `
      <button class="btn btn-outline-primary rounded-pill fw-bold py-2" onclick="setGlobalLanguage('${l.code}')">
        ${l.name}
      </button>
    `).join('');
  }

  // If first visit, show language selection modal
  if (!currentLang) {
    const modalEl = document.getElementById('langModal');
    if (modalEl && window.bootstrap) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
      modal.show();
    }
  } else {
    // Ensure translation cookie is enforced
    setTranslateCookie(currentLang);
  }
});