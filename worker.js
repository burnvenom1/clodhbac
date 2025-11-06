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

// COOKIE YÖNETİCİSİ - TAM İZOLASYON
var cookieManager = {
  cachedCookieSets: {},
  lastFetchTime: 0,
  
  async getCookieSetForInstance(instanceId) {
    // Cookie yoksa veya 5 dakika geçtiyse yenile
    if (Object.keys(this.cachedCookieSets).length === 0 || Date.now() - this.lastFetchTime > 300000) {
      await this.refreshCookies();
    }
    
    const setKeys = Object.keys(this.cachedCookieSets);
    if (setKeys.length === 0) {
      throw new Error("Cookie set bulunamadı");
    }
    
    // INSTANCE BAZLI UNIQUE SET SEÇİMİ
    const instanceHash = this.hashString(instanceId);
    const setIndex = instanceHash % setKeys.length;
    const selectedSetKey = setKeys[setIndex];
    const selectedSet = this.cachedCookieSets[selectedSetKey];
    
    console.log(`🎲 Instance: ${instanceId}, Set: ${selectedSetKey}, ${selectedSet.length} cookie verildi`);
    
    return selectedSet;
  },
  
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },
  
  async refreshCookies() {
    console.log("🔄 Cookie setleri yenileniyor...");
    
    try {
      const response = await fetch(COOKIE_API_URL);
      const data = await response.json();
      
      // Set'leri ayır
      this.cachedCookieSets = {};
      Object.keys(data).forEach(key => {
        if (key.startsWith('set') && Array.isArray(data[key])) {
          this.cachedCookieSets[key] = data[key];
        }
      });
      
      this.lastFetchTime = Date.now();
      
      const totalSets = Object.keys(this.cachedCookieSets).length;
      const totalCookies = Object.values(this.cachedCookieSets).reduce((sum, set) => sum + set.length, 0);
      
      console.log(`✅ ${totalSets} set yüklendi (toplam ${totalCookies} cookie)`);
      
    } catch (error) {
      console.log("❌ Cookie alınamadı:", error.message);
      throw error;
    }
  },
  
  getStatus() {
    const setKeys = Object.keys(this.cachedCookieSets);
    
    return {
      totalSets: setKeys.length,
      lastFetchTime: this.lastFetchTime,
      timeSinceLastFetch: this.lastFetchTime ? Date.now() - this.lastFetchTime : null,
      allSets: setKeys.reduce((acc, key) => {
        acc[key] = this.cachedCookieSets[key].length;
        return acc;
      }, {})
    };
  }
};

// TASK YÖNETİCİSİ - İZOLASYONLU
const taskManager = {
  tasks: new Map(),
  maxTasks: 100,
  
  addTask(instanceId, email) {
    const task = {
      id: instanceId,
      email: email,
      status: "processing",
      startTime: new Date().toISOString(),
      endTime: null,
      result: null,
      error: null
    };
    
    this.tasks.set(instanceId, task);
    
    if (this.tasks.size > this.maxTasks) {
      const oldestKey = this.tasks.keys().next().value;
      this.tasks.delete(oldestKey);
    }
    
    return task;
  },
  
  updateTask(instanceId, updates) {
    const task = this.tasks.get(instanceId);
    if (task) {
      Object.assign(task, updates);
    }
  },
  
  getRecentTasks() {
    return Array.from(this.tasks.values())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, this.maxTasks);
  },
  
  getStats() {
    const tasks = this.getRecentTasks();
    return {
      total: tasks.length,
      processing: tasks.filter(t => t.status === "processing").length,
      completed: tasks.filter(t => t.status === "completed").length,
      failed: tasks.filter(t => t.status === "failed").length,
      error: tasks.filter(t => t.status === "error").length,
      tasks: tasks
    };
  }
};

// OPTİMİZE LOG FONKSİYONLARI
function debugLog(...args) {
  if (DEBUG_MODE) console.log(...args);
}

function errorLog(...args) {
  console.log(...args);
}

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

// TAMAMEN İZOLE KAYIT SİSTEMİ
function createIsolatedRegistration() {
  const instance = {};
  
  // HER INSTANCE TAMAMEN BAĞIMSIZ - İŞLEM BAŞINDA TEMİZ
  instance.cookies = new Map();
  instance.requestId = Math.random().toString(36).substring(2, 15);
  instance.isActive = true;
  instance.startTime = Date.now();

  // INSTANCE TEMİZLEME FONKSİYONU
  instance.cleanup = function() {
    if (!instance.isActive) return;
    
    debugLog(`🧹 [${instance.requestId}] Instance temizleniyor...`);
    
    instance.cookies.clear();
    instance.cookies = new Map();
    instance.isActive = false;
    
    const duration = Date.now() - instance.startTime;
    debugLog(`✅ [${instance.requestId}] Instance temizlendi (${duration}ms)`);
  };

  // İŞLEM BAŞI TEMİZLİK
  instance.initializeCleanState = function() {
    debugLog(`🆕 [${instance.requestId}] Yeni temiz instance oluşturuldu`);
    
    instance.cookies.clear();
    instance.isActive = true;
    instance.startTime = Date.now();
    instance.cookies = new Map();
    
    debugLog(`✨ [${instance.requestId}] Başlangıç temizliği tamamlandı`);
  };

  // HELPER FONKSİYONLAR
  instance.extractAttribute = function(attributes, attrName) {
    if (!instance.isActive) return null;
    const attr = attributes.find(a => a.toLowerCase().startsWith(attrName.toLowerCase() + '='));
    return attr ? attr.split('=')[1] : null;
  };

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

  // OTOMATİK COOKIE YÜKLEME - INSTANCE BAZLI
  instance.loadInitialCookies = async function() {
    if (!instance.isActive) return false;
    
    console.log(`👤 [${instance.requestId}] Cookie set yükleniyor...`);
    
    try {
      instance.cookies.clear();
      
      // INSTANCE ID İLE UNIQUE SET AL
      const cookieSet = await cookieManager.getCookieSetForInstance(this.requestId);
      
      if (!cookieSet || cookieSet.length === 0) {
        throw new Error("Cookie set boş");
      }
      
      let loadedCount = 0;
      cookieSet.forEach(cookie => {
        if (cookie && cookie.name && cookie.value) {
          instance.cookies.set(cookie.name, {
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || '/',
            secure: cookie.secure !== undefined ? cookie.secure : true,
            httpOnly: cookie.httpOnly || false,
            sameSite: cookie.sameSite || 'Lax'
          });
          loadedCount++;
        }
      });
      
      console.log(`✅ [${instance.requestId}] ${loadedCount} cookie yüklendi`);
      return loadedCount > 0;
      
    } catch (error) {
      console.log(`❌ [${instance.requestId}] Cookie hatası:`, error.message);
      return false;
    }
  };

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

  // RANDOM HEADER GENERATOR
  instance.getRandomHeaders = function() {
    if (!instance.isActive) return HEADER_SETS[0];
    
    const baseSet = HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
    const fingerprint = instance.getFingerprint();
    
    const headers = {
      ...baseSet,
      fingerprint: fingerprint
    };
    
    debugLog(`🎭 [${instance.requestId}] Header set seçildi`);
    return headers;
  };

  // EMAIL FORMATLAMA
  instance.getFormattedEmail = function() {
    if (!instance.isActive) return EMAIL_LIST[0];
    
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const [username, domain] = baseEmail.split("@");
    const random1 = Math.random().toString(36).substring(2, 5);
    const random2 = Math.random().toString(36).substring(2, 5);
    return `${username}.${random1}@${random2}.${domain}`;
  };

  // FINGERPRINT OLUŞTURMA
  instance.getFingerprint = function() {
    if (!instance.isActive) return 'inactive-instance';
    
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    debugLog(`🆕 [${instance.requestId}] Fingerprint oluşturuldu`);
    return uuid;
  };

  // RASTGELE TÜRK İSMİ
  instance.getRandomTurkishName = function() {
    if (!instance.isActive) return "User";
    
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
    return names[Math.floor(Math.random() * names.length)];
  };

  // DELAY FONKSİYONU
  instance.delay = function(ms) {
    if (!instance.isActive) return Promise.resolve();
    
    debugLog(`⏳ [${instance.requestId}] ${ms}ms bekleniyor...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // XSRF TOKEN ALMA
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

  // POST REQUEST
  instance.makePostRequest = async function(url, body, xsrfToken, selectedHeaders, requestName = "POST") {
    if (!instance.isActive) {
      return { success: false, error: "Instance inactive" };
    }
    
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

  // ANA KAYIT FONKSİYONU - TAMAMEN İZOLE
  instance.startRegistration = async function(email) {
    console.log(`🚀 [${instance.requestId}] TAM İZOLE KAYIT BAŞLATILIYOR - EMAIL:`, email);
    
    try {
      // İŞLEM BAŞI TEMİZLİK
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
      // İŞLEM SONU TEMİZLİK
      instance.cleanup();
    }
  };

  return instance;
}

// WORKER - TAM İZOLASYONLU
var worker_default = {
  async fetch(request, env, ctx) {
    console.log("📥 Yeni request:", request.method, request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    
    // TAM İZOLASYONLU KAYIT
    if (url.pathname === "/register") {
      const registration = createIsolatedRegistration();
      const email = url.searchParams.get("email") || registration.getFormattedEmail();
      
      console.log(`🎯 PARALEL KAYIT BAŞLATILIYOR - Instance: ${registration.requestId}, Email: ${email}`);
      
      // TASK MANAGER İLE İZOLASYONLU KAYIT
      const task = taskManager.addTask(registration.requestId, email);
      
      // ARKA PLANDA ÇALIŞTIR - TAM İZOLASYON
      ctx.waitUntil((async () => {
        try {
          console.log(`🚀 ARKA PLAN BAŞLADI - Instance: ${registration.requestId}`);
          
          const result = await registration.startRegistration(email);
          
          // TASK MANAGER İLE GÜVENLİ GÜNCELLEME
          taskManager.updateTask(registration.requestId, {
            status: result.success ? "completed" : "failed",
            endTime: new Date().toISOString(),
            result: result
          });
          
          console.log(`✅ ARKA PLAN TAMAMLANDI - Instance: ${registration.requestId}, Success: ${result.success}`);
        } catch (error) {
          console.log(`💥 ARKA PLAN HATA - Instance: ${registration.requestId}, Error: ${error.message}`);
          
          // TASK MANAGER İLE GÜVENLİ HATA KAYDI
          taskManager.updateTask(registration.requestId, {
            status: "error",
            endTime: new Date().toISOString(),
            error: error.message
          });
        }
      })());
      
      // HEMEN RESPONSE DÖN
      return new Response(JSON.stringify({
        success: true,
        message: "Kayıt başlatıldı",
        instanceId: registration.requestId,
        email: email,
        status: "processing",
        viewResults: "/recent-tasks"
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // SON İŞLEMLER - TASK MANAGER İLE
    if (url.pathname === "/recent-tasks") {
      const stats = taskManager.getStats();
      
      return new Response(JSON.stringify(stats, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // COOKIE YÖNETİCİ DURUMU
    if (url.pathname === "/cookie-status") {
      const status = cookieManager.getStatus();
      
      return new Response(JSON.stringify({
        cookieManager: status,
        taskManager: {
          totalTasks: taskManager.tasks.size,
          maxTasks: taskManager.maxTasks
        },
        message: "Sistem durumu"
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // 🔄 COOKIE'LERİ YENİLE
    if (url.pathname === "/refresh-cookies") {
      try {
        cookieManager.cachedCookies = [];
        cookieManager.lastFetchTime = 0;
        await cookieManager.refreshCookies();
        
        return new Response(JSON.stringify({
          success: true,
          message: "Cookie'ler yenilendi",
          status: cookieManager.getStatus()
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
    
    // 📋 ANA SAYFA
    return new Response(JSON.stringify({
      message: "Hepsiburada Kayıt API - Cookie Yöneticili Versiyon",
      endpoints: {
        "/register": "Paralel kayıt başlat (hemen response)",
        "/recent-tasks": "Son 100 işlemi görüntüle", 
        "/cookie-status": "Cookie yöneticisi durumu",
        "/refresh-cookies": "Cookie'leri manuel yenile"
      },
      cookieFeatures: {
        "Sıralı Dağıtım": "Cookie'leri sırayla dağıtır",
        "5 Dakika Cache": "5 dakika boyunca aynı cookie listesini kullanır",
        "Otomatik Yenileme": "5 dakika sonra yeni cookie listesi alır",
        "Döngüsel": "Liste bitince baştan başlar"
      }
    }, null, 2), {
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      }
    });
  }
};

// DÜZELTİLMİŞ EXPORT - Cloudflare Workers için doğru syntax
export default worker_default;
