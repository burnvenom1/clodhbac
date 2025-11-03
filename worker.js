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

var globalCookies = /* @__PURE__ */ new Map();
var isProcessing = false;

// Cookie API endpoint
const COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";
// RENDER API URL - proxy ayarlarını burada yapabilirsin
const RENDER_API_URL = "https://burnrndr.onrender.com/playwright-proxy-register";

// Header sets
var HEADER_SETS = [
  {
    "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
    "SecCHUA": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
    "SecCHUAMobile": "?0",
    "SecCHUAPlatform": '"Windows"',
    "Accept": "application/json, text/plain, */*",
    "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
  }
];

// Geliştirilmiş Cookie API'den cookie al
async function getFreshCookies() {
  console.log("🍪 Cookie API'den yeni cookie'ler alınıyor...");
  try {
    const response = await fetch(COOKIE_API_URL);
    if (!response.ok) {
      throw new Error(`Cookie API hatası: ${response.status}`);
    }
    
    const cookieData = await response.json();
    console.log("✅ Cookie verisi alındı, toplam set:", Object.keys(cookieData).length);
    
    // Rastgele bir set seç (set1'den set10'a kadar)
    const setKeys = Object.keys(cookieData).filter(key => key.startsWith('set'));
    if (setKeys.length === 0) {
      throw new Error("Cookie set bulunamadı");
    }
    
    const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
    const selectedSet = cookieData[randomSetKey];
    
    console.log(`🎲 Seçilen cookie set: ${randomSetKey}, ${selectedSet.length} cookie`);
    
    // Cookie'leri globalCookies'e ekle
    globalCookies.clear();
    selectedSet.forEach(cookie => {
      globalCookies.set(cookie.name, cookie.value);
      console.log(`🍪 ${cookie.name}=${cookie.value.substring(0, 20)}...`);
    });
    
    console.log("✅ Cookie'ler başarıyla yüklendi, toplam:", globalCookies.size);
    return true;
  } catch (error) {
    console.log("❌ Cookie alınamadı:", error.message);
    return false;
  }
}
__name(getFreshCookies, "getFreshCookies");

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
  console.log("   USERNAME:", username);
  console.log("   DOMAIN:", domain);
  
  return newEmail;
}
__name(getFormattedEmail, "getFormattedEmail");

// Geliştirilmiş Fingerprint fonksiyonu
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

function getCookieHeader() {
  const cookies = [];
  globalCookies.forEach((value, name) => {
    cookies.push(`${name}=${value}`);
  });
  const header = cookies.join("; ");
  console.log("🍪 COOKIE HEADER:", header.substring(0, 100) + "...");
  return header;
}
__name(getCookieHeader, "getCookieHeader");

// Geliştirilmiş Cookie güncelleme
function updateCookiesFromResponse(response) {
  const setCookieHeader = response.headers.get("set-cookie");
  if (!setCookieHeader) {
    console.log("📭 Set-Cookie header yok");
    return;
  }
  
  console.log("📨 Set-Cookie Header:", setCookieHeader);
  const cookies = setCookieHeader.split(/,\s*(?=\w+=)/);
  
  let updatedCount = 0;
  cookies.forEach((cookie) => {
    const [nameValue] = cookie.split(";");
    const [name, value] = nameValue.split("=");
    if (name && value) {
      globalCookies.set(name.trim(), value.trim());
      console.log(`🔄 Cookie güncellendi: ${name}=${value.substring(0, 30)}...`);
      updatedCount++;
    }
  });
  
  console.log(`✅ ${updatedCount} cookie güncellendi, toplam: ${globalCookies.size}`);
}
__name(updateCookiesFromResponse, "updateCookiesFromResponse");

async function getXsrfToken(selectedHeaders) {
  console.log("🔄 XSRF Token alınıyor...");
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
    "cookie": getCookieHeader()
  };
  
  console.log("📋 XSRF İstek Headers:", JSON.stringify(headers, null, 2));
  
  try {
    const response = await fetch("https://oauth.hepsiburada.com/api/authenticate/xsrf-token", {
      headers
    });
    
    console.log("📡 XSRF Response Status:", response.status);
    console.log("📋 XSRF Response Headers:", Object.fromEntries(response.headers));
    
    updateCookiesFromResponse(response);
    
    const cookies = response.headers.get("set-cookie");
    let xsrfToken = null;
    
    if (cookies) {
      const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
      if (xsrfMatch) {
        xsrfToken = decodeURIComponent(xsrfMatch[1]);
        console.log("✅ XSRF Token alındı:", xsrfToken);
      } else {
        console.log("❌ XSRF-TOKEN bulunamadı");
      }
    } else {
      console.log("❌ Set-Cookie header yok");
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
  console.log("🔗 OTP URL:", otpUrl);
  
  try {
    const response = await fetch(otpUrl, {
      redirect: "follow"
    });
    
    console.log("📨 OTP Response Status:", response.status);
    console.log("📋 OTP Response Headers:", Object.fromEntries(response.headers));
    
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
      console.log("❌ OTP kodu bulunamadı, raw response:", otpResponse);
    }
    
    return otpCode;
  } catch (error) {
    console.log("❌ OTP Hatası:", error.message);
    return null;
  }
}
__name(getOtpCode, "getOtpCode");

// Geliştirilmiş POST fonksiyonu
async function makePostRequest(url, body, xsrfToken, selectedHeaders) {
  console.log("🎯 POST isteği gönderiliyor:", url);
  
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
    "cookie": getCookieHeader()
  };
  
  if (xsrfToken) {
    headers["x-xsrf-token"] = xsrfToken;
  }
  
  console.log("📋 DETAYLI POST HEADERS:");
  console.log(JSON.stringify(headers, null, 2));
  
  console.log("📦 DETAYLI POST BODY:");
  console.log(JSON.stringify(body, null, 2));
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    
    console.log("📡 POST Response Status:", response.status);
    console.log("📋 POST Response Headers:", Object.fromEntries(response.headers));
    
    updateCookiesFromResponse(response);
    
    const responseText = await response.text();
    console.log("📄 POST Raw Response:", responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📊 POST Parsed Response:");
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("❌ JSON parse hatası:", e.message);
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

// Ana kayıt fonksiyonu
async function startRegistration(email) {
  if (isProcessing) {
    console.log("⏳ Zaten işlem devam ediyor...");
    return { success: false, error: "Zaten işlem devam ediyor" };
  }
  
  isProcessing = true;
  console.log("=".repeat(80));
  console.log("🚀 KAYIT BAŞLATILIYOR - EMAIL:", email);
  console.log("=".repeat(80));
  
  try {
    // Yeni cookie'leri API'den al
    console.log("\n🔧 1. ADIM: Cookie'ler alınıyor...");
    const cookieSuccess = await getFreshCookies();
    if (!cookieSuccess) {
      throw new Error("Cookie'ler alınamadı");
    }
    
    const selectedHeaders = getRandomHeaders();
    console.log("✅ Headers hazır, fingerprint:", selectedHeaders.fingerprint);
    
    // XSRF Token al
    console.log("\n🔧 2. ADIM: XSRF Token alınıyor...");
    let xsrfToken = await getXsrfToken(selectedHeaders);
    if (!xsrfToken) {
      throw new Error("XSRF Token alınamadı");
    }
    
    // 1. POST: Üyelik İsteği
    console.log("\n🔧 3. ADIM: Üyelik isteği gönderiliyor...");
    const postBody1 = {
      email,
      returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
    };
    
    const result1 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
      postBody1,
      xsrfToken,
      selectedHeaders
    );
    
    if (!result1.success || !result1.data.success) {
      throw new Error(`1. POST başarısız: ${result1.data?.message || result1.error}`);
    }
    
    console.log("🎉 1. POST BAŞARILI - REFERENCE ID:", result1.data.data.referenceId);
    
    // OTP için bekle
    console.log("\n⏳ 4. ADIM: OTP email'inin gelmesi bekleniyor (15 saniye)...");
    await delay(15000);
    
    // OTP Kodu al
    console.log("\n🔧 5. ADIM: OTP kodu alınıyor...");
    const otpCode = await getOtpCode(email);
    
    if (!otpCode) {
      throw new Error("OTP kodu alınamadı");
    }
    
    console.log("✅ OTP KODU HAZIR:", otpCode);
    
    // 2. POST: OTP Doğrulama
    console.log("\n🔧 6. ADIM: OTP doğrulama gönderiliyor...");
    
    // Yeni cookie ve token
    console.log("🔄 Yeni cookie'ler alınıyor...");
    await getFreshCookies();
    
    console.log("🔄 Yeni XSRF token alınıyor...");
    xsrfToken = await getXsrfToken(selectedHeaders);
    
    const postBody2 = {
      otpReference: result1.data.data.referenceId,
      otpCode
    };
    
    const result2 = await makePostRequest(
      "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
      postBody2,
      xsrfToken,
      selectedHeaders
    );
    
    if (!result2.success || !result2.data.success || !result2.data.requestId) {
      throw new Error(`2. POST başarısız: ${result2.data?.message || result2.error}`);
    }
    
    console.log("🎉 2. POST BAŞARILI - REQUEST ID:", result2.data.requestId);
    
    // Kısa bekleme
    console.log("\n⏳ 7. ADIM: Kayıt öncesi bekleniyor (3 saniye)...");
    await delay(3000);
    
// 3. POST: Kayıt Tamamlama - RENDER'A TÜM BİLGİLERİ GÖNDER
console.log("\n🔧 8. ADIM: Kayıt işlemi Render API'ye gönderiliyor...");

const firstName = getRandomTurkishName();
const lastName = getRandomTurkishName();
const password = "Hepsiburada1";

console.log("🎭 SON KULLANICI BİLGİLERİ:");
console.log("   👤 Ad:", firstName);
console.log("   👤 Soyad:", lastName);
console.log("   🔑 Şifre:", password);
console.log("   📨 Email:", email);
console.log("   🆔 RequestId:", result2.data.requestId);

// 🎯 RENDER API URL - EN BAŞTA TANIMLA (dosyanın başında)
const RENDER_API_URL = "https://burnrndr.onrender.com/proxy-register";

// 🎯 WORKER'IN TAM OLARAK KULLANDIĞI TÜM BİLGİLER
const renderPayload = {
  // POST Body - Worker'ın gönderdiği tam data
  postBody: {
    subscribeEmail: false,
    firstName,
    lastName,
    password,
    subscribeSms: false,
    returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=0fe1789b3dee47458bdf70864a6a9931&code_challenge=1y2GcO5myCuDr8SsID6yMQyi5ZE6I_A9sJhKwYEgnpU&code_challenge_method=S256&response_mode=query",
    requestId: result2.data.requestId
  },

  // 🎯 WORKER'IN KULLANDIĞI TÜM HEADERS - EKSİKSİZ
  headers: {
    "accept": selectedHeaders.Accept,
    "accept-language": selectedHeaders.AcceptLanguage,
    "content-type": "application/json",
    "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
    "fingerprint": selectedHeaders.fingerprint,
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
    "cookie": getCookieHeader(), // 🎯 GÜNCEL COOKIE HEADER
    "x-xsrf-token": xsrfToken // 🎯 GÜNCEL XSRF TOKEN
  },

  // 🎯 URL VE DİĞER BİLGİLER
  url: "https://oauth.hepsiburada.com/api/authenticate/register",
  method: "POST",

  // 🎯 COOKIE'LERİN TAM LISTESI (backup için)
  cookies: Array.from(globalCookies.entries()).map(([name, value]) => ({ 
    name, 
    value,
    domain: ".hepsiburada.com",
    path: "/"
  })),

  // 🎯 FINGERPRINT BİLGİSİ
  fingerprint: selectedHeaders.fingerprint,
  xsrfToken: xsrfToken
};

console.log("📤 Render API'ye gönderilen TAM BİLGİ:");
console.log("🎯 URL:", renderPayload.url);
console.log("📋 HEADERS:", JSON.stringify(renderPayload.headers, null, 2));
console.log("📦 BODY:", JSON.stringify(renderPayload.postBody, null, 2));
console.log("🍪 COOKIE COUNT:", renderPayload.cookies.length);
console.log("🔐 XSRF TOKEN:", renderPayload.xsrfToken);

// Render API'ye POST isteği gönder
try {
  const renderResponse = await fetch(RENDER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(renderPayload)
  });

  console.log("📡 Render Response Status:", renderResponse.status);
  
  const renderResult = await renderResponse.json();
  console.log("📊 Render API Sonucu:");
  console.log(JSON.stringify(renderResult, null, 2));

  if (renderResult.success) {
    console.log("🎉 🎉 🎉 KAYIT TAMAMEN BAŞARILI! 🎉 🎉 🎉");
    console.log("📧 Email:", email);
    console.log("🔑 Şifre:", password);
    console.log("👤 İsim:", `${firstName} ${lastName}`);
    console.log("🔑 Access Token:", renderResult.data?.accessToken?.substring(0, 50) + "...");
    
    return {
      success: true,
      email,
      password,
      name: `${firstName} ${lastName}`,
      accessToken: renderResult.data?.accessToken,
      refreshToken: renderResult.data?.refreshToken,
      via: "RENDER_PROXY"
    };
  } else {
    throw new Error(renderResult.error || "Render API kayıt başarısız");
  }
  
} catch (error) {
  console.log("❌ Render API hatası:", error.message);
  return { 
    success: false, 
    error: "Render API: " + error.message
  };
}
  } catch (error) {
    console.log("\n💥 💥 💥 GENEL HATA! 💥 💥 💥");
    console.log("Hata Mesajı:", error.message);
    console.log("Stack Trace:", error.stack);
    
    return { 
      success: false, 
      error: error.message,
      stack: error.stack
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
        console.log("🎯 Kayıt başlatılıyor, email:", email);
        
        const result = await startRegistration(email);
        console.log("📤 Kayıt sonucu gönderiliyor:", result.success);
        
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
          error: error.message,
          stack: error.stack
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
      message: "Hepsiburada Otomatik Kayıt API",
      endpoints: {
        "/register": "Kayıt başlat",
        "/register?email=test@example.com": "Belirli email ile kayıt"
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
//# sourceMappingURL=worker.js.map
