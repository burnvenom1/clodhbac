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

// HER KAYIT İŞLEMİ İÇİN TAMAMEN İZOLE BİR FONKSİYON
function createIsolatedRegistration() {
  const instance = {};
  
  instance.cookies = new Map();
  instance.requestId = Math.random().toString(36).substring(2, 15);

  // HELPER FONKSİYONLAR
  instance.extractAttribute = function(attributes, attrName) {
    const attr = attributes.find(a => a.toLowerCase().startsWith(attrName.toLowerCase() + '='));
    return attr ? attr.split('=')[1] : null;
  };
  __name(instance.extractAttribute, "extractAttribute");

  instance.extractSameSite = function(attributes) {
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

  // API COOKIE'LERİ ALMA
  instance.getCookies = async function() {
    debugLog(`👤 [${instance.requestId}] API Cookie alınıyor`);
    
    try {
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
      
      instance.cookies.clear();
      
      cookiesArray.forEach(cookie => {
        if (cookie.name && cookie.value) {
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
  __name(instance.getCookies, "getCookies");

  // COOKIE HEADER OLUŞTURMA
  instance.getCookieHeaderForDomain = function(targetUrl) {
    try {
      const urlObj = new URL(targetUrl);
      const targetDomain = urlObj.hostname;
      const cookies = [];
      
      instance.cookies.forEach((cookieData, name) => {
        if (instance.shouldSendCookie(cookieData, targetDomain, targetUrl)) {
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

  // COOKIE GÖNDERME KURALLARI - DÜZELTİLMİŞ
  instance.shouldSendCookie = function(cookieData, targetDomain, targetUrl) {
    if (!cookieData.domain) {
      debugLog(`   🔓 [${instance.requestId}] Domain yok - gönder: ${targetDomain}`);
      return true;
    }
    
    const cookieDomain = cookieData.domain.replace(/^\./, '');
    const cleanTargetDomain = targetDomain.replace(/^\./, '');
    
    debugLog(`   🔍 [${instance.requestId}] Domain kontrol: cookie="${cookieDomain}" target="${cleanTargetDomain}"`);
    
    // 1. EXACT MATCH: "hepsiburada.com" == "hepsiburada.com"
    if (cookieDomain === cleanTargetDomain) {
      debugLog(`   ✅ [${instance.requestId}] Exact match`);
      return true;
    }
    
    // 2. SUBDOMAIN MATCH: "oauth.hepsiburada.com" → "hepsiburada.com"
    if (cleanTargetDomain.endsWith('.' + cookieDomain)) {
      debugLog(`   ✅ [${instance.requestId}] Subdomain match: ${cleanTargetDomain} endsWith .${cookieDomain}`);
      return true;
    }
    
    debugLog(`   ❌ [${instance.requestId}] Domain uyumsuz`);
    return false;
  };
  __name(instance.shouldSendCookie, "shouldSendCookie");

  // COOKIE GÜNCELLEME
  instance.updateCookiesFromResponse = function(response, requestUrl) {
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

  // COOKIE API
  instance.getFreshCookies = async function() {
    debugLog(`🍪 [${instance.requestId}] Cookie'ler alınıyor...`);
    instance.cookies.clear();
    return await instance.getCookies();
  };
  __name(instance.getFreshCookies, "getFreshCookies");

  // RANDOM HEADER GENERATOR
  instance.getRandomHeaders = function() {
    const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
    const fingerprint = instance.getFingerprint();
    
    const headers = {
      ...baseSet,
      fingerprint: fingerprint
    };
    
    debugLog(`🎭 [${instance.requestId}] Header set seçildi`);
    return headers;
  };
  __name(instance.getRandomHeaders, "getRandomHeaders");

  // EMAIL FORMATLAMA
  instance.getFormattedEmail = function() {
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const [username, domain] = baseEmail.split("@");
    const random1 = Math.random().toString(36).substring(2, 5);
    const random2 = Math.random().toString(36).substring(2, 5);
    return `${username}.${random1}@${random2}.${domain}`;
  };
  __name(instance.getFormattedEmail, "getFormattedEmail");

  // FINGERPRINT OLUŞTURMA
  instance.getFingerprint = function() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    debugLog(`🆕 [${instance.requestId}] Fingerprint oluşturuldu`);
    return uuid;
  };
  __name(instance.getFingerprint, "getFingerprint");

  // RASTGELE TÜRK İSMİ
  instance.getRandomTurkishName = function() {
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
    return names[Math.floor(Math.random() * names.length)];
  };
  __name(instance.getRandomTurkishName, "getRandomTurkishName");

  // DELAY FONKSİYONU
  instance.delay = function(ms) {
    debugLog(`⏳ [${instance.requestId}] ${ms}ms bekleniyor...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  __name(instance.delay, "delay");

  // XSRF TOKEN ALMA
  instance.getXsrfToken = async function(selectedHeaders) {
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
            debugLog(`✅ [${instance.requestId}] XSRF Token alındı`);
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
          debugLog(`✅ [${instance.requestId}] XSRF Token header'dan alındı`);
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
        debugLog(`🔢 [${instance.requestId}] OTP Kodu Bulundu`);
      } else {
        debugLog(`❌ [${instance.requestId}] OTP kodu bulunamadı`);
      }
      
      return otpCode;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] OTP Hatası:`, error.message);
      return null;
    }
  };
  __name(instance.getOtpCode, "getOtpCode");

  // POST REQUEST
  instance.makePostRequest = async function(url, body, xsrfToken, selectedHeaders, requestName = "POST") {
    debugLog(`🎯 [${instance.requestId}] ${requestName} isteği: ${url}`);
    
    const currentFingerprint = selectedHeaders.fingerprint || instance.getFingerprint();
    
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

  // ANA KAYIT FONKSİYONU
  instance.startRegistration = async function(email) {
    console.log(`🚀 [${instance.requestId}] KAYIT BAŞLATILIYOR - EMAIL:`, email);
    
    try {
      debugLog(`\n🔧 [${instance.requestId}] 1. ADIM: Cookie'ler yükleniyor...`);
      const cookieSuccess = await instance.getFreshCookies();
      if (!cookieSuccess) {
        throw new Error("Cookie'ler alınamadı");
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
      
      debugLog(`✅ [${instance.requestId}] OTP KODU HAZIR`);
      
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
      
      debugLog(`🎭 [${instance.requestId}] Kullanıcı bilgileri hazır`);
      
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
        
        return {
          success: true,
          email,
          password,
          name: `${firstName} ${lastName}`,
          accessToken: result3.data.data.accessToken,
          refreshToken: result3.data.data.refreshToken,
          requestId: instance.requestId
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
      debugLog(`🔄 [${instance.requestId}] İşlem tamamlandı`);
    }
  };
  __name(instance.startRegistration, "startRegistration");

  return instance;
}
__name(createIsolatedRegistration, "createIsolatedRegistration");

// PARALEL KAYIT FONKSİYONU
async function startParallelRegistrations(count, baseEmail = null) {
  console.log(`🎯 ${count} paralel kayıt başlatılıyor...`);
  
  const promises = [];
  
  for (let i = 0; i < count; i++) {
    const registration = createIsolatedRegistration();
    let email;
    
    if (baseEmail) {
      const [username, domain] = baseEmail.split("@");
      email = `${username}+${i}@${domain}`;
    } else {
      email = registration.getFormattedEmail();
    }
    
    promises.push(registration.startRegistration(email));
  }
  
  const results = await Promise.allSettled(promises);
  
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;
  
  return {
    total: count,
    successful,
    failed,
    results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason?.message || 'Bilinmeyen hata' })
  };
}
__name(startParallelRegistrations, "startParallelRegistrations");

// WORKER - HER İSTEK İÇİN YENİ İZOLE INSTANCE
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
    
    // TEK KAYIT
    if (url.pathname === "/register") {
      const registration = createIsolatedRegistration();
      
      try {
        const email = url.searchParams.get("email") || registration.getFormattedEmail();
        
        console.log("🎯 Yeni kayıt başlatılıyor:", email);
        
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
    
    // PARALEL KAYIT - /register-5, /register-10, vb.
    if (url.pathname.startsWith("/register-")) {
      try {
        const count = parseInt(url.pathname.split("-")[1]);
        
        if (isNaN(count) || count < 1 || count > 20) {
          return new Response(JSON.stringify({
            success: false,
            error: "Geçersiz sayı. 1-20 arası değer girin."
          }, null, 2), {
            status: 400,
            headers: { 
              "Content-Type": "application/json", 
              ...corsHeaders 
            }
          });
        }
        
        const baseEmail = url.searchParams.get("email");
        
        console.log(`🎯 ${count} paralel kayıt başlatılıyor...`);
        
        const result = await startParallelRegistrations(count, baseEmail);
        
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      } catch (error) {
        errorLog("💥 Paralel kayıt hatası:", error.message);
        
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
    
    // COOKIE TESTİ
    if (url.pathname === "/test-cookies") {
      const registration = createIsolatedRegistration();
      
      try {
        await registration.getCookies();
        
        return new Response(JSON.stringify({
          success: true,
          message: "Cookie testi tamamlandı",
          cookieCount: registration.cookies.size
        }, null, 2), {
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      } catch (error) {
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
    
    return new Response(JSON.stringify({
      message: "Hepsiburada Kayıt API - Paralel Versiyon",
      endpoints: {
        "/register": "Tek kayıt başlat",
        "/register-{n}": "n sayıda paralel kayıt (örn: /register-5)",
        "/register?email=test@email.com": "Özel email ile kayıt",
        "/register-5?email=test@email.com": "Özel email ile 5 paralel kayıt",
        "/test-cookies": "Cookie testi"
      },
      examples: {
        "single": "https://your-worker.workers.dev/register",
        "parallel_3": "https://your-worker.workers.dev/register-3", 
        "custom_email": "https://your-worker.workers.dev/register?email=test@domain.com",
        "parallel_custom": "https://your-worker.workers.dev/register-5?email=test@domain.com"
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
