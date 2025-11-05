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
  "nqywhdnoh@emlhub.com",
  "048370crsm@freeml.net",
  "04837v1h98@freeml.net",
  "04838e039m@freeml.net",
  "04839mk808@freeml.net",
  "0483aa1zj4@freeml.net",
  "jy1c7eh2@mailpwr.com",
  "jy1kb68h@mailpwr.com",
  "jz6qk02m@mailpwr.com",
  "jz6ta9hn@mailpwr.com",
  "jz72a572@mailpwr.com",
  "jz74ndyw@mailpwr.com",
  "jz76sw1m@mailpwr.com",
  "manunasodun3@mimimail.me",
  "manun1kinyz3@mimimail.me",
  "manupefovuz3@mimimail.me",
  "manup0lutuj2@mimimail.me",
  "manusyk1taw2@mimimail.me",
  "manutinajyl3@mimimail.me",
  "manut0sepem3@mimimail.me",
  "lozydozajid2@10mail.xyz",
  "hiwemubadom2@10mail.xyz",
  "mobeliv1myn3@10mail.xyz",
  "mymib0sejyz2@10mail.xyz",
  "bohel1meken3@10mail.xyz",
  "b0togovojev2@10mail.xyz",
  "guv1s0f0tak2@10mail.xyz",
  "ahmcemzni@10mail.org",
  "ahmcffaeh@10mail.org",
  "ahmcfwpfd@10mail.org",
  "ahmcgaohd@10mail.org",
  "ahmcgiwye@10mail.org",
  "ahmcgoyfv@10mail.org",
  "ahmchfabm@10mail.org",
  "ahbzmfiun@yomail.info",
  "ahbzmxpoh@yomail.info",
  "ahbznddyb@yomail.info",
  "ahbznefnq@yomail.info",
  "ahbzognth@yomail.info",
  "ahbzoofgb@yomail.info",
  "ahbzoznkl@yomail.info",
  "jwjavzvej@emltmp.com",
  "iycfyzvej@emltmp.com",
  "aymjdawej@emltmp.com",
  "hcfuhawej@emltmp.com",
  "ztotqawej@emltmp.com",
  "bekxwawej@emltmp.com",
  "axhbbbwej@emltmp.com",
  "rhhzbqmgi@emlpro.com",
  "vcfdhqmgi@emlpro.com",
  "utcpmqmgi@emlpro.com",
  "hqnjtqmgi@emlpro.com",
  "qvkpyqmgi@emlpro.com",
  "jdawermgi@emlpro.com",
  "khhonrmgi@emlpro.com",
  "qwxugbxai@emlhub.com",
  "fejqjbxai@emlhub.com",
  "fjkwmbxai@emlhub.com",
  "tgyspbxai@emlhub.com",
  "pzbesbxai@emlhub.com",
  "qqkqubxai@emlhub.com",
  "tnglxbxai@emlhub.com",
  "04dndf7ps8@spymail.one",
  "04dndhs6fc@spymail.one",
  "04dndn5tw4@spymail.one",
  "04dndsn43c@spymail.one",
  "04dndz9z90@spymail.one",
  "04dne23ncg@spymail.one",
  "04dnebnewg@spymail.one"
];

// GELİŞMİŞ COOKIE YÖNETİMİ
var globalCookies = /* @__PURE__ */ new Map();
var isProcessing = false;
const COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";

// GERÇEKÇİ HEADER SETLERİ
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

// AKILLI COOKIE PARSING - TÜM COOKIE'LER İÇİN
function parseCookieString(cookieStr, defaultDomain) {
  console.log("🔧 COOKIE PARSING:", cookieStr);
  
  try {
    const parts = cookieStr.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');
    
    if (!name || !value) {
      console.log("❌ Geçersiz cookie formatı");
      return null;
    }
    
    // DEFAULT DEĞERLER - AKILLI
    const cookieData = {
      value: value,
      domain: defaultDomain,
      path: '/',
      secure: false,
      httpOnly: false,
      sameSite: 'Lax',
      expirationDate: null
    };
    
    // ATTRIBUTE'LERİ PARSE ET
    attributes.forEach(attr => {
      const lowerAttr = attr.toLowerCase();
      
      if (lowerAttr.startsWith('domain=')) {
        cookieData.domain = attr.split('=')[1];
      } else if (lowerAttr.startsWith('path=')) {
        cookieData.path = attr.split('=')[1];
      } else if (lowerAttr.startsWith('expires=')) {
        const expiresValue = attr.split('=')[1];
        const expiresDate = new Date(expiresValue);
        if (!isNaN(expiresDate.getTime())) {
          cookieData.expirationDate = expiresDate.getTime() / 1000;
        }
      } else if (lowerAttr.startsWith('max-age=')) {
        const maxAge = parseInt(attr.split('=')[1]);
        if (!isNaN(maxAge)) {
          cookieData.expirationDate = Date.now() / 1000 + maxAge;
        }
      } else if (lowerAttr === 'secure') {
        cookieData.secure = true;
      } else if (lowerAttr === 'httponly') {
        cookieData.httpOnly = true;
      } else if (lowerAttr.startsWith('samesite=')) {
        cookieData.sameSite = attr.split('=')[1];
      }
    });
    
    // DOMAIN OTOMATİK DÜZELTME
    if (!cookieData.domain || cookieData.domain === defaultDomain) {
      if (defaultDomain.includes('hepsiburada.com')) {
        cookieData.domain = '.hepsiburada.com';
      }
    }
    
    // SECURE FLAG OTOMATİK DÜZELTME
    if (defaultDomain.includes('hepsiburada.com')) {
      cookieData.secure = true;
    }
    
    console.log("✅ PARSED COOKIE:", {
      name: name,
      value: value.substring(0, 20) + '...',
      domain: cookieData.domain,
      path: cookieData.path,
      secure: cookieData.secure,
      httpOnly: cookieData.httpOnly,
      sameSite: cookieData.sameSite,
      expires: cookieData.expirationDate ? new Date(cookieData.expirationDate * 1000).toISOString() : 'Session'
    });
    
    return { name, data: cookieData };
  } catch (error) {
    console.log("❌ Cookie parsing hatası:", error.message);
    return null;
  }
}
__name(parseCookieString, "parseCookieString");

// API COOKIE'LERİ MANUEL GİBİ İŞLEME
async function getManualCookies() {
  console.log("👤 API COOKIE MODU AKTİF");
  
  try {
    const response = await fetch(COOKIE_API_URL);
    if (!response.ok) throw new Error(`Cookie API hatası: ${response.status}`);
    
    const cookieData = await response.json();
    console.log("📊 API Response anahtarları:", Object.keys(cookieData));
    
    let cookiesArray;
    
    if (cookieData.set1 && Array.isArray(cookieData.set1)) {
      const setKeys = Object.keys(cookieData).filter(key => key.startsWith('set'));
      console.log(`🔍 Bulunan setler: ${setKeys.join(', ')}`);
      
      if (setKeys.length === 0) throw new Error("Cookie set bulunamadı");
      
      const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
      cookiesArray = cookieData[randomSetKey];
      console.log(`🎲 Seçilen cookie set: ${randomSetKey}, ${cookiesArray.length} cookie`);
    } 
    else if (Array.isArray(cookieData)) {
      cookiesArray = cookieData;
      console.log(`📥 API'den ${cookiesArray.length} cookie alındı (eski format)`);
    } else {
      throw new Error(`API formatı beklenmiyor: ${typeof cookieData}`);
    }
    
    globalCookies.clear();
    
    console.log("📥 API cookie'leri manuel formatında yükleniyor...");
    
    cookiesArray.forEach(cookie => {
      if (cookie.name && cookie.value) {
        // API COOKIE'LERİNİ DOĞRU FORMATLA
        const cookieData = {
          value: cookie.value,
          domain: cookie.domain || '.hepsiburada.com',
          path: cookie.path || '/',
          secure: cookie.secure || true,
          httpOnly: cookie.httpOnly || false,
          sameSite: cookie.sameSite || 'Lax',
          expirationDate: cookie.expires || cookie.expirationDate
        };
        
        globalCookies.set(cookie.name, cookieData);
        console.log(`✅ ${cookie.name} = ${cookie.value.substring(0, 30)}...`);
      }
    });
    
    console.log(`🎯 ${globalCookies.size} COOKIE YÜKLENDİ (API → Manuel format)`);
    showCurrentCookies();
    return true;
    
  } catch (error) {
    console.log("❌ API'den cookie alınamadı:", error.message);
    return false;
  }
}
__name(getManualCookies, "getManualCookies");

// COOKIE HEADER OLUŞTURMA - AKILLI
function getCookieHeaderForDomain(targetUrl) {
  try {
    const urlObj = new URL(targetUrl);
    const targetDomain = urlObj.hostname;
    const cookies = [];
    
    console.log(`🔍 COOKIE HEADER OLUŞTURMA: ${targetDomain}`);
    console.log(`   Mevcut cookie sayısı: ${globalCookies.size}`);
    
    globalCookies.forEach((cookieData, name) => {
      const shouldSend = shouldSendCookie(cookieData, targetDomain, targetUrl);
      console.log(`   ${shouldSend ? '✅' : '❌'} ${name} = ${cookieData.value.substring(0, 20)}... (domain: ${cookieData.domain})`);
      
      if (shouldSend) {
        cookies.push(`${name}=${cookieData.value}`);
      }
    });
    
    const header = cookies.join("; ");
    console.log(`🍪 SON COOKIE HEADER: ${header}`);
    return header;
  } catch (error) {
    console.log("❌ URL parse hatası:", error.message);
    return "";
  }
}
__name(getCookieHeaderForDomain, "getCookieHeaderForDomain");

// COOKIE GÖNDERME KURALLARI - GELİŞMİŞ
function shouldSendCookie(cookieData, targetDomain, targetUrl) {
  if (!cookieData.domain) return true;
  
  const cookieDomain = cookieData.domain.replace(/^\./, '');
  const cleanTargetDomain = targetDomain.replace(/^\./, '');
  
  // AYNI DOMAIN
  if (cookieDomain === cleanTargetDomain) {
    return true;
  }
  
  // SUBDOMAIN
  if (cleanTargetDomain.endsWith('.' + cookieDomain)) {
    return true;
  }
  
  // PARENT DOMAIN (.hepsiburada.com → oauth.hepsiburada.com)
  if (cookieDomain.startsWith('.') && cleanTargetDomain.endsWith(cookieDomain)) {
    return true;
  }
  
  return false;
}
__name(shouldSendCookie, "shouldSendCookie");

// COOKIE GÜNCELLEME - AKILLI
function updateCookiesFromResponse(response, requestUrl) {
  const setCookieHeader = response.headers.get("set-cookie");
  if (!setCookieHeader) {
    console.log("📭 Set-Cookie header YOK");
    return;
  }
  
  console.log("📨 Set-Cookie Header ALINDI:", setCookieHeader);
  
  const cookies = setCookieHeader.split(/,\s*(?=[^;]+=)/);
  console.log(`🔍 Ayrılan cookie sayısı: ${cookies.length}`);
  
  let updatedCount = 0;
  let addedCount = 0;
  
  cookies.forEach((cookieStr, index) => {
    console.log(`\n🍪 Cookie ${index + 1}: ${cookieStr}`);
    
    const parsed = parseCookieString(cookieStr, new URL(requestUrl).hostname);
    
    if (parsed && parsed.name && parsed.data) {
      const { name, data } = parsed;
      
      if (globalCookies.has(name)) {
        const oldValue = globalCookies.get(name).value;
        globalCookies.set(name, data);
        console.log(`   🔄 Cookie GÜNCELLENDİ: ${name}`);
        console.log(`      ESKİ: ${oldValue.substring(0, 30)}...`);
        console.log(`      YENİ: ${data.value.substring(0, 30)}...`);
        updatedCount++;
      } else {
        globalCookies.set(name, data);
        console.log(`   ➕ YENİ Cookie EKLENDİ: ${name}`);
        addedCount++;
      }
    } else {
      console.log(`   ❌ Geçersiz cookie: ${cookieStr}`);
    }
  });
  
  console.log(`\n✅ ${updatedCount} cookie güncellendi, ${addedCount} yeni cookie eklendi, TOPLAM: ${globalCookies.size}`);
  showCurrentCookies();
}
__name(updateCookiesFromResponse, "updateCookiesFromResponse");

// COOKIE API
async function getFreshCookies(useManual = false) {
  console.log("🍪 Cookie'ler alınıyor...");
  globalCookies.clear();
  
  console.log("🤖 API Cookie Modu (Manuel gibi işleniyor)");
  return await getManualCookies();
}
__name(getFreshCookies, "getFreshCookies");

// COOKIE GÖSTERME - DETAYLI
function showCurrentCookies() {
  console.log("\n🔍 📋 MEVCUT COOKIE LİSTESİ:");
  console.log("═".repeat(80));
  
  globalCookies.forEach((cookieData, name) => {
    const flags = [];
    if (cookieData.secure) flags.push("Secure");
    if (cookieData.httpOnly) flags.push("HttpOnly");
    
    console.log(`   🍪 ${name}`);
    console.log(`      📍 Value: ${cookieData.value.substring(0, 50)}...`);
    console.log(`      🌐 Domain: ${cookieData.domain}`);
    console.log(`      📁 Path: ${cookieData.path}`);
    console.log(`      🚩 Flags: ${flags.join(', ') || 'None'}`);
    console.log(`      🔒 SameSite: ${cookieData.sameSite}`);
    console.log(`      ⏰ Expires: ${cookieData.expirationDate ? new Date(cookieData.expirationDate * 1000).toISOString() : 'Session'}`);
    console.log("   ──────────────────────────────────────────────────────────");
  });
  
  console.log(`📊 TOPLAM ${globalCookies.size} COOKIE`);
  console.log("═".repeat(80));
}
__name(showCurrentCookies, "showCurrentCookies");

// RANDOM HEADER GENERATOR
function getRandomHeaders() {
  const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
  const fingerprint = getFingerprint();
  
  const headers = {
    ...baseSet,
    fingerprint: fingerprint
  };
  
  console.log("🎭 SEÇİLEN HEADER SET:");
  console.log("   👤 User-Agent:", headers.UserAgent);
  console.log("   📍 Platform:", headers.SecCHUAPlatform);
  console.log("   🌐 Language:", headers.AcceptLanguage);
  console.log("   🆔 Fingerprint:", headers.fingerprint);
  
  return headers;
}
__name(getRandomHeaders, "getRandomHeaders");

// EMAIL FORMATLAMA
function getFormattedEmail() {
  const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
  const [username, domain] = baseEmail.split("@");
  const random1 = Math.random().toString(36).substring(2, 5);
  const random2 = Math.random().toString(36).substring(2, 5);
  const newEmail = `${username}.${random1}@${random2}.${domain}`;
  
  console.log("📧 EMAIL DETAY:");
  console.log("   ORİJİNAL:", baseEmail);
  console.log("   FORMATLI:", newEmail);
  
  return newEmail;
}
__name(getFormattedEmail, "getFormattedEmail");

// FINGERPRINT OLUŞTURMA
function getFingerprint() {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  console.log("🆕 YENİ FINGERPRINT:", uuid);
  return uuid;
}
__name(getFingerprint, "getFingerprint");

// RASTGELE TÜRK İSMİ
function getRandomTurkishName() {
  const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
  const selected = names[Math.floor(Math.random() * names.length)];
  console.log("👤 RASTGELE İSİM:", selected);
  return selected;
}
__name(getRandomTurkishName, "getRandomTurkishName");

// DELAY FONKSİYONU
function delay(ms) {
  console.log(`⏳ ${ms}ms bekleniyor...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(delay, "delay");

// XSRF TOKEN ALMA - GELİŞMİŞ
async function getXsrfToken(selectedHeaders) {
  console.log("\n" + "🔄".repeat(40));
  console.log("🔄 XSRF TOKEN ALMA BAŞLIYOR");
  console.log("🔄".repeat(40));
  
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
  
  const cookieHeader = getCookieHeaderForDomain(xsrfUrl);
  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
    console.log("🍪 Cookie Header eklendi");
  }
  
  if (selectedHeaders.SecCHUA) {
    headers["sec-ch-ua"] = selectedHeaders.SecCHUA;
    headers["sec-ch-ua-mobile"] = selectedHeaders.SecCHUAMobile;
    headers["sec-ch-ua-platform"] = selectedHeaders.SecCHUAPlatform;
    console.log("🔧 Sec-CH-UA headers eklendi");
  }
  
  console.log("📡 XSRF Token isteği gönderiliyor...");
  
  try {
    const response = await fetch(xsrfUrl, { 
      method: 'GET',
      headers 
    });
    
    console.log("📡 XSRF Response Status:", response.status);
    console.log("📡 XSRF Response OK:", response.ok);
    
    updateCookiesFromResponse(response, xsrfUrl);
    
    let xsrfToken = null;
    
    if (response.ok) {
      try {
        const responseData = await response.json();
        console.log("📄 XSRF Response Body:", JSON.stringify(responseData).substring(0, 200) + "...");
        
        if (responseData && responseData.token) {
          xsrfToken = responseData.token;
          console.log("✅ XSRF Token alındı (body):", xsrfToken.substring(0, 50) + "...");
        }
      } catch (e) {
        console.log("❌ XSRF Response JSON parse hatası:", e.message);
      }
    }
    
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader && !xsrfToken) {
      const xsrfMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
      if (xsrfMatch) {
        xsrfToken = decodeURIComponent(xsrfMatch[1]);
        console.log("✅ XSRF Token alındı (header):", xsrfToken.substring(0, 50) + "...");
      }
    }
    
    if (!xsrfToken) {
      console.log("❌ XSRF Token BULUNAMADI");
    } else {
      console.log("🎯 KULLANILACAK XSRF TOKEN:", xsrfToken.substring(0, 50) + "...");
    }
    
    console.log("🔄".repeat(40));
    console.log("🔄 XSRF TOKEN ALMA TAMAMLANDI");
    console.log("🔄".repeat(40));
    
    return xsrfToken;
  } catch (error) {
    console.log("❌ XSRF Token hatası:", error.message);
    return null;
  }
}
__name(getXsrfToken, "getXsrfToken");

// OTP KODU ALMA
async function getOtpCode(email) {
  const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${encodeURIComponent(email)}&mode=0`;
  console.log("📱 OTP Kodu alınıyor...");
  
  try {
    const response = await fetch(otpUrl, { redirect: "follow" });
    const otpResponse = await response.text();
    console.log("📄 OTP Response Body:", otpResponse);
    
    let otpCode = null;
    const match = otpResponse.match(/\b\d{6}\b/);
    
    if (match) {
      otpCode = match[0];
    } else if (/^\d{6}$/.test(otpResponse.trim())) {
      otpCode = otpResponse.trim();
    }
    
    if (otpCode) {
      console.log("🔢 OTP Kodu Bulundu:", otpCode);
    } else {
      console.log("❌ OTP kodu bulunamadı");
    }
    
    return otpCode;
  } catch (error) {
    console.log("❌ OTP Hatası:", error.message);
    return null;
  }
}
__name(getOtpCode, "getOtpCode");

// POST REQUEST - GELİŞMİŞ
async function makePostRequest(url, body, xsrfToken, selectedHeaders, requestName = "POST") {
  console.log("\n" + "🎯".repeat(40));
  console.log(`🎯 ${requestName} İSTEĞİ BAŞLIYOR`);
  console.log("🎯".repeat(40));
  
  console.log(`📮 URL: ${url}`);
  console.log(`📦 Body:`, JSON.stringify(body).substring(0, 200) + "...");
  console.log(`🔐 XSRF Token: ${xsrfToken ? xsrfToken.substring(0, 50) + "..." : "YOK"}`);
  
  const currentFingerprint = selectedHeaders.fingerprint || getFingerprint();
  
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
  
  const cookieHeader = getCookieHeaderForDomain(url);
  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
    console.log("🍪 Cookie Header eklendi");
  }
  
  if (selectedHeaders.SecCHUA) {
    headers["sec-ch-ua"] = selectedHeaders.SecCHUA;
    headers["sec-ch-ua-mobile"] = selectedHeaders.SecCHUAMobile;
    headers["sec-ch-ua-platform"] = selectedHeaders.SecCHUAPlatform;
    console.log("🔧 Sec-CH-UA headers eklendi");
  }
  
  if (xsrfToken) {
    headers["x-xsrf-token"] = xsrfToken;
    console.log("🔐 XSRF Token header'a eklendi");
  }
  
  console.log("📤 POST isteği gönderiliyor...");
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    
    console.log("📡 POST Response Status:", response.status);
    console.log("📡 POST Response OK:", response.ok);
    
    updateCookiesFromResponse(response, url);
    
    const responseText = await response.text();
    console.log("📄 POST Response Body:", responseText.substring(0, 500) + "...");
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📊 POST Response JSON:", JSON.stringify(data).substring(0, 300) + "...");
    } catch (e) {
      data = { success: false, error: "Invalid JSON response", raw: responseText };
      console.log("❌ POST Response JSON parse hatası");
    }
    
    const result = {
      success: response.ok,
      data,
      status: response.status,
      fingerprint: currentFingerprint
    };
    
    console.log("🎯".repeat(40));
    console.log(`🎯 ${requestName} İSTEĞİ TAMAMLANDI`);
    console.log("🎯".repeat(40));
    
    return result;
  } catch (error) {
    console.log("❌ POST Hatası:", error.message);
    return { success: false, error: error.message };
  }
}
__name(makePostRequest, "makePostRequest");

// ANA KAYIT FONKSİYONU - GELİŞMİŞ
async function startRegistration(email, useManualCookies = false) {
  if (isProcessing) {
    return { success: false, error: "Zaten işlem devam ediyor" };
  }
  
  isProcessing = true;
  console.log("=".repeat(80));
  console.log("🚀 AKILLI COOKIE SİSTEMİ İLE KAYIT BAŞLATILIYOR");
  console.log("📧 Email:", email);
  console.log("=".repeat(80));
  
  try {
    console.log("\n🔧 1. ADIM: Akıllı cookie yükleme...");
    const cookieSuccess = await getFreshCookies(useManualCookies);
    if (!cookieSuccess) {
      throw new Error("Cookie'ler alınamadı");
    }
    
    const selectedHeaders = getRandomHeaders();
    
    console.log("\n🔧 2. ADIM: 1. POST için XSRF Token alınıyor...");
    let xsrfToken1 = await getXsrfToken(selectedHeaders);
    if (!xsrfToken1) {
      throw new Error("1. XSRF Token alınamadı");
    }
    
    console.log("\n🔧 3. ADIM: 1. POST - Üyelik isteği...");
    const postBody1 = {
      email,
      returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
    };
    
    const result1 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
      postBody1,
      xsrfToken1,
      selectedHeaders,
      "1. POST - Üyelik İsteği"
    );
    
    console.log("📊 1. POST DETAYLI SONUÇ:", result1);
    
    if (!result1.success || !result1.data?.success) {
      throw new Error(`1. POST başarısız: ${result1.data?.message || result1.error || 'Bilinmeyen hata'}`);
    }
    
    console.log("🎉 1. POST BAŞARILI - REFERENCE ID:", result1.data.data.referenceId);
    
    console.log("\n⏳ 4. ADIM: OTP email'inin gelmesi bekleniyor (20 saniye)...");
    await delay(20000);
    
    console.log("\n🔧 5. ADIM: OTP kodu alınıyor...");
    const otpCode = await getOtpCode(email);
    
    if (!otpCode) {
      throw new Error("OTP kodu alınamadı");
    }
    
    console.log("✅ OTP KODU HAZIR:", otpCode);
    
    console.log("\n🔧 6. ADIM: 2. POST için YENİ XSRF Token alınıyor...");
    let xsrfToken2 = await getXsrfToken(selectedHeaders);
    if (!xsrfToken2) {
      throw new Error("2. XSRF Token alınamadı");
    }
    
    const postBody2 = {
      otpReference: result1.data.data.referenceId,
      otpCode
    };
    
    const result2 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
      postBody2,
      xsrfToken2,
      selectedHeaders,
      "2. POST - OTP Doğrulama"
    );
    
    console.log("📊 2. POST DETAYLI SONUÇ:", result2);
    
    if (!result2.success || !result2.data?.success || !result2.data.requestId) {
      throw new Error(`2. POST başarısız: ${result2.data?.message || result2.error || 'Bilinmeyen hata'}`);
    }
    
    console.log("🎉 2. POST BAŞARILI - REQUEST ID:", result2.data.requestId);
    
    console.log("\n⏳ 7. ADIM: Kayıt öncesi bekleniyor (5 saniye)...");
    await delay(5000);
    
    console.log("\n🔧 8. ADIM: 3. POST için YENİ XSRF Token alınıyor...");
    let xsrfToken3 = await getXsrfToken(selectedHeaders);
    if (!xsrfToken3) {
      throw new Error("3. XSRF Token alınamadı");
    }
    
    const firstName = getRandomTurkishName();
    const lastName = getRandomTurkishName();
    const password = "Hepsiburada1";
    
    console.log("🎭 SON KULLANICI BİLGİLERİ:");
    console.log("   👤 Ad:", firstName);
    console.log("   👤 Soyad:", lastName);
    console.log("   🔑 Şifre:", password);
    console.log("   📨 Email:", email);
    
    const postBody3 = {
      subscribeEmail: true,
      firstName,
      lastName,
      password,
      subscribeSms: true,
      returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query",
      requestId: result2.data.requestId
    };
    
    const result3 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/authenticate/register",
      postBody3,
      xsrfToken3,
      selectedHeaders,
      "3. POST - Kayıt Tamamlama"
    );
    
    console.log("📊 3. POST DETAYLI SONUÇ:", result3);
    
    console.log("\n" + "=".repeat(80));
    if (result3.success && result3.data?.success) {
      console.log("🎉 🎉 🎉 KAYIT TAMAMEN BAŞARILI! 🎉 🎉 🎉");
      console.log("📧 Email:", email);
      console.log("🔑 Şifre:", password);
      console.log("👤 İsim:", `${firstName} ${lastName}`);
      
      return {
        success: true,
        email,
        password,
        name: `${firstName} ${lastName}`,
        accessToken: result3.data.data.accessToken,
        refreshToken: result3.data.data.refreshToken,
        mode: useManualCookies ? "manual" : "auto"
      };
    } else {
      console.log("❌ ❌ ❌ KAYIT BAŞARISIZ! ❌ ❌ ❌");
      console.log("📊 Hata Detayı:", result3.data?.message || result3.error);
      
      return { 
        success: false, 
        error: result3.data?.message || "Kayıt başarısız",
        mode: useManualCookies ? "manual" : "auto"
      };
    }
    
  } catch (error) {
    console.log("\n💥 💥 💥 GENEL HATA! 💥 💥 💥");
    console.log("Hata Mesajı:", error.message);
    
    return { 
      success: false, 
      error: error.message,
      mode: useManualCookies ? "manual" : "auto"
    };
  } finally {
    isProcessing = false;
    console.log("\n🔄 İşlem durumu sıfırlandı");
    console.log("=".repeat(80));
  }
}
__name(startRegistration, "startRegistration");

// WORKER
var worker_default = {
  async fetch(request, env, ctx) {
    console.log("📥 Yeni request alındı:", request.method, request.url);
    
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
      try {
        const email = url.searchParams.get("email") || getFormattedEmail();
        const manualMode = url.searchParams.get("manual") === "true" || true;
        
        console.log("🎯 AKILLI COOKIE SİSTEMİ İLE KAYIT BAŞLATILIYOR:");
        console.log("   📧 Email:", email);
        console.log("   🔧 Mod:", manualMode ? "MANUEL" : "OTOMATİK");
        
        const result = await startRegistration(email, manualMode);
        
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          }
        });
      } catch (error) {
        console.log("💥 API hatası:", error.message);
        
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
      try {
        await getManualCookies();
        
        return new Response(JSON.stringify({
          success: true,
          message: "Akıllı cookie testi tamamlandı",
          cookieCount: globalCookies.size,
          cookies: Array.from(globalCookies.entries())
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
      message: "Hepsiburada Otomatik Kayıt API - AKILLI COOKIE SİSTEMİ",
      endpoints: {
        "/register": "Akıllı cookie sistemi ile kayıt başlat",
        "/test-cookies": "Cookie testi"
      },
      features: [
        "✅ Akıllı cookie parsing - otomatik format düzeltme",
        "✅ Domain otomatik düzeltme - .hepsiburada.com",
        "✅ Secure flag otomatik ekleme",
        "✅ Tüm cookie attribute'leri doğru işleme",
        "✅ API cookie'leri doğru formatlama",
        "✅ Gelişmiş cookie gönderme kuralları",
        "✅ Detaylı logging ve debug"
      ]
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
