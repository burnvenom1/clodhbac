var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var EMAIL_LIST = [
  "jihpngpnd@emlhub.com",
  "tmrzfanje@emlpro.com",
  "wiraypzse@emlpro.com",
  "lnmwhbvvf@emltmp.com",
  "bshuzcvvf@emltmp.com",
  "hsfsqxcug@emltmp.com",
  "nqywhdnoh@emlhub.com"
];
var COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";
var DEBUG_MODE = true;

function debugLog(...args) {
  if (DEBUG_MODE) console.log(...args);
}
__name(debugLog, "debugLog");
__name2(debugLog, "debugLog");

function errorLog(...args) {
  console.error('❌', ...args);
}
__name(errorLog, "errorLog");
__name2(errorLog, "errorLog");

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

function createIsolatedRegistration() {
  const instance = {};
  instance.cookies = /* @__PURE__ */ new Map();
  instance.requestId = Math.random().toString(36).substring(2, 15);
  instance._fingerprint = null;
  
  instance.extractAttribute = function(attributes, attrName) {
    const attr = attributes.find((a) => a.toLowerCase().startsWith(attrName.toLowerCase() + "="));
    return attr ? attr.split("=")[1] : null;
  };
  __name2(instance.extractAttribute, "extractAttribute");

  instance.extractSameSite = function(attributes) {
    const sameSiteAttr = attributes.find((a) => a.toLowerCase().startsWith("samesite="));
    if (sameSiteAttr) {
      const value = sameSiteAttr.split("=")[1].toLowerCase();
      if (value === "none") return "None";
      if (value === "strict") return "Strict";
      if (value === "lax") return "Lax";
    }
    return "Lax";
  };
  __name2(instance.extractSameSite, "extractSameSite");

  instance.extractExpiration = function(attributes) {
    const expiresAttr = attributes.find((a) => a.toLowerCase().startsWith("expires="));
    if (expiresAttr) {
      const expiresDate = new Date(expiresAttr.split("=")[1]);
      if (!isNaN(expiresDate.getTime())) return expiresDate.getTime() / 1e3;
    }
    const maxAgeAttr = attributes.find((a) => a.toLowerCase().startsWith("max-age="));
    if (maxAgeAttr) {
      const maxAge = parseInt(maxAgeAttr.split("=")[1]);
      if (!isNaN(maxAge)) return Date.now() / 1e3 + maxAge;
    }
    return null;
  };
  __name2(instance.extractExpiration, "extractExpiration");

  instance.getCookies = async function() {
    debugLog(`🍪 [${instance.requestId}] API Cookie alınıyor`);
    try {
      const response = await fetch(COOKIE_API_URL);
      if (!response.ok) throw new Error(`API hatası: ${response.status}`);
      const cookieData = await response.json();
      let cookiesArray;
      
      if (cookieData.set1 && Array.isArray(cookieData.set1)) {
        const setKeys = Object.keys(cookieData).filter((key) => key.startsWith("set"));
        debugLog(`🔍 [${instance.requestId}] Bulunan setler: ${setKeys.join(", ")}`);
        if (setKeys.length === 0) throw new Error("Cookie set bulunamadı");
        const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
        cookiesArray = cookieData[randomSetKey];
        debugLog(`🎲 [${instance.requestId}] Seçilen cookie set: ${randomSetKey}`);
      } else if (Array.isArray(cookieData)) {
        cookiesArray = cookieData;
        debugLog(`📥 [${instance.requestId}] API'den ${cookiesArray.length} cookie alındı`);
      } else {
        throw new Error(`API formatı beklenmiyor: ${typeof cookieData}`);
      }

      instance.cookies.clear();
      cookiesArray.forEach((cookie) => {
        if (cookie.name && cookie.value) {
          instance.cookies.set(cookie.name, {
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || "/",
            secure: cookie.secure !== void 0 ? cookie.secure : true,
            httpOnly: cookie.httpOnly || false,
            sameSite: cookie.sameSite || "Lax",
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
  __name2(instance.getCookies, "getCookies");

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
      if (DEBUG_MODE && cookies.length > 0) {
        debugLog(`📋 Cookie listesi:`, cookies.map(c => c.split('=')[0]));
      }
      return header;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] URL parse hatası:`, error.message);
      return "";
    }
  };
  __name2(instance.getCookieHeaderForDomain, "getCookieHeaderForDomain");

  instance.shouldSendCookie = function(cookieData, targetDomain, targetUrl) {
    if (!cookieData.domain) {
      return true;
    }
    const cookieDomain = cookieData.domain.replace(/^\./, '');
    const cleanTargetDomain = targetDomain.replace(/^\./, '');
    
    if (cookieDomain === cleanTargetDomain) {
      return true;
    }
    if (cleanTargetDomain.endsWith('.' + cookieDomain)) {
      return true;
    }
    if (cookieDomain.startsWith('.') && cleanTargetDomain.endsWith(cookieDomain)) {
      return true;
    }
    return false;
  };
  __name2(instance.shouldSendCookie, "shouldSendCookie");

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
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split("=");
      
      if (name && value) {
        const cookieData = {
          value,
          domain: instance.extractAttribute(attributes, "domain") || new URL(requestUrl).hostname,
          path: instance.extractAttribute(attributes, "path") || "/",
          secure: attributes.some((attr) => attr.toLowerCase() === "secure"),
          httpOnly: attributes.some((attr) => attr.toLowerCase() === "httponly"),
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
  __name2(instance.updateCookiesFromResponse, "updateCookiesFromResponse");

  instance.getFreshCookies = async function() {
    debugLog(`🔄 [${instance.requestId}] Yeni cookie'ler alınıyor...`);
    return await instance.getCookies();
  };
  __name2(instance.getFreshCookies, "getFreshCookies");

  instance.getRandomHeaders = function() {
    const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
    
    if (!instance._fingerprint) {
      instance._fingerprint = instance.getFingerprint();
      debugLog(`🆔 [${instance.requestId}] Yeni fingerprint oluşturuldu: ${instance._fingerprint.substring(0, 8)}...`);
    }
    
    const headers = {
      ...baseSet,
      fingerprint: instance._fingerprint
    };
    
    debugLog(`🎭 [${instance.requestId}] Header set seçildi - Fingerprint: ${instance._fingerprint.substring(0, 8)}...`);
    return headers;
  };
  __name2(instance.getRandomHeaders, "getRandomHeaders");

  // ORİJİNAL EMAIL FORMATI
  instance.getFormattedEmail = function() {
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const [username, domain] = baseEmail.split("@");
    const random1 = Math.random().toString(36).substring(2, 5);
    const random2 = Math.random().toString(36).substring(2, 5);
    return `${username}.${random1}@${random2}.${domain}`;
  };
  __name2(instance.getFormattedEmail, "getFormattedEmail");

  instance.getFingerprint = function() {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
    return uuid;
  };
  __name2(instance.getFingerprint, "getFingerprint");

  instance.getRandomTurkishName = function() {
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
    return names[Math.floor(Math.random() * names.length)];
  };
  __name2(instance.getRandomTurkishName, "getRandomTurkishName");

  instance.delay = function(ms) {
    debugLog(`⏳ [${instance.requestId}] ${ms}ms bekleniyor...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  __name2(instance.delay, "delay");

  instance.waitForOtp = async function(email, maxWaitTime = 45000, checkInterval = 3000) {
    debugLog(`📱 [${instance.requestId}] OTP bekleniyor (${maxWaitTime}ms)...`);
    const startTime = Date.now();
    let attempt = 0;
    
    while (Date.now() - startTime < maxWaitTime) {
      attempt++;
      const otpCode = await instance.getOtpCode(email);
      
      if (otpCode) {
        debugLog(`✅ [${instance.requestId}] OTP ${attempt}. denemede bulundu: ${otpCode}`);
        return otpCode;
      }
      
      debugLog(`⏳ [${instance.requestId}] OTP henüz yok (${attempt}. deneme), ${checkInterval}ms sonra tekrar...`);
      await instance.delay(checkInterval);
    }
    
    errorLog(`❌ [${instance.requestId}] OTP zaman aşımı (${maxWaitTime}ms)`);
    return null;
  };
  __name2(instance.waitForOtp, "waitForOtp");

 instance.getXsrfToken = async function
  __name(instance.getXsrfToken, "getXsrfToken");

  instance.getOtpCode = async function(email) {
    const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${encodeURIComponent(email)}&mode=0`;
    debugLog(`📱 [${instance.requestId}] OTP Kodu alınıyor: ${email}`);
    
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
        debugLog(`✅ [${instance.requestId}] OTP Kodu Bulundu: ${otpCode}`);
      } else {
        debugLog(`❌ [${instance.requestId}] OTP kodu bulunamadı - Response: ${otpResponse.substring(0, 100)}`);
      }
      
      return otpCode;
    } catch (error) {
      errorLog(`❌ [${instance.requestId}] OTP Hatası:`, error.message);
      return null;
    }
  };
  __name2(instance.getOtpCode, "getOtpCode");

  instance.handleApiResult = function(result, stepName) {
    if (!result.success) {
      throw new Error(`${stepName} başarısız: ${result.error || "Bilinmeyen hata"}`);
    }
    if (!result.data?.success) {
      throw new Error(`${stepName} API hatası: ${result.data?.message || "Bilinmeyen API hatası"}`);
    }
    return result.data;
  };
  __name2(instance.handleApiResult, "handleApiResult");

  instance.makePostRequest = async function(url, body, xsrfToken, selectedHeaders, requestName = "POST") {
    debugLog(`🚀 [${instance.requestId}] ${requestName} isteği: ${url}`);
    debugLog(`📧 [${instance.requestId}] Gönderilen email: ${body.email}`);
    
    const currentFingerprint = selectedHeaders.fingerprint;
    
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
    
    if (DEBUG_MODE) {
      debugLog(`📋 [${instance.requestId}] ${requestName} Headers:`, {
        hasCookies: !!cookieHeader,
        cookieCount: cookieHeader ? cookieHeader.split(';').length : 0,
        hasXsrfToken: !!xsrfToken,
        fingerprint: currentFingerprint ? currentFingerprint.substring(0, 8) + '...' : 'none'
      });
    }
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      
      debugLog(`📨 [${instance.requestId}] ${requestName} Response Status: ${response.status}`);
      instance.updateCookiesFromResponse(response, url);
      
      const responseText = await response.text();
      let data = {};
      
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (e) {
        debugLog(`❌ [${instance.requestId}] JSON parse hatası:`, e.message);
        data = { 
          success: false, 
          error: `JSON parse hatası: ${e.message}`,
          rawResponse: responseText.substring(0, 200)
        };
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
  __name2(instance.makePostRequest, "makePostRequest");

  instance.startRegistration = async function(email) {
    console.log(`🚀 [${instance.requestId}] KAYIT BAŞLATILIYOR - EMAIL: ${email}`);
    console.log(`🆔 [${instance.requestId}] Fingerprint: ${instance._fingerprint ? instance._fingerprint.substring(0, 8) + '...' : 'Henüz yok'}`);
    
    try {
      debugLog(`\n📋 [${instance.requestId}] 1. ADIM: Cookie'ler yükleniyor...`);
      const cookieSuccess = await instance.getFreshCookies();
      if (!cookieSuccess) {
        throw new Error("Cookie'ler alınamadı");
      }

      const selectedHeaders = instance.getRandomHeaders();

      debugLog(`\n📋 [${instance.requestId}] 2. ADIM: XSRF Token alınıyor...`);
      let xsrfToken1 = await instance.getXsrfToken(selectedHeaders, true);
      if (!xsrfToken1) {
        throw new Error("1. XSRF Token alınamadı");
      }

      debugLog(`\n📋 [${instance.requestId}] 3. ADIM: Üyelik isteği gönderiliyor...`);
      const postBody1 = {
        email: email,
        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
      };
      
      const result1 = await instance.makePostRequest(
        "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
        postBody1,
        xsrfToken1,
        selectedHeaders,
        "1. POST - Üyelik İsteği"
      );
      
      const result1Data = instance.handleApiResult(result1, "1. POST - Üyelik İsteği");
      debugLog(`✅ [${instance.requestId}] 1. POST BAŞARILI - ReferenceId: ${result1Data.data?.referenceId}`);

      debugLog(`\n📋 [${instance.requestId}] 4. ADIM: OTP bekleniyor...`);
      const otpCode = await instance.waitForOtp(email, 15000, 15000);
      if (!otpCode) {
        throw new Error("OTP kodu alınamadı");
      }

      debugLog(`\n📋 [${instance.requestId}] 5. ADIM: 2. POST için XSRF Token alınıyor...`);
      let xsrfToken2 = await instance.getXsrfToken(selectedHeaders, false);
      if (!xsrfToken2) {
        throw new Error("2. XSRF Token alınamadı");
      }

      const postBody2 = {
        otpReference: result1Data.data.referenceId,
        otpCode
      };
      
      const result2 = await instance.makePostRequest(
        "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
        postBody2,
        xsrfToken2,
        selectedHeaders,
        "2. POST - OTP Doğrulama"
      );
      
      const result2Data = instance.handleApiResult(result2, "2. POST - OTP Doğrulama");
      debugLog(`✅ [${instance.requestId}] 2. POST BAŞARILI - RequestId: ${result2Data.requestId}`);

      debugLog(`\n📋 [${instance.requestId}] 6. ADIM: Kayıt öncesi bekleniyor...`);
      await instance.delay(3000);

      debugLog(`\n📋 [${instance.requestId}] 7. ADIM: 3. POST için XSRF Token alınıyor...`);
      let xsrfToken3 = await instance.getXsrfToken(selectedHeaders, false);
      if (!xsrfToken3) {
        throw new Error("3. XSRF Token alınamadı");
      }

      const firstName = instance.getRandomTurkishName();
      const lastName = instance.getRandomTurkishName();
      const password = "Hepsiburada1";
      
      debugLog(`👤 [${instance.requestId}] Kullanıcı bilgileri: ${firstName} ${lastName}, ${password}`);

      const postBody3 = {
        subscribeEmail: true,
        firstName,
        lastName,
        password,
        subscribeSms: true,
        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query",
        requestId: result2Data.requestId
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
        console.log(`🔑 Password: ${password}`);
        console.log(`👤 Name: ${firstName} ${lastName}`);
        
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
      debugLog(`🏁 [${instance.requestId}] İşlem tamamlandı`);
    }
  };
  __name2(instance.startRegistration, "startRegistration");

  return instance;
}
__name(createIsolatedRegistration, "createIsolatedRegistration");
__name2(createIsolatedRegistration, "createIsolatedRegistration");

async function startParallelRegistrations(count, baseEmail = null) {
  console.log(`🎯 ${count} paralel kayıt başlatılıyor...`);
  const promises = [];
  
  for (let i = 0; i < count; i++) {
    const registration = createIsolatedRegistration();
    let email;
    
    if (baseEmail) {
      const [username, domain] = baseEmail.split("@");
      email = `${username}+${i}@${domain}`; // ORİJİNAL FORMAT
    } else {
      email = registration.getFormattedEmail(); // ORİJİNAL FONKSİYON
    }
    
    console.log(`🎯 Instance ${i+1} için email: ${email}`);
    promises.push(registration.startRegistration(email));
  }
  
  const results = await Promise.allSettled(promises);
  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.filter((r) => r.status === "rejected" || !r.value?.success).length;
  
  console.log(`\n📊 PARALEL KAYIT SONUÇLARI:`);
  console.log(`✅ Başarılı: ${successful}`);
  console.log(`❌ Başarısız: ${failed}`);
  console.log(`📋 Toplam: ${count}`);
  
  return {
    total: count,
    successful,
    failed,
    results: results.map((r, index) => {
      if (r.status === "fulfilled") {
        return {
          ...r.value,
          instanceId: index + 1
        };
      } else {
        return { 
          success: false, 
          error: r.reason?.message || "Bilinmeyen hata",
          instanceId: index + 1
        };
      }
    })
  };
}
__name(startParallelRegistrations, "startParallelRegistrations");
__name2(startParallelRegistrations, "startParallelRegistrations");

var worker_default = {
  async fetch(request, env, ctx) {
    debugLog("📨 Yeni request:", request.method, request.url);
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
        const emailParam = url.searchParams.get("email");
        const registration = createIsolatedRegistration();
        const email = emailParam || registration.getFormattedEmail();
        
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
    
    if (url.pathname === "/test-cookies") {
      const registration = createIsolatedRegistration();
      try {
        await registration.getCookies();
        return new Response(JSON.stringify({
          success: true,
          message: "Cookie testi tamamlandı",
          cookieCount: registration.cookies.size,
          cookies: Array.from(registration.cookies.keys())
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
      message: "Hepsiburada Kayıt API - Güncellenmiş Paralel Versiyon",
      endpoints: {
        "/register": "Tek kayıt başlat",
        "/register-{n}": "n sayıda paralel kayıt (örn: /register-5)",
        "/register?email=test@email.com": "Özel email ile kayıt",
        "/register-5?email=test@email.com": "Özel email ile 5 paralel kayıt",
        "/test-cookies": "Cookie testi"
      },
      notes: [
        "✅ Orijinal email formatı korundu",
        "✅ Fingerprint tutarlılığı sağlandı", 
        "✅ XSRF token yönetimi iyileştirildi",
        "✅ OTP bekleme geliştirildi",
        "✅ Hata yönetimi standardize edildi"
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
//# sourceMappingURL=worker.js.map
