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

// GELİŞMİŞ COOKIE YÖNETİMİ - PowerShell gibi
var globalCookies = /* @__PURE__ */ new Map(); // {name: {value, domain, path, secure, httpOnly}}
var isProcessing = false;

// Cookie API endpoint
const COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";

// Header sets - PowerShell'deki gibi
var HEADER_SETS = [
  {
    "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "SecCHUA": '"Chromium";v="120", "Google Chrome";v="120", "Not-A.Brand";v="8"',
    "SecCHUAMobile": "?0",
    "SecCHUAPlatform": '"Windows"',
    "Accept": "application/json, text/plain, */*",
    "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
  }
];

// GELİŞMİŞ COOKIE YÖNETİMİ - PowerShell WebSession gibi
async function getManualCookies() {
  console.log("👤 MANUEL COOKIE MODU AKTİF");
  
  // PowerShell'deki gibi tam cookie seti
  const cookieData = {"url":"https://giris.hepsiburada.com","cookies":[{"domain":".hepsiburada.com","expirationDate":1762334056.097171,"hostOnly":false,"httpOnly":true,"name":"AKA_A2","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"A"},{"domain":".hepsiburada.com","expirationDate":1762344856.097313,"hostOnly":false,"httpOnly":false,"name":"bm_sz","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"3AD70FF32177FF5FC5FF8DA7E85B26B0~YAAQn7Gvw7UnkTWaAQAAZbEUUx2IltPYShPwEAyW+6WKKjHZ6lzBxebmx1WS1O6oT58gpJgwb659sl8ef5t5SGiEHLxEdI7dOnuLh5PoM4J2D1oJm5cVjCvAKCuo6S3tM+O3Zm1pgu/6k/HPNwtKr6YOXMmoyyD1UJINhjduAUEfCIScVu59j+pICst0qwPFnuO1Q1yPX+I/LCmlnaD+sxkCBVclUmXJ3hvFcV6g4QGuNCiwO1W9SyQ01pgcmbiEQT4rPAdskRXvaxorxaRTGo6FRcUZoKKkTRA3towHOJy7RmZ+PRG/KbBB+Koy+CxJ4hE5b65SCkb1DaWCIA9KE1c00uAqMOGrynbRQ1Dupux1y0PEkOhqj1/n8c9iCzNa8hY860frwuhDqo77AtETEG/bkxQ=~3158595~3487792"},{"domain":".hepsiburada.com","hostOnly":false,"httpOnly":false,"name":"oidcReturnUrl","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"https%253A%252F%252Fwww.hepsiburada.com%252F"},{"domain":".hepsiburada.com","hostOnly":false,"httpOnly":false,"name":"ActivePage","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"PURE_LOGIN"},{"domain":".hepsiburada.com","expirationDate":1762935256.23178,"hostOnly":false,"httpOnly":false,"name":"hbus_anonymousId","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"23204095-266f-40bf-b908-95fc4b506cf4"},{"domain":".hepsiburada.com","expirationDate":1762935257.244036,"hostOnly":false,"httpOnly":false,"name":"hbus_sessionId","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"a21973a5-3539-4026-a2ec-011d0ff82110%7C1762332257243"},{"domain":".hepsiburada.com","expirationDate":1777882457.734906,"hostOnly":false,"httpOnly":false,"name":"_abck","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"20C3CDAF03C53F0DAF353B1B8C217FB8~0~YAAQn7Gvw5wokTWaAQAAyrcUUw6Cv3nX/Ia6AT/tVGVHlB6JljSJM+49Z1SGSuzARLcwFYwE3nFM0IcnA6zdVZT1xhSq+BxXtrVEn7YtWPpbjjxY5WZB66vm8M03i56ChuxjWTOukOUFuf8cKKyE4ll9JhqQltmnteJyENytkjXPeEPsBWzWOffPB/LhulT636Fsp5DhyN/gyJCXVSbb45ido7Zt3dmZP7bd5kc+yNx0M0Yyt7SCArbDSnijrG//iIx5hIb7RNxqsOvWhkNv/54etA4dNwceADC9IeEAPqSlcrBJizmv+V+SSMU8foNa9SWAUEg5hfWQvcrNGBjVjychJgZkHS8tJ4J9qMqCkppQpQjncjT8D3v0TDXTFujsXDVdEVstA/1BfdISLNezcjwLamwO8TTPn1BZvWU+Rzm1kkOUY3C0cWK6vZS6Ivx9VCvVUbpCggk9oVFTfbPU0TiVm8HUKDHKlVL9OUtbeIKU5xkKkxy4BUVNNoQNt8jPJaGU/zvmZrQHKb5qKHwdFlPTgZBwMFXbdj27CNN1oCzZu5wJdn8dfl+lQDH1pXJmEuhf1y3lv/L7kztE+QcZWqnuPXhgCELRGgB9gJ4wBBZ7WEvK444F70CMYzlyaQ78bg==~-1~-1~-1~AAQAAAAE%2f%2f%2f%2f%2f4hcyLyHoeu2rdCucG5xm+LbtmVwNoLQPSC42nemQ%2fEsKOp+Aj3irjKjBnpMJvsEQptfBaNX8remUULr1DjJ9ioi5kW4Gv5d2xp9~-1"}]};

  globalCookies.clear();
  
  console.log("📥 PowerShell-style cookie'ler yükleniyor...");
  
  // PowerShell gibi tüm cookie özelliklerini sakla
  cookieData.cookies.forEach(cookie => {
    if (cookie.name && cookie.value) {
      globalCookies.set(cookie.name, {
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate
      });
      console.log(`✅ ${cookie.name} [${cookie.domain}]`);
    }
  });
  
  console.log(`🎯 ${globalCookies.size} COOKIE YÜKLENDİ (PowerShell formatında)`);
  showCurrentCookies();
  return true;
}
__name(getManualCookies, "getManualCookies");

// POWERSELL GIBI DOMAIN-BASED COOKIE YÖNETİMİ - DÜZELTİLMİŞ
function getCookieHeaderForDomain(targetUrl) {
  try {
    const urlObj = new URL(targetUrl);
    const targetDomain = urlObj.hostname;
    const cookies = [];
    
    globalCookies.forEach((cookieData, name) => {
      if (shouldSendCookie(cookieData, targetDomain, targetUrl)) {
        cookies.push(`${name}=${cookieData.value}`);
      }
    });
    
    const header = cookies.join("; ");
    console.log(`🍪 COOKIE HEADER for ${targetDomain}: ${header.substring(0, 100)}...`);
    return header;
  } catch (error) {
    console.log("❌ URL parse hatası:", error.message);
    return "";
  }
}
__name(getCookieHeaderForDomain, "getCookieHeaderForDomain");

// POWERSELL GIBI COOKIE GÖNDERME KURALLARI - DÜZELTİLMİŞ
function shouldSendCookie(cookieData, targetDomain, targetUrl) {
  if (!cookieData.domain) return true;
  
  const cookieDomain = cookieData.domain;
  
  // .hepsiburada.com -> tüm subdomain'ler için
  if (cookieDomain.startsWith('.')) {
    return targetDomain.endsWith(cookieDomain) || targetDomain === cookieDomain.substring(1);
  }
  
  // Specific domain -> exact match
  return targetDomain === cookieDomain;
}
__name(shouldSendCookie, "shouldSendCookie");

// POWERSELL GIBI COOKIE GÜNCELLEME
function updateCookiesFromResponse(response, requestUrl) {
  const setCookieHeader = response.headers.get("set-cookie");
  if (!setCookieHeader) {
    console.log("📭 Set-Cookie header yok");
    return;
  }
  
  console.log("📨 Set-Cookie Header:", setCookieHeader);
  const cookies = setCookieHeader.split(/,\s*(?=\w+=)/);
  
  let updatedCount = 0;
  let addedCount = 0;
  
  cookies.forEach((cookieStr) => {
    const parts = cookieStr.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');
    
    if (name && value) {
      // PowerShell gibi cookie attributes parse et
      const cookieData = {
        value: value,
        domain: extractAttribute(attributes, 'domain') || new URL(requestUrl).hostname,
        path: extractAttribute(attributes, 'path') || '/',
        secure: attributes.some(attr => attr.toLowerCase() === 'secure'),
        httpOnly: attributes.some(attr => attr.toLowerCase() === 'httponly'),
        expirationDate: extractExpiration(attributes)
      };
      
      if (globalCookies.has(name)) {
        globalCookies.set(name, cookieData);
        console.log(`🔄 Cookie güncellendi: ${name}=${value.substring(0, 30)}...`);
        updatedCount++;
      } else {
        globalCookies.set(name, cookieData);
        console.log(`➕ Yeni cookie eklendi: ${name}=${value.substring(0, 30)}...`);
        addedCount++;
      }
    }
  });
  
  console.log(`✅ ${updatedCount} cookie güncellendi, ${addedCount} yeni cookie eklendi, toplam: ${globalCookies.size}`);
  showCurrentCookies();
}
__name(updateCookiesFromResponse, "updateCookiesFromResponse");

function extractAttribute(attributes, attrName) {
  const attr = attributes.find(a => a.toLowerCase().startsWith(attrName.toLowerCase() + '='));
  return attr ? attr.split('=')[1] : null;
}
__name(extractAttribute, "extractAttribute");

function extractExpiration(attributes) {
  const expiresAttr = attributes.find(a => a.toLowerCase().startsWith('expires='));
  if (expiresAttr) {
    const expiresValue = expiresAttr.split('=')[1];
    return new Date(expiresValue).getTime() / 1000;
  }
  return null;
}
__name(extractExpiration, "extractExpiration");

// COOKIE API - PowerShell'deki gibi
async function getFreshCookies(useManual = false) {
  console.log("🍪 Cookie'ler alınıyor...");
  globalCookies.clear();
  
  if (useManual) {
    return await getManualCookies();
  }
  
  console.log("🤖 Otomatik Cookie API modu");
  
  try {
    const response = await fetch(COOKIE_API_URL);
    if (!response.ok) throw new Error(`Cookie API hatası: ${response.status}`);
    
    const cookieData = await response.json();
    const setKeys = Object.keys(cookieData).filter(key => key.startsWith('set'));
    if (setKeys.length === 0) throw new Error("Cookie set bulunamadı");
    
    const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
    const selectedSet = cookieData[randomSetKey];
    
    console.log(`🎲 Seçilen cookie set: ${randomSetKey}, ${selectedSet.length} cookie`);
    
    // PowerShell gibi tüm cookie özelliklerini sakla
    selectedSet.forEach(cookie => {
      globalCookies.set(cookie.name, {
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: cookie.expirationDate
      });
    });
    
    console.log("✅ Cookie'ler başarıyla yüklendi, toplam:", globalCookies.size);
    showCurrentCookies();
    return true;
  } catch (error) {
    console.log("❌ Cookie alınamadı:", error.message);
    return false;
  }
}
__name(getFreshCookies, "getFreshCookies");

function showCurrentCookies() {
  console.log("🔍 MEVCUT COOKIE'LER (PowerShell formatında):");
  globalCookies.forEach((cookieData, name) => {
    const flags = [];
    if (cookieData.secure) flags.push("Secure");
    if (cookieData.httpOnly) flags.push("HttpOnly");
    if (cookieData.domain) flags.push(`Domain=${cookieData.domain}`);
    
    console.log(`   🍪 ${name}=${cookieData.value.substring(0, 30)}... [${flags.join(', ')}]`);
  });
  console.log(`📊 Toplam ${globalCookies.size} cookie`);
}
__name(showCurrentCookies, "showCurrentCookies");

// DİĞER FONKSİYONLAR - PowerShell'deki gibi
function getRandomHeaders() {
  const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
  const fingerprint = getFingerprint();
  
  return {
    ...baseSet,
    fingerprint: fingerprint
  };
}
__name(getRandomHeaders, "getRandomHeaders");

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

function getRandomTurkishName() {
  const names = [
    "Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", 
    "Yusuf", "Ömer", "Ramazan", "Muhammed", "Süleyman", "Halil", "Osman", "Fatih",
    "Emre", "Can", "Burak", "Serkan", "Murat", "Kemal", "Orhan", "Cemal", "Selim",
    "Cengiz", "Volkan", "Uğur", "Barış", "Onur", "Mert", "Tolga", "Erhan", "Sercan",
    "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Şerife", "Zehra",
    "Sultan", "Hanife", "Havva", "Zehra", "Rabia", "Hacer", "Yasemin", "Esra", "Seda",
    "Gamze", "Derya", "Pınar", "Burcu", "Cansu", "Ebru", "Gizem", "Aslı", "Sibel"
  ];
  const selected = names[Math.floor(Math.random() * names.length)];
  console.log("👤 RASTGELE İSİM:", selected);
  return selected;
}
__name(getRandomTurkishName, "getRandomTurkishName");

function delay(ms) {
  console.log(`⏳ ${ms}ms bekleniyor...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(delay, "delay");

// POWERSELL GIBI XSRF TOKEN ALMA
async function getXsrfToken(selectedHeaders) {
  console.log("🔄 XSRF Token alınıyor...");
  showCurrentCookies();
  
  const xsrfUrl = "https://oauth.hepsiburada.com/api/authenticate/xsrf-token";
  
  const headers = {
    "accept": selectedHeaders.Accept,
    "accept-language": selectedHeaders.AcceptLanguage,
    "origin": "https://giris.hepsiburada.com",
    "referer": "https://giris.hepsiburada.com/",
    "sec-ch-ua": selectedHeaders.SecCHUA,
    "sec-ch-ua-mobile": selectedHeaders.SecCHUAMobile,
    "sec-ch-ua-platform": selectedHeaders.SecCHUAPlatform,
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": selectedHeaders.UserAgent,
    "cookie": getCookieHeaderForDomain(xsrfUrl) // PowerShell gibi domain-based
  };
  
  try {
    const response = await fetch(xsrfUrl, { headers });
    console.log("📡 XSRF Response Status:", response.status);
    
    // PowerShell gibi cookie'leri güncelle
    updateCookiesFromResponse(response, xsrfUrl);
    
    const cookies = response.headers.get("set-cookie");
    let xsrfToken = null;
    
    if (cookies) {
      const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
      if (xsrfMatch) {
        xsrfToken = decodeURIComponent(xsrfMatch[1]);
        console.log("✅ XSRF Token alındı:", xsrfToken);
      }
    }
    
    return xsrfToken;
  } catch (error) {
    console.log("❌ XSRF Token hatası:", error.message);
    return null;
  }
}
__name(getXsrfToken, "getXsrfToken");

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
    }
    
    return otpCode;
  } catch (error) {
    console.log("❌ OTP Hatası:", error.message);
    return null;
  }
}
__name(getOtpCode, "getOtpCode");

// POWERSELL GIBI POST REQUEST
async function makePostRequest(url, body, xsrfToken, selectedHeaders) {
  console.log("🎯 POST isteği gönderiliyor:", url);
  showCurrentCookies();
  
  const currentFingerprint = selectedHeaders.fingerprint || getFingerprint();
  
  const headers = {
    "accept": selectedHeaders.Accept,
    "accept-language": selectedHeaders.AcceptLanguage,
    "content-type": "application/json",
    "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
    "fingerprint": currentFingerprint,
    "priority": "u=1, i",
    "sec-ch-ua": selectedHeaders.SecCHUA,
    "sec-ch-ua-mobile": selectedHeaders.SecCHUAMobile,
    "sec-ch-ua-platform": selectedHeaders.SecCHUAPlatform,
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "origin": "https://giris.hepsiburada.com",
    "referer": "https://giris.hepsiburada.com/",
    "user-agent": selectedHeaders.UserAgent,
    "cookie": getCookieHeaderForDomain(url) // PowerShell gibi domain-based
  };
  
  if (xsrfToken) {
    headers["x-xsrf-token"] = xsrfToken;
  }
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    
    console.log("📡 POST Response Status:", response.status);
    
    // PowerShell gibi cookie'leri güncelle
    updateCookiesFromResponse(response, url);
    
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { success: false, error: "Invalid JSON response", raw: responseText };
    }
    
    return {
      success: response.ok,
      data,
      status: response.status,
      fingerprint: currentFingerprint
    };
  } catch (error) {
    console.log("❌ POST Hatası:", error.message);
    return { success: false, error: error.message };
  }
}
__name(makePostRequest, "makePostRequest");

// ANA KAYIT FONKSİYONU - PowerShell'deki gibi
async function startRegistration(email, useManualCookies = false) {
  if (isProcessing) {
    return { success: false, error: "Zaten işlem devam ediyor" };
  }
  
  isProcessing = true;
  console.log("=".repeat(80));
  console.log("🚀 KAYIT BAŞLATILIYOR - EMAIL:", email);
  console.log("🔧 MOD:", useManualCookies ? "MANUEL COOKIE" : "OTOMATİK COOKIE");
  console.log("=".repeat(80));
  
  try {
    console.log("\n🔧 1. ADIM: PowerShell-style cookie'ler yükleniyor...");
    const cookieSuccess = await getFreshCookies(useManualCookies);
    if (!cookieSuccess) {
      throw new Error("Cookie'ler alınamadı");
    }
    
    const selectedHeaders = getRandomHeaders();
    console.log("✅ Headers hazır, fingerprint:", selectedHeaders.fingerprint);
    
    console.log("\n🔧 2. ADIM: 1. POST için XSRF Token alınıyor...");
    let xsrfToken1 = await getXsrfToken(selectedHeaders);
    if (!xsrfToken1) {
      throw new Error("1. XSRF Token alınamadı");
    }
    
    console.log("\n🔧 3. ADIM: Üyelik isteği gönderiliyor...");
    const postBody1 = {
      email,
      returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
    };
    
    const result1 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
      postBody1,
      xsrfToken1,
      selectedHeaders
    );
    
    if (!result1.success || !result1.data.success) {
      throw new Error(`1. POST başarısız: ${result1.data?.message || result1.error}`);
    }
    
    console.log("🎉 1. POST BAŞARILI - REFERENCE ID:", result1.data.data.referenceId);
    
    console.log("\n⏳ 4. ADIM: OTP email'inin gelmesi bekleniyor (15 saniye)...");
    await delay(15000);
    
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
      selectedHeaders
    );
    
    if (!result2.success || !result2.data.success || !result2.data.requestId) {
      throw new Error(`2. POST başarısız: ${result2.data?.message || result2.error}`);
    }
    
    console.log("🎉 2. POST BAŞARILI - REQUEST ID:", result2.data.requestId);
    
    console.log("\n⏳ 7. ADIM: Kayıt öncesi bekleniyor (3 saniye)...");
    await delay(3000);
    
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
      selectedHeaders
    );
    
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

var worker_default = {
  async fetch(request, env, ctx) {
    console.log("📥 Yeni request alındı:", request.method, request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    
    if (url.pathname === "/register") {
      try {
        const email = url.searchParams.get("email") || getFormattedEmail();
        const manualMode = url.searchParams.get("manual") === "true" || true;
        
        console.log("🎯 PowerShell-style kayıt başlatılıyor:");
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
          message: "PowerShell-style cookie testi tamamlandı",
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
      message: "Hepsiburada Otomatik Kayıt API - PowerShell-style",
      endpoints: {
        "/register": "Kayıt başlat (varsayılan manuel mod)",
        "/register?manual=false": "Otomatik cookie modu ile kayıt",
        "/test-cookies": "PowerShell-style cookie testi"
      },
      features: [
        "PowerShell gibi domain-based cookie management",
        "Secure/HttpOnly flag desteği", 
        "Path ve domain matching",
        "Otomatik cookie güncelleme",
        "Gerçek fingerprint yönetimi"
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
