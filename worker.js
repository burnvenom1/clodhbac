var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var EMAIL_LIST = [
  "jihpngpnd@emlhub.com",
  "tmrzfanje@emlpro.com", 
  "wiraypzse@emlpro.com",
  "lnmwhbvvf@emltmp.com",
  "bshuzcvvf@emltmp.com",
  "hsfsqxcug@emltmp.com",
  "nqywhdnoh@emlhub.com"
];

const COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";
const DEBUG_MODE = false;

// OPTİMİZE LOG FONKSİYONLARI
function debugLog(...args) {
  if (DEBUG_MODE) console.log(...args);
}
__name(debugLog, "debugLog");

function errorLog(...args) {
  console.log(...args);
}
__name(errorLog, "errorLog");

// HEADER SET
var HEADER_SETS = [
  {
    "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "SecCHUA": '"Chromium";v="120", "Google Chrome";v="120", "Not-A.Brand";v="8"',
    "SecCHUAMobile": "?0",
    "SecCHUAPlatform": '"Windows"',
    "Accept": "application/json, text/plain, */*",
    "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "AcceptEncoding": "gzip, deflate, br",
    "CacheControl": "no-cache",
    "Connection": "keep-alive"
  },
  {
    "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "SecCHUA": '"Chromium";v="119", "Google Chrome";v="119", "Not-A.Brand";v="8"',
    "SecCHUAMobile": "?0",
    "SecCHUAPlatform": '"Windows"',
    "Accept": "application/json, text/plain, */*",
    "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "AcceptEncoding": "gzip, deflate, br",
    "CacheControl": "no-cache",
    "Connection": "keep-alive"
  }
];

// TAMAMEN İZOLE KAYIT SİSTEMİ - HER İŞLEM BAĞIMSIZ
function createIsolatedRegistration() {
  const instance = {};
  
  // HER INSTANCE TAMAMEN BAĞIMSIZ - İŞLEM BAŞINDA TEMİZ STATE
  instance.cookies = new Map();
  instance.requestId = Math.random().toString(36).substring(2, 15);
  instance.isActive = true;
  instance.startTime = Date.now();
  instance.sessionFingerprint = null;
  instance.currentXsrfToken = null;

  // INSTANCE TEMİZLEME FONKSİYONU
  instance.cleanup = function() {
    if (!instance.isActive) return;
    
    debugLog(`🧹 [${instance.requestId}] Instance temizleniyor...`);
    
    // Tüm state'i temizle
    instance.cookies.clear();
    instance.sessionFingerprint = null;
    instance.currentXsrfToken = null;
    instance.isActive = false;
    
    const duration = Date.now() - instance.startTime;
    debugLog(`✅ [${instance.requestId}] Instance tamamen temizlendi (${duration}ms)`);
  };
  __name(instance.cleanup, "cleanup");

  // İŞLEM BAŞI TAM TEMİZLİK
  instance.initializeCleanState = function() {
    debugLog(`🆕 [${instance.requestId}] Yeni temiz instance oluşturuldu`);
    
    // Önceki state'i tamamen temizle
    instance.cookies.clear();
    instance.sessionFingerprint = null;
    instance.currentXsrfToken = null;
    instance.isActive = true;
    instance.startTime = Date.now();
    
    // Yeni session fingerprint oluştur
    instance.sessionFingerprint = instance.generateFingerprint();
    
    debugLog(`✨ [${instance.requestId}] Başlangıç temizliği tamamlandı - Yeni fingerprint: ${instance.sessionFingerprint}`);
  };
  __name(instance.initializeCleanState, "initializeCleanState");

  // HELPER FONKSİYONLAR
  instance.extractAttribute = function(attributes, attrName) {
    if (!instance.isActive) return null;
    const attr = attributes.find(a => a.toLowerCase().startsWith(attrName.toLowerCase() + '='));
    return attr ? attr.split('=')[1] : null;
  };
  __name(instance.extractAttribute, "extractAttribute");

  instance.extractSameSite = function(attributes) {
    if (!instance.isActive) return 'Lax';
    const sameSiteAttr = attributes.find(a => a.toLowerCase().startsWith('samesite='));
    if (sameSiteAttr) {
      const value = sameSiteAttr.split('=')[1].toLowerCase();
      if (value === 'none') return 'None';
      if (value === 'strict') return 'Strict';
      if (value === 'lax') return 'Lax';
    }
    return 'Lax';
  };
  __name(instance.extractSameSite, "extractSameSite");

  instance.extractExpiration = function(attributes) {
    if (!instance.isActive) return null;
    const expiresAttr = attributes.find(a => a.toLowerCase().startsWith('expires='));
    if (expiresAttr) {
      const expiresDate = new Date(expiresAttr.split('=')[1]);
      if (!isNaN(expiresDate.getTime())) return expiresDate.getTime() / 1000;
    }
    
    const maxAgeAttr = attributes.find(a => a.toLowerCase().startsWith('max-age='));
    if (maxAgeAttr) {
      const maxAge = parseInt(maxAgeAttr.split('=')[1]);
      if (!isNaN(maxAge)) return Date.now() / 1000 + maxAge;
    }
    
    return null;
  };
  __name(instance.extractExpiration, "extractExpiration");

  // OTOMATİK COOKIE YÜKLEME - HER İŞLEM İÇİN YENİ
  instance.loadInitialCookies = async function() {
    if (!instance.isActive) return false;
    
    debugLog(`👤 [${instance.requestId}] Başlangıç cookie'leri yükleniyor...`);
    
    try {
      // Önce mevcut cookie'leri temizle
      instance.cookies.clear();
      
      const response = await fetch(COOKIE_API_URL);
      if (!response.ok) throw new Error(`API hatası: ${response.status}`);
      
      const cookieData = await response.json();
      let cookiesArray;
      
      if (cookieData.set1 && Array.isArray(cookieData.set1)) {
        const setKeys = Object.keys(cookieData).filter(key => key.startsWith('set'));
        debugLog(`🔍 [${instance.requestId}] Bulunan setler: ${setKeys.join(', ')}`);
        
        if (setKeys.length === 0) throw new Error("Cookie set bulunamadı");
        
        const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
        cookiesArray = cookieData[randomSetKey];
        debugLog(`🎲 [${instance.requestId}] Seçilen cookie set: ${randomSetKey}`);
      } 
      else if (Array.isArray(cookieData)) {
        cookiesArray = cookieData;
        debugLog(`📥 [${instance.requestId}] API'den ${cookiesArray.length} cookie alındı`);
      } else {
        throw new Error(`API formatı beklenmiyor: ${typeof cookieData}`);
      }
      
      // Yeni cookie'leri yükle
      cookiesArray.forEach(cookie => {
        if (cookie.name && cookie.value && instance.isActive) {
          instance.cookies.set(cookie.name, {
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || '/',
            secure: cookie.secure !== undefined ? cookie.secure : true,
            httpOnly: cookie.httpOnly || false,
            sameSite: cookie.sameSite || 'Lax',
            expirationDate: cookie.expires || cookie.expirationDate
          });
          debugLog(`✅ [${instance.requestId}] ${cookie.name} yüklendi`);
        }
      });
      
      debugLog(`🎯 [${instance.requestId}] ${instance.cookies.size} cookie yüklendi`);
      return true;
      
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] Cookie alınamadı:`, error.message);
      return false;
    }
  };
  __name(instance.loadInitialCookies, "loadInitialCookies");

  // COOKIE HEADER OLUŞTURMA
  instance.getCookieHeaderForDomain = function(targetUrl) {
    if (!instance.isActive) return "";
    
    try {
      const urlObj = new URL(targetUrl);
      const targetDomain = urlObj.hostname;
      const cookies = [];
      
      instance.cookies.forEach((cookieData, name) => {
        if (instance.isActive && instance.shouldSendCookie(cookieData, targetDomain, targetUrl)) {
          cookies.push(`${name}=${cookieData.value}`);
        }
      });
      
      const header = cookies.join("; ");
      debugLog(`🍪 [${instance.requestId}] ${cookies.length} cookie gönderiliyor: ${targetDomain}`);
      return header;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] URL parse hatası:`, error.message);
      return "";
    }
  };
  __name(instance.getCookieHeaderForDomain, "getCookieHeaderForDomain");

  // COOKIE GÖNDERME KURALLARI
  instance.shouldSendCookie = function(cookieData, targetDomain, targetUrl) {
    if (!instance.isActive) return false;
    if (!cookieData.domain) {
      return true;
    }
    
    const cookieDomain = cookieData.domain;
    
    // 1. EXACT MATCH: "hepsiburada.com" == "hepsiburada.com"
    if (cookieDomain === targetDomain) {
      return true;
    }
    
    // 2. SUBDOMAIN MATCH: ".hepsiburada.com" → "oauth.hepsiburada.com"
    if (cookieDomain.startsWith('.') && targetDomain.endsWith(cookieDomain)) {
      return true;
    }
    
    // 3. PARENT DOMAIN MATCH: "hepsiburada.com" → "oauth.hepsiburada.com"
    if (targetDomain.endsWith('.' + cookieDomain)) {
      return true;
    }
    
    return false;
  };
  __name(instance.shouldSendCookie, "shouldSendCookie");

  // COOKIE GÜNCELLEME
  instance.updateCookiesFromResponse = function(response, requestUrl) {
    if (!instance.isActive) return;
    
    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) {
      debugLog(`📭 [${instance.requestId}] Set-Cookie header yok`);
      return;
    }
    
    debugLog(`📨 [${instance.requestId}] Set-Cookie Header alındı`);
    const cookies = setCookieHeader.split(/,\s*(?=[^;]+=)/);
    
    let updatedCount = 0;
    let addedCount = 0;
    
    cookies.forEach((cookieStr) => {
      if (!instance.isActive) return;
      
      const parts = cookieStr.split(';').map(part => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split('=');
      
      if (name && value) {
        const cookieData = {
          value: value,
          domain: instance.extractAttribute(attributes, 'domain') || new URL(requestUrl).hostname,
          path: instance.extractAttribute(attributes, 'path') || '/',
          secure: attributes.some(attr => attr.toLowerCase() === 'secure'),
          httpOnly: attributes.some(attr => attr.toLowerCase() === 'httponly'),
          sameSite: instance.extractSameSite(attributes),
          expirationDate: instance.extractExpiration(attributes)
        };
        
        if (instance.cookies.has(name)) {
          instance.cookies.set(name, cookieData);
          debugLog(`🔄 [${instance.requestId}] Cookie güncellendi: ${name}`);
          updatedCount++;
        } else {
          instance.cookies.set(name, cookieData);
          debugLog(`➕ [${instance.requestId}] Yeni cookie eklendi: ${name}`);
          addedCount++;
        }
      }
    });
    
    debugLog(`✅ [${instance.requestId}] ${updatedCount} cookie güncellendi, ${addedCount} yeni cookie eklendi`);
  };
  __name(instance.updateCookiesFromResponse, "updateCookiesFromResponse");

  // FINGERPRINT OLUŞTURMA - HER INSTANCE İÇİN YENİ
  instance.generateFingerprint = function() {
    if (!instance.isActive) return 'inactive-instance';
    
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    
    return `${uuid}-${timestamp}-${randomPart}`;
  };
  __name(instance.generateFingerprint, "generateFingerprint");

  // RANDOM HEADER GENERATOR - SESSION FINGERPRINT İLE
  instance.getRandomHeaders = function() {
    if (!instance.isActive) return HEADER_SETS[0];
    
    const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
    
    // Session fingerprint kullan
    const fingerprint = instance.sessionFingerprint || instance.generateFingerprint();
    
    const headers = {
      ...baseSet,
      fingerprint: fingerprint
    };
    
    debugLog(`🎭 [${instance.requestId}] Header set seçildi - Fingerprint: ${fingerprint}`);
    return headers;
  };
  __name(instance.getRandomHeaders, "getRandomHeaders");

  // EMAIL FORMATLAMA
  instance.getFormattedEmail = function() {
    if (!instance.isActive) return EMAIL_LIST[0];
    
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const [username, domain] = baseEmail.split("@");
    const random1 = Math.random().toString(36).substring(2, 5);
    const random2 = Math.random().toString(36).substring(2, 5);
    return `${username}.${random1}@${random2}.${domain}`;
  };
  __name(instance.getFormattedEmail, "getFormattedEmail");

  // RASTGELE TÜRK İSMİ
  instance.getRandomTurkishName = function() {
    if (!instance.isActive) return "User";
    
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
    return names[Math.floor(Math.random() * names.length)];
  };
  __name(instance.getRandomTurkishName, "getRandomTurkishName");

  // DELAY FONKSİYONU
  instance.delay = function(ms) {
    if (!instance.isActive) return Promise.resolve();
    
    debugLog(`⏳ [${instance.requestId}] ${ms}ms bekleniyor...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  __name(instance.delay, "delay");

  // XSRF TOKEN ALMA - INSTANCE BAZLI
  instance.getXsrfToken = async function(selectedHeaders) {
    if (!instance.isActive) return null;
    
    debugLog(`🔄 [${instance.requestId}] XSRF Token alınıyor...`);
    
    const xsrfUrl = "https://oauth.hepsiburada.com/api/authenticate/xsrf-token";
    
    const headers = {
      "accept": selectedHeaders.Accept,
      "accept-language": selectedHeaders.AcceptLanguage,
      "accept-encoding": selectedHeaders.AcceptEncoding,
      "cache-control": selectedHeaders.CacheControl,
      "connection": selectedHeaders.Connection,
      "origin": "https://giris.hepsiburada.com",
      "referer": "https://giris.hepsiburada.com/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": selectedHeaders.UserAgent
    };
    
    const cookieHeader = instance.getCookieHeaderForDomain(xsrfUrl);
    if (cookieHeader) headers["cookie"] = cookieHeader;
    
    if (selectedHeaders.SecCHUA) {
      headers["sec-ch-ua"] = selectedHeaders.SecCHUA;
      headers["sec-ch-ua-mobile"] = selectedHeaders.SecCHUAMobile;
      headers["sec-ch-ua-platform"] = selectedHeaders.SecCHUAPlatform;
    }
    
    try {
      const response = await fetch(xsrfUrl, { 
        method: 'GET',
        headers 
      });
      
      debugLog(`📡 [${instance.requestId}] XSRF Response Status: ${response.status}`);
      
      instance.updateCookiesFromResponse(response, xsrfUrl);
      
      let xsrfToken = null;
      
      if (response.ok) {
        try {
          const responseData = await response.json();
          if (responseData && responseData.token) {
            xsrfToken = responseData.token;
            instance.currentXsrfToken = xsrfToken; // Instance state'de sakla
            debugLog(`✅ [${instance.requestId}] XSRF Token alındı: ${xsrfToken.substring(0, 10)}...`);
          }
        } catch (e) {
          debugLog(`❌ [${instance.requestId}] XSRF JSON parse hatası`);
        }
      }
      
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader && !xsrfToken) {
        const xsrfMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        if (xsrfMatch) {
          xsrfToken = decodeURIComponent(xsrfMatch[1]);
          instance.currentXsrfToken = xsrfToken; // Instance state'de sakla
          debugLog(`✅ [${instance.requestId}] XSRF Token header'dan alındı: ${xsrfToken.substring(0, 10)}...`);
        }
      }
      
      if (!xsrfToken) {
        debugLog(`❌ [${instance.requestId}] XSRF Token bulunamadı`);
      }
      
      return xsrfToken;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] XSRF Token hatası:`, error.message);
      return null;
    }
  };
  __name(instance.getXsrfToken, "getXsrfToken");

  // OTP KODU ALMA
  instance.getOtpCode = async function(email) {
    if (!instance.isActive) return null;
    
    const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${encodeURIComponent(email)}&mode=0`;
    debugLog(`📱 [${instance.requestId}] OTP Kodu alınıyor...`);
    
    try {
      const response = await fetch(otpUrl, { redirect: "follow" });
      const otpResponse = await response.text();
      
      let otpCode = null;
      const match = otpResponse.match(/\b\d{6}\b/);
      
      if (match) {
        otpCode = match[0];
      } else if (/^\d{6}$/.test(otpResponse.trim())) {
        otpCode = otpResponse.trim();
      }
      
      if (otpCode) {
        debugLog(`🔢 [${instance.requestId}] OTP Kodu Bulundu: ${otpCode}`);
      } else {
        debugLog(`❌ [${instance.requestId}] OTP kodu bulunamadı - Response: ${otpResponse.substring(0, 100)}`);
      }
      
      return otpCode;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] OTP Hatası:`, error.message);
      return null;
    }
  };
  __name(instance.getOtpCode, "getOtpCode");

  // POST REQUEST - TAM İZOLE
  instance.makePostRequest = async function(url, body, xsrfToken, selectedHeaders, requestName = "POST") {
    if (!instance.isActive) {
      return { success: false, error: "Instance inactive" };
    }
    
    debugLog(`🎯 [${instance.requestId}] ${requestName} isteği: ${url}`);
    
    // Her request için instance fingerprint kullan
    const currentFingerprint = instance.sessionFingerprint;
    
    const headers = {
      "accept": selectedHeaders.Accept,
      "accept-language": selectedHeaders.AcceptLanguage,
      "accept-encoding": selectedHeaders.AcceptEncoding,
      "cache-control": selectedHeaders.CacheControl,
      "connection": selectedHeaders.Connection,
      "content-type": "application/json",
      "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
      "fingerprint": currentFingerprint,
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "origin": "https://giris.hepsiburada.com",
      "referer": "https://giris.hepsiburada.com/",
      "user-agent": selectedHeaders.UserAgent
    };
    
    const cookieHeader = instance.getCookieHeaderForDomain(url);
    if (cookieHeader) headers["cookie"] = cookieHeader;
    
    if (selectedHeaders.SecCHUA) {
      headers["sec-ch-ua"] = selectedHeaders.SecCHUA;
      headers["sec-ch-ua-mobile"] = selectedHeaders.SecCHUAMobile;
      headers["sec-ch-ua-platform"] = selectedHeaders.SecCHUAPlatform;
    }
    
    if (xsrfToken) headers["x-xsrf-token"] = xsrfToken;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      
      debugLog(`📡 [${instance.requestId}] ${requestName} Response Status: ${response.status}`);
      
      instance.updateCookiesFromResponse(response, url);
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { success: false, error: "Invalid JSON response" };
      }
      
      return {
        success: response.ok,
        data,
        status: response.status,
        fingerprint: currentFingerprint
      };
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] ${requestName} Hatası:`, error.message);
      return { success: false, error: error.message };
    }
  };
  __name(instance.makePostRequest, "makePostRequest");

  // ANA KAYIT FONKSİYONU - TAMAMEN İZOLE
  instance.startRegistration = async function(email) {
    console.log(`🚀 [${instance.requestId}] TAM İZOLE KAYIT BAŞLATILIYOR - EMAIL:`, email);
    
    try {
      // İŞLEM BAŞI TAM TEMİZLİK
      instance.initializeCleanState();
      
      debugLog(`\n🔧 [${instance.requestId}] 1. ADIM: Başlangıç cookie'leri yükleniyor...`);
      const cookieSuccess = await instance.loadInitialCookies();
      if (!cookieSuccess) {
        throw new Error("Başlangıç cookie'leri alınamadı");
      }
      
      const selectedHeaders = instance.getRandomHeaders();
      
      debugLog(`\n🔧 [${instance.requestId}] 2. ADIM: XSRF Token alınıyor...`);
      let xsrfToken1 = await instance.getXsrfToken(selectedHeaders);
      if (!xsrfToken1) {
        throw new Error("1. XSRF Token alınamadı");
      }
      
      debugLog(`\n🔧 [${instance.requestId}] 3. ADIM: Üyelik isteği gönderiliyor...`);
      const postBody1 = {
        email,
        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
      };
      
      const result1 = await instance.makePostRequest(
        "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
        postBody1,
        xsrfToken1,
        selectedHeaders,
        "1. POST - Üyelik İsteği"
      );
      
      if (!result1.success || !result1.data?.success) {
        throw new Error(`1. POST başarısız: ${result1.data?.message || result1.error || 'Bilinmeyen hata'}`);
      }
      
      debugLog(`🎉 [${instance.requestId}] 1. POST BAŞARILI`);
      
      debugLog(`\n⏳ [${instance.requestId}] 4. ADIM: OTP bekleniyor (15 saniye)...`);
      await instance.delay(15000);
      
      debugLog(`\n🔧 [${instance.requestId}] 5. ADIM: OTP kodu alınıyor...`);
      const otpCode = await instance.getOtpCode(email);
      
      if (!otpCode) {
        throw new Error("OTP kodu alınamadı");
      }
      
      debugLog(`✅ [${instance.requestId}] OTP KODU HAZIR: ${otpCode}`);
      
      debugLog(`\n🔧 [${instance.requestId}] 6. ADIM: 2. POST için XSRF Token alınıyor...`);
      let xsrfToken2 = await instance.getXsrfToken(selectedHeaders);
      if (!xsrfToken2) {
        throw new Error("2. XSRF Token alınamadı");
      }
      
      const postBody2 = {
        otpReference: result1.data.data.referenceId,
        otpCode
      };
      
      const result2 = await instance.makePostRequest(
        "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
        postBody2,
        xsrfToken2,
        selectedHeaders,
        "2. POST - OTP Doğrulama"
      );
      
      if (!result2.success || !result2.data?.success || !result2.data.requestId) {
        throw new Error(`2. POST başarısız: ${result2.data?.message || result2.error || 'Bilinmeyen hata'}`);
      }
      
      debugLog(`🎉 [${instance.requestId}] 2. POST BAŞARILI`);
      
      debugLog(`\n⏳ [${instance.requestId}] 7. ADIM: Kayıt öncesi bekleniyor (3 saniye)...`);
      await instance.delay(3000);
      
      debugLog(`\n🔧 [${instance.requestId}] 8. ADIM: 3. POST için XSRF Token alınıyor...`);
      let xsrfToken3 = await instance.getXsrfToken(selectedHeaders);
      if (!xsrfToken3) {
        throw new Error("3. XSRF Token alınamadı");
      }
      
      const firstName = instance.getRandomTurkishName();
      const lastName = instance.getRandomTurkishName();
      const password = "Hepsiburada1";
      
      debugLog(`🎭 [${instance.requestId}] Kullanıcı bilgileri hazır: ${firstName} ${lastName}`);
      
      const postBody3 = {
        subscribeEmail: true,
        firstName,
        lastName,
        password,
        subscribeSms: true,
        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query",
        requestId: result2.data.requestId
      };
      
      const result3 = await instance.makePostRequest(
        "https://oauth.hepsiburada.com/api/authenticate/register",
        postBody3,
        xsrfToken3,
        selectedHeaders,
        "3. POST - Kayıt Tamamlama"
      );
      
      if (result3.success && result3.data?.success) {
        console.log(`🎉 🎉 🎉 [${instance.requestId}] KAYIT BAŞARILI! 🎉 🎉 🎉`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔐 Password: ${password}`);
        console.log(`👤 Name: ${firstName} ${lastName}`);
        
        return {
          success: true,
          email,
          password,
          name: `${firstName} ${lastName}`,
          accessToken: result3.data.data.accessToken,
          refreshToken: result3.data.data.refreshToken,
          requestId: instance.requestId,
          fingerprint: instance.sessionFingerprint
        };
      } else {
        console.log(`❌ [${instance.requestId}] KAYIT BAŞARISIZ!`);
        
        return { 
          success: false, 
          error: result3.data?.message || "Kayıt başarısız",
          requestId: instance.requestId
        };
      }
      
    } catch (error) {
      console.log(`💥 [${instance.requestId}] HATA:`, error.message);
      
      return { 
        success: false, 
        error: error.message,
        requestId: instance.requestId
      };
    } finally {
      // İŞLEM SONU TAM TEMİZLİK
      instance.cleanup();
    }
  };
  __name(instance.startRegistration, "startRegistration");

  return instance;
}
__name(createIsolatedRegistration, "createIsolatedRegistration");

// WORKER - HER İSTEK İÇİN YENİ TAM İZOLE INSTANCE
var worker_default = {
  async fetch(request, env, ctx) {
    debugLog("📥 Yeni request:", request.method, request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    
    if (url.pathname === "/register") {
      // HER İSTEK İÇİN YENİ TAM İZOLE INSTANCE
      const registration = createIsolatedRegistration();
      
      try {
        const email = url.searchParams.get("email") || registration.getFormattedEmail();
        
        console.log("🎯 Yeni tam izole kayıt başlatılıyor:", email);
        console.log("🔧 Instance ID:", registration.requestId);
        
        const result = await registration.startRegistration(email);
        
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      } catch (error) {
        errorLog("💥 API hatası:", error.message);
        
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }, null, 2), {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      }
    }
    
    if (url.pathname === "/test-cookies") {
      // TEST İÇİN DE YENİ INSTANCE
      const registration = createIsolatedRegistration();
      
      try {
        await registration.loadInitialCookies();
        
        return new Response(JSON.stringify({
          success: true,
          message: "Cookie testi tamamlandı",
          cookieCount: registration.cookies.size,
          requestId: registration.requestId
        }, null, 2), {
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          requestId: registration.requestId
        }, null, 2), {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      }
    }
    
    return new Response(JSON.stringify({
      message: "Hepsiburada Kayıt API - Tam İzole Versiyon",
      endpoints: {
        "/register": "Tam izole kayıt başlat",
        "/test-cookies": "Cookie testi"
      }
    }, null, 2), {
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      }
    });
  }
};

export {
  worker_default as default
};
