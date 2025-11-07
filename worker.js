var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
const COOKIE_API_URL = "https://burnrndr.onrender.com/last-cookies";
const DEBUG_MODE = true;

// ✅ KALICI SONUÇ DEPOLAMA
const resultsManager = {
  results: new Map(),
  maxResults: 200, // Daha fazla sonuç tut
  
  // ✅ SONUÇ EKLE
  addResult(instanceId, result) {
    const resultData = {
      id: instanceId,
      timestamp: new Date().toISOString(),
      success: result.success,
      email: result.email,
      password: result.password,
      name: result.name,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      referenceId: result.referenceId,
      instanceRequestId: result.instanceRequestId,
      error: result.error,
      instanceData: result.instanceData,
      source: result.source || 'manual'
    };
    
    this.results.set(instanceId, resultData);
    
    // ✅ MAX LIMIT KONTROLÜ
    if (this.results.size > this.maxResults) {
      const oldestKey = Array.from(this.results.entries())
        .sort(([,a], [,b]) => new Date(a.timestamp) - new Date(b.timestamp))[0][0];
      this.results.delete(oldestKey);
    }
    
    console.log(`💾 Sonuç kaydedildi: ${instanceId} - ${result.success ? '✅' : '❌'}`);
    return resultData;
  },
  
  // ✅ SONUÇLARI AL
  getResults(limit = 50) {
    const allResults = Array.from(this.results.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return {
      total: allResults.length,
      success: allResults.filter(r => r.success).length,
      failed: allResults.filter(r => !r.success).length,
      successRate: allResults.length > 0 ? 
        Math.round((allResults.filter(r => r.success).length / allResults.length) * 100) : 0,
      results: allResults.slice(0, limit)
    };
  },
  
  // ✅ TEK SONUÇ SİL
  deleteResult(instanceId) {
    const deleted = this.results.delete(instanceId);
    console.log(`🗑️ Sonuç silindi: ${instanceId} - ${deleted ? '✅' : '❌'}`);
    return deleted;
  },
  
  // ✅ TÜM SONUÇLARI SİL
  clearAllResults() {
    const count = this.results.size;
    this.results.clear();
    console.log(`🧹 Tüm sonuçlar silindi: ${count} adet`);
    return count;
  },
  
  // ✅ İSTATİSTİKLER
  getStats() {
    const allResults = Array.from(this.results.values());
    const successResults = allResults.filter(r => r.success);
    const failedResults = allResults.filter(r => !r.success);
    
    return {
      total: allResults.length,
      success: successResults.length,
      failed: failedResults.length,
      successRate: allResults.length > 0 ? 
        Math.round((successResults.length / allResults.length) * 100) : 0,
      last24h: allResults.filter(r => 
        Date.now() - new Date(r.timestamp).getTime() < 24 * 60 * 60 * 1000
      ).length,
      bySource: {
        manual: allResults.filter(r => r.source === 'manual').length,
        cron: allResults.filter(r => r.source === 'cron').length
      }
    };
  }
};

// ✅ CRON YÖNETİCİSİ - 7/24 SINIRSIZ
const cronManager = {
  isRunning: false,
  activeInstances: new Map(),
  totalRuns: 0,
  maxConcurrent: 3,
  cooldown: 1 * 60 * 1000,
  
  async handleContinuousCron() {
    if (this.activeInstances.size >= this.maxConcurrent) {
      console.log(`⏰ Skip - ${this.activeInstances.size} aktif instance var`);
      return { success: false, reason: 'max_concurrent_reached' };
    }
    
    const instanceId = `cron_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log(`⏰ CRON BAŞLATILIYOR - ${instanceId}`);
    
    this.isRunning = true;
    this.totalRuns++;

    try {
      const instance = createIsolatedInstance(instanceId);
      this.activeInstances.set(instanceId, {
        instance: instance,
        startTime: Date.now(),
        status: 'processing'
      });

      instance.startRegistration().then(result => {
        // ✅ SONUCU KAYDET
        resultsManager.addResult(instanceId, {
          ...result,
          source: 'cron'
        });

        this.activeInstances.set(instanceId, {
          ...this.activeInstances.get(instanceId),
          status: result.success ? 'completed' : 'failed',
          endTime: Date.now(),
          result: result
        });

        console.log(`⏰ CRON TAMAMLANDI - ${instanceId}: ${result.success ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
        
        setTimeout(() => {
          this.activeInstances.delete(instanceId);
          console.log(`🧹 ${instanceId} temizlendi`);
        }, 5 * 60 * 1000);

      }).catch(error => {
        this.activeInstances.set(instanceId, {
          ...this.activeInstances.get(instanceId),
          status: 'error',
          endTime: Date.now(),
          error: error.message
        });

        console.log(`⏰ CRON HATA - ${instanceId}:`, error.message);
      });

      return {
        success: true,
        instanceId: instanceId,
        message: 'Cron başlatıldı',
        activeInstances: this.activeInstances.size,
        totalRuns: this.totalRuns
      };

    } catch (error) {
      console.log(`⏰ CRON BAŞLATMA HATASI - ${instanceId}:`, error.message);
      return {
        success: false,
        instanceId: instanceId,
        error: error.message
      };
    }
  },

  getCronStatus() {
    const activeInstances = Array.from(this.activeInstances.entries()).map(([id, data]) => ({
      instanceId: id,
      status: data.status,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.endTime ? data.endTime - data.startTime : Date.now() - data.startTime,
      email: data.result?.email || data.result?.instanceData?.email,
      success: data.result?.success
    }));

    return {
      isRunning: this.isRunning,
      activeInstances: activeInstances.length,
      maxConcurrent: this.maxConcurrent,
      totalRuns: this.totalRuns,
      instances: activeInstances
    };
  }
};

// COOKIE YÖNETİCİSİ - LOCK SİSTEMLİ
var cookieManager = {
  cachedCookieSets: {},
  lastFetchTime: 0,
  instanceCounter: 0,
  isRefreshing: false,
  refreshPromise: null,
  
  async getCookieSetForInstance(instanceId) {
    if (Object.keys(this.cachedCookieSets).length === 0 || Date.now() - this.lastFetchTime > 300000) {
      await this.refreshCookiesWithLock();
    }
    
    const setKeys = Object.keys(this.cachedCookieSets);
    if (setKeys.length === 0) {
      throw new Error("Cookie set bulunamadı");
    }
    
    this.instanceCounter = (this.instanceCounter + 1) % setKeys.length;
    const selectedSetKey = setKeys[this.instanceCounter];
    const selectedSet = this.cachedCookieSets[selectedSetKey];
    
    console.log(`🎲 [${instanceId}] Cookie Set: ${selectedSetKey}, Sıra: ${this.instanceCounter}, Adet: ${selectedSet.length}`);
    
    return JSON.parse(JSON.stringify(selectedSet));
  },
  
  async refreshCookiesWithLock() {
    if (this.isRefreshing) {
      console.log("🔒 Cookie refresh bekleniyor...");
      await this.refreshPromise;
      return;
    }
    
    this.isRefreshing = true;
    this.refreshPromise = this._doRefresh();
    
    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  },
  
  async _doRefresh() {
    console.log("🔄 Cookie setleri yenileniyor...");
    
    try {
      const response = await fetch(COOKIE_API_URL);
      const data = await response.json();
      
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

// TASK YÖNETİCİSİ - GEÇİCİ İŞLEMLER İÇİN
const taskManager = {
  tasks: new Map(),
  maxTasks: 50,
  
  addTask(instanceId, email, source = 'manual') {
    const task = {
      id: instanceId,
      email: email,
      status: "processing",
      startTime: new Date().toISOString(),
      endTime: null,
      result: null,
      error: null,
      source: source
    };
    
    this.tasks.set(instanceId, task);
    
    if (this.tasks.size > this.maxTasks) {
      const oldestKey = this.tasks.keys().next().value;
      this.tasks.delete(oldestKey);
    }
    
    console.log(`📝 [${instanceId}] Yeni task: ${email}, Source: ${source}`);
    return task;
  },
  
  updateTask(instanceId, updates) {
    const task = this.tasks.get(instanceId);
    if (task) {
      Object.assign(task, updates);
      console.log(`🔄 [${instanceId}] Task güncellendi: ${updates.status}, Source: ${task.source}`);
    }
  },
  
  getRecentTasks() {
    return Array.from(this.tasks.values())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 20);
  }
};

// OPTİMİZE LOG FONKSİYONLARI
function debugLog(instanceId, ...args) {
  if (DEBUG_MODE) console.log(`[${instanceId}]`, ...args);
}

function errorLog(instanceId, ...args) {
  console.log(`[${instanceId}]`, ...args);
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
  }
];

// GLOBAL EMAIL LIST - SADECE TEMPLATE
const GLOBAL_EMAIL_TEMPLATES = [
  "jihpngpnd@emlhub.com",
  "tmrzfanje@emlpro.com", 
  "wiraypzse@emlpro.com",
  "lnmwhbvvf@emltmp.com",
  "bshuzcvvf@emltmp.com",
  "hsfsqxcug@emltmp.com",
  "nqywhdnoh@emlhub.com"
];

// TAM İZOLE INSTANCE SİSTEMİ
function createIsolatedInstance(instanceId) {
  console.log(`🆕 [${instanceId}] YENİ INSTANCE OLUŞTURULUYOR`);
  
  const INSTANCE_EMAIL_LIST = [...GLOBAL_EMAIL_TEMPLATES];
  
  const instanceData = {
    cookies: new Map(),
    selectedHeaders: null,
    emailList: INSTANCE_EMAIL_LIST,
    email: null,
    emailGenerated: false,
    otpCode: null,
    otpRetrieved: false,
    otpEmail: null,
    referenceId: null,
    requestId: null,
    xsrfTokens: { step1: null, step2: null, step3: null },
    userInfo: { firstName: null, lastName: null, password: "Hepsiburada1" },
    postData: { step1: null, step2: null, step3: null },
    stepStatus: {
      cookiesLoaded: false,
      xsrf1Received: false,
      post1Completed: false,
      otpRequested: false,
      otpReceived: false,
      xsrf2Received: false,
      post2Completed: false,
      xsrf3Received: false,
      post3Completed: false
    }
  };

  const instance = {
    requestId: instanceId,
    isActive: true,
    startTime: Date.now(),
    instanceData: instanceData,

    cleanup: function() {
      if (!this.isActive) return;
      this.isActive = false;
      if (this.instanceData.cookies) {
        this.instanceData.cookies.clear();
      }
      this.instanceData = null;
      debugLog(this.requestId, `✅ Instance tamamen yok edildi`);
    },
    
    initializeCleanState: function() {
      debugLog(this.requestId, `✨ Instance temizleniyor...`);
      
      this.instanceData.cookies.clear();
      this.instanceData.email = null;
      this.instanceData.emailGenerated = false;
      this.instanceData.otpCode = null;
      this.instanceData.otpRetrieved = false;
      this.instanceData.otpEmail = null;
      this.instanceData.referenceId = null;
      this.instanceData.requestId = null;
      this.instanceData.xsrfTokens = { step1: null, step2: null, step3: null };
      this.instanceData.userInfo = { firstName: null, lastName: null, password: "Hepsiburada1" };
      this.instanceData.postData = { step1: null, step2: null, step3: null };
      this.instanceData.stepStatus = {
        cookiesLoaded: false,
        xsrf1Received: false,
        post1Completed: false,
        otpRequested: false,
        otpReceived: false,
        xsrf2Received: false,
        post2Completed: false,
        xsrf3Received: false,
        post3Completed: false
      };
      
      this.isActive = true;
      this.startTime = Date.now();
      debugLog(this.requestId, `✨ Instance tamamen temiz`);
    },
    
    initializeHeaders: function() {
      debugLog(this.requestId, `🎭 YENİ header set oluşturuluyor...`);
      const baseHeaderSet = HEADER_SETS[this.hashString(this.requestId + Date.now()) % HEADER_SETS.length];
      this.instanceData.selectedHeaders = {
        ...baseHeaderSet,
        fingerprint: this.generateFingerprint()
      };
      debugLog(this.requestId, `✅ Yeni header set oluşturuldu`);
    },
    
    generateFingerprint: function() {
      const fingerprint = [...Array(36)]
        .map((_, i) => {
          if (i === 8 || i === 13 || i === 18 || i === 23) return '-';
          if (i === 14) return '4';
          if (i === 19) return ['8','9','a','b'][Math.floor(Math.random() * 4)];
          return Math.floor(Math.random() * 16).toString(16);
        })
        .join('');
      
      debugLog(this.requestId, `🔑 Fingerprint: ${fingerprint}`);
      return fingerprint;
    },
    
    hashString: function(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    },
    
    getFormattedEmail: function() {
      debugLog(this.requestId, `📧 YENİ email oluşturuluyor...`);
      
      const timestamp = Date.now().toString(36);
      const randomPart = Math.random().toString(36).substring(2, 6);
      
      const randomIndex = Math.floor(Math.random() * this.instanceData.emailList.length);
      const baseEmail = this.instanceData.emailList[randomIndex];
      const [username, domain] = baseEmail.split("@");
      
      const formattedEmail = `${username}.${timestamp.substring(0,3)}@${randomPart.substring(0,3)}.${domain}`;
      
      this.instanceData.email = formattedEmail;
      this.instanceData.emailGenerated = true;
      
      debugLog(this.requestId, `✅ YENİ UNIQUE email oluşturuldu: ${formattedEmail}`);
      return formattedEmail;
    },
    
    getRandomTurkishName: function() {
      const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Emine", "Hatice"];
      const uniqueSeed = this.hashString(this.requestId + Date.now().toString() + Math.random().toString(36));
      const nameIndex = uniqueSeed % names.length;
      
      const name = names[nameIndex];
      debugLog(this.requestId, `👤 YENİ rastgele isim: ${name}`);
      return name;
    },
    
    loadInitialCookies: async function() {
      if (!this.isActive) return false;
      
      debugLog(this.requestId, `👤 YENİ cookie set yükleniyor...`);
      
      try {
        this.instanceData.cookies.clear();
        
        const cookieSet = await cookieManager.getCookieSetForInstance(this.requestId);
        
        if (!cookieSet || cookieSet.length === 0) {
          throw new Error("Cookie set boş");
        }
        
        let loadedCount = 0;
        cookieSet.forEach(cookie => {
          if (cookie && cookie.name && cookie.value) {
            this.instanceData.cookies.set(cookie.name, {
              value: cookie.value,
              domain: cookie.domain,
              path: cookie.path || '/',
              secure: cookie.secure !== undefined ? cookie.secure : true,
              httpOnly: cookie.httpOnly || false,
              sameSite: cookie.sameSite || 'Lax',
              instanceId: this.requestId,
              loadedAt: Date.now()
            });
            loadedCount++;
          }
        });
        
        this.instanceData.stepStatus.cookiesLoaded = true;
        debugLog(this.requestId, `✅ ${loadedCount} YENİ cookie yüklendi`);
        
        return loadedCount > 0;
        
      } catch (error) {
        errorLog(this.requestId, `❌ Cookie hatası:`, error.message);
        return false;
      }
    },
    
    getCookieHeaderForDomain: function(targetUrl) {
      if (!this.isActive || !this.instanceData.cookies) return "";
      
      try {
        const urlObj = new URL(targetUrl);
        const targetDomain = urlObj.hostname;
        const cookies = [];
        
        this.instanceData.cookies.forEach((cookieData, name) => {
          if (this.isActive && this.shouldSendCookie(cookieData, targetDomain, targetUrl)) {
            cookies.push(`${name}=${cookieData.value}`);
          }
        });
        
        const header = cookies.join("; ");
        if (cookies.length > 0) {
          debugLog(this.requestId, `🍪 ${cookies.length} cookie gönderiliyor: ${targetDomain}`);
        }
        
        return header;
      } catch (error) {
        errorLog(this.requestId, `❌ URL parse hatası:`, error.message);
        return "";
      }
    },
    
    shouldSendCookie: function(cookieData, targetDomain, targetUrl) {
      if (!this.isActive) return false;
      if (!cookieData.domain) return true;
      
      const cookieDomain = cookieData.domain;
      if (cookieDomain === targetDomain) return true;
      if (cookieDomain.startsWith('.') && targetDomain.endsWith(cookieDomain)) return true;
      if (targetDomain.endsWith('.' + cookieDomain)) return true;
      
      return false;
    },
    
    updateCookiesFromResponse: function(response, requestUrl) {
      if (!this.isActive || !this.instanceData.cookies) return;
      
      const setCookieHeader = response.headers.get("set-cookie");
      if (!setCookieHeader) return;
      
      debugLog(this.requestId, `📨 Set-Cookie Header alındı`);
      const cookies = setCookieHeader.split(/,\s*(?=[^;]+=)/);
      
      let updatedCount = 0;
      let addedCount = 0;
      
      cookies.forEach((cookieStr) => {
        if (!this.isActive) return;
        
        const parts = cookieStr.split(';').map(part => part.trim());
        const [nameValue, ...attributes] = parts;
        const [name, value] = nameValue.split('=');
        
        if (name && value) {
          const cookieData = {
            value: value,
            domain: this.extractAttribute(attributes, 'domain') || new URL(requestUrl).hostname,
            path: this.extractAttribute(attributes, 'path') || '/',
            secure: attributes.some(attr => attr.toLowerCase() === 'secure'),
            httpOnly: attributes.some(attr => attr.toLowerCase() === 'httponly'),
            sameSite: this.extractSameSite(attributes),
            expirationDate: this.extractExpiration(attributes),
            instanceId: this.requestId,
            updatedAt: Date.now()
          };
          
          if (this.instanceData.cookies.has(name)) {
            this.instanceData.cookies.set(name, cookieData);
            updatedCount++;
          } else {
            this.instanceData.cookies.set(name, cookieData);
            addedCount++;
          }
        }
      });
      
      if (updatedCount > 0 || addedCount > 0) {
        debugLog(this.requestId, `✅ ${updatedCount} cookie güncellendi, ${addedCount} yeni cookie eklendi`);
      }
    },
    
    extractAttribute: function(attributes, attrName) {
      if (!this.isActive) return null;
      const attr = attributes.find(a => a.toLowerCase().startsWith(attrName.toLowerCase() + '='));
      return attr ? attr.split('=')[1] : null;
    },
    
    extractSameSite: function(attributes) {
      if (!this.isActive) return 'Lax';
      const sameSiteAttr = attributes.find(a => a.toLowerCase().startsWith('samesite='));
      if (sameSiteAttr) {
        const value = sameSiteAttr.split('=')[1].toLowerCase();
        if (value === 'none') return 'None';
        if (value === 'strict') return 'Strict';
        if (value === 'lax') return 'Lax';
      }
      return 'Lax';
    },
    
    extractExpiration: function(attributes) {
      if (!this.isActive) return null;
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
    },
    
    delay: function(ms) {
      if (!this.isActive) return Promise.resolve();
      debugLog(this.requestId, `⏳ ${ms}ms bekleniyor...`);
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    
    getXsrfToken: async function(step = "step1") {
      if (!this.isActive) return null;
      
      debugLog(this.requestId, `🔄 YENİ XSRF Token alınıyor (${step})...`);
      
      const xsrfUrl = "https://oauth.hepsiburada.com/api/authenticate/xsrf-token";
      
      const headers = {
        "accept": this.instanceData.selectedHeaders.Accept,
        "accept-language": this.instanceData.selectedHeaders.AcceptLanguage,
        "accept-encoding": this.instanceData.selectedHeaders.AcceptEncoding,
        "cache-control": this.instanceData.selectedHeaders.CacheControl,
        "connection": this.instanceData.selectedHeaders.Connection,
        "origin": "https://giris.hepsiburada.com",
        "referer": "https://giris.hepsiburada.com/",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": this.instanceData.selectedHeaders.UserAgent,
        "fingerprint": this.instanceData.selectedHeaders.fingerprint,
      };
      
      const cookieHeader = this.getCookieHeaderForDomain(xsrfUrl);
      if (cookieHeader) headers["cookie"] = cookieHeader;
      
      if (this.instanceData.selectedHeaders.SecCHUA) {
        headers["sec-ch-ua"] = this.instanceData.selectedHeaders.SecCHUA;
        headers["sec-ch-ua-mobile"] = this.instanceData.selectedHeaders.SecCHUAMobile;
        headers["sec-ch-ua-platform"] = this.instanceData.selectedHeaders.SecCHUAPlatform;
      }
      
      try {
        const response = await fetch(xsrfUrl, { 
          method: 'GET',
          headers 
        });
        
        debugLog(this.requestId, `📡 XSRF Response Status: ${response.status}`);
        this.updateCookiesFromResponse(response, xsrfUrl);
        
        let xsrfToken = null;
        
        if (response.ok) {
          try {
            const responseData = await response.json();
            if (responseData && responseData.token) {
              xsrfToken = responseData.token;
            }
          } catch (e) {
            debugLog(this.requestId, `❌ XSRF JSON parse hatası`);
          }
        }
        
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader && !xsrfToken) {
          const xsrfMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
          if (xsrfMatch) {
            xsrfToken = decodeURIComponent(xsrfMatch[1]);
          }
        }
        
        if (xsrfToken) {
          this.instanceData.xsrfTokens[step] = xsrfToken;
          this.instanceData.stepStatus[`${step.replace('step', 'xsrf')}Received`] = true;
          debugLog(this.requestId, `✅ YENİ XSRF Token alındı (${step}): ${xsrfToken.substring(0, 20)}...`);
        } else {
          debugLog(this.requestId, `❌ XSRF Token bulunamadı (${step})`);
        }
        
        return xsrfToken;
      } catch (error) {
        errorLog(this.requestId, `❌ XSRF Token hatası:`, error.message);
        return null;
      }
    },
    
    getOtpCode: async function() {
      if (!this.isActive) return null;
      
      if (this.instanceData.otpRetrieved && this.instanceData.otpCode) {
        debugLog(this.requestId, `📱 Önceden alınmış OTP kullanılıyor: ${this.instanceData.otpCode} (Email: ${this.instanceData.email})`);
        return this.instanceData.otpCode;
      }
      
      if (!this.instanceData.email) {
        errorLog(this.requestId, `❌ OTP hatası: Email bulunamadı`);
        return null;
      }
      
      debugLog(this.requestId, `📱 YENİ OTP kodu alınıyor: ${this.instanceData.email}`);
      
      const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${encodeURIComponent(this.instanceData.email)}&mode=0`;
      
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
          this.instanceData.otpCode = otpCode;
          this.instanceData.otpRetrieved = true;
          this.instanceData.otpEmail = this.instanceData.email;
          this.instanceData.stepStatus.otpReceived = true;
          debugLog(this.requestId, `🔢 YENİ OTP Kodu Bulundu: ${otpCode} (Email: ${this.instanceData.email})`);
        } else {
          debugLog(this.requestId, `❌ OTP kodu bulunamadı (Email: ${this.instanceData.email})`);
        }
        
        return otpCode;
      } catch (error) {
        errorLog(this.requestId, `❌ OTP Hatası:`, error.message);
        return null;
      }
    },
    
    validateOtpWithEmailCheck: async function(xsrfToken) {
      if (!this.isActive) return { success: false, error: "Instance inactive" };
      
      if (!this.instanceData.email) {
        return { success: false, error: "Email bulunamadı" };
      }
      
      if (!this.instanceData.otpCode) {
        return { success: false, error: "OTP kodu bulunamadı" };
      }
      
      if (!this.instanceData.referenceId) {
        return { success: false, error: "Reference ID bulunamadı" };
      }
      
      if (this.instanceData.otpEmail !== this.instanceData.email) {
        errorLog(this.requestId, `❌ OTP-EMAIL UYUŞMAZLIĞI! OTP: ${this.instanceData.otpEmail}, Mevcut: ${this.instanceData.email}`);
        return { success: false, error: "OTP ve email uyuşmazlığı" };
      }
      
      debugLog(this.requestId, `🔐 OTP doğrulama - Instance: ${this.requestId}, Email: ${this.instanceData.email}, OTP: ${this.instanceData.otpCode}, Reference: ${this.instanceData.referenceId}`);
      
      const postBody2 = {
        otpReference: this.instanceData.referenceId,
        otpCode: this.instanceData.otpCode
      };
      
      const result2 = await this.makePostRequest(
        "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
        postBody2,
        xsrfToken,
        "2. POST - OTP Doğrulama"
      );
      
      return result2;
    },
    
    makePostRequest: async function(url, body, xsrfToken, requestName = "POST") {
      if (!this.isActive) {
        return { success: false, error: "Instance inactive" };
      }
      
      debugLog(this.requestId, `🎯 ${requestName} isteği: ${url}`);
      
      const headers = {
        "accept": this.instanceData.selectedHeaders.Accept,
        "accept-language": this.instanceData.selectedHeaders.AcceptLanguage,
        "accept-encoding": this.instanceData.selectedHeaders.AcceptEncoding,
        "cache-control": this.instanceData.selectedHeaders.CacheControl,
        "connection": this.instanceData.selectedHeaders.Connection,
        "content-type": "application/json",
        "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
        "fingerprint": this.instanceData.selectedHeaders.fingerprint,
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "origin": "https://giris.hepsiburada.com",
        "referer": "https://giris.hepsiburada.com/",
        "user-agent": this.instanceData.selectedHeaders.UserAgent
      };
      
      const cookieHeader = this.getCookieHeaderForDomain(url);
      if (cookieHeader) headers["cookie"] = cookieHeader;
      
      if (this.instanceData.selectedHeaders.SecCHUA) {
        headers["sec-ch-ua"] = this.instanceData.selectedHeaders.SecCHUA;
        headers["sec-ch-ua-mobile"] = this.instanceData.selectedHeaders.SecCHUAMobile;
        headers["sec-ch-ua-platform"] = this.instanceData.selectedHeaders.SecCHUAPlatform;
      }
      
      if (xsrfToken) headers["x-xsrf-token"] = xsrfToken;
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        });
        
        debugLog(this.requestId, `📡 ${requestName} Response Status: ${response.status}`);
        this.updateCookiesFromResponse(response, url);
        
        const responseText = await response.text();
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          data = { success: false, error: "Invalid JSON response" };
        }
        
        this.instanceData.postData[requestName] = {
          url: url,
          body: body,
          response: data,
          timestamp: Date.now(),
          status: response.status
        };
        
        return {
          success: response.ok,
          data,
          status: response.status,
          fingerprint: this.instanceData.selectedHeaders.fingerprint
        };
      } catch (error) {
        errorLog(this.requestId, `❌ ${requestName} Hatası:`, error.message);
        return { success: false, error: error.message };
      }
    },
    
    startRegistration: async function(email = null) {
      console.log(`🚀 [${this.requestId}] YENİ KAYIT BAŞLATILIYOR`);
      
      const targetEmail = email || this.getFormattedEmail();
      console.log(`🔒 [${this.requestId}] EMAIL: ${targetEmail}`);
      
      try {
        this.initializeCleanState();
        this.instanceData.email = targetEmail;
        this.instanceData.emailGenerated = true;
        
        this.isActive = true;
        this.startTime = Date.now();
        
        console.log(`🔍 [${this.requestId}] Instance temiz - Email: ${targetEmail}`);
        
        // 1. HEADER OLUŞTUR
        this.initializeHeaders();
        
        // 2. COOKIE SETİ YÜKLE
        const cookieSuccess = await this.loadInitialCookies();
        if (!cookieSuccess) {
          throw new Error("Cookie seti alınamadı");
        }
        
        // 3. XSRF TOKEN AL
        let xsrfToken1 = await this.getXsrfToken("step1");
        if (!xsrfToken1) {
          throw new Error("1. XSRF Token alınamadı");
        }
        
        // 4. 1. POST - KAYIT İSTEĞİ
        const postBody1 = { email: targetEmail };
        
        const result1 = await this.makePostRequest(
          "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
          postBody1,
          xsrfToken1,
          "1. POST - Üyelik İsteği"
        );
        
        if (!result1.success || !result1.data?.success) {
          throw new Error(`1. POST başarısız: ${result1.data?.message || result1.error || 'Bilinmeyen hata'}`);
        }
        
        this.instanceData.referenceId = result1.data.data.referenceId;
        this.instanceData.stepStatus.post1Completed = true;
        
        console.log(`✅ [${this.requestId}] 1. POST BAŞARILI - ReferenceId: ${this.instanceData.referenceId}`);
        
        // 5. OTP BEKLE
        await this.delay(15000);
        
        // 6. OTP KODU AL
        const otpCode = await this.getOtpCode();
        
        if (!otpCode) {
          throw new Error(`OTP kodu alınamadı (Email: ${targetEmail})`);
        }
        
        console.log(`✅ [${this.requestId}] OTP KODU HAZIR: ${otpCode}`);
        
        // 7. 2. XSRF TOKEN AL
        let xsrfToken2 = await this.getXsrfToken("step2");
        if (!xsrfToken2) {
          throw new Error("2. XSRF Token alınamadı");
        }
        
        // 8. 2. POST - OTP DOĞRULAMA
        const result2 = await this.validateOtpWithEmailCheck(xsrfToken2);
        
        if (!result2.success || !result2.data?.success || !result2.data.requestId) {
          throw new Error(`2. POST başarısız: ${result2.data?.message || result2.error || 'Bilinmeyen hata'}`);
        }
        
        this.instanceData.requestId = result2.data.requestId;
        this.instanceData.stepStatus.post2Completed = true;
        
        console.log(`✅ [${this.requestId}] 2. POST BAŞARILI - RequestId: ${this.instanceData.requestId}`);
        
        // 9. BEKLE
        await this.delay(3000);
        
        // 10. 3. XSRF TOKEN AL
        let xsrfToken3 = await this.getXsrfToken("step3");
        if (!xsrfToken3) {
          throw new Error("3. XSRF Token alınamadı");
        }
        
        // 11. KULLANICI BİLGİLERİ
        const firstName = this.getRandomTurkishName();
        const lastName = this.getRandomTurkishName();
        
        this.instanceData.userInfo.firstName = firstName;
        this.instanceData.userInfo.lastName = lastName;
        
        console.log(`🎭 [${this.requestId}] Kullanıcı: ${firstName} ${lastName}`);
        
        // 12. 3. POST - KAYIT TAMAMLAMA
        const postBody3 = {
          subscribeEmail: true,
          firstName: this.instanceData.userInfo.firstName,
          lastName: this.instanceData.userInfo.lastName,
          password: this.instanceData.userInfo.password,
          subscribeSms: true,
          requestId: this.instanceData.requestId
        };
        
        const result3 = await this.makePostRequest(
          "https://oauth.hepsiburada.com/api/authenticate/register",
          postBody3,
          xsrfToken3,
          "3. POST - Kayıt Tamamlama"
        );
        
        this.instanceData.stepStatus.post3Completed = true;
        
        if (result3.success && result3.data?.success) {
          console.log(`🎉 [${this.requestId}] KAYIT BAŞARILI!`);
          
          return {
            success: true,
            email: targetEmail,
            password: this.instanceData.userInfo.password,
            name: `${firstName} ${lastName}`,
            accessToken: result3.data.data.accessToken,
            refreshToken: result3.data.data.refreshToken,
            requestId: this.requestId,
            referenceId: this.instanceData.referenceId,
            instanceRequestId: this.instanceData.requestId,
            instanceData: this.getSummaryData()
          };
        } else {
          console.log(`❌ [${this.requestId}] KAYIT BAŞARISIZ!`);
          
          return { 
            success: false, 
            error: result3.data?.message || "Kayıt başarısız",
            requestId: this.requestId,
            referenceId: this.instanceData.referenceId,
            instanceRequestId: this.instanceData.requestId,
            instanceData: this.getSummaryData()
          };
        }
        
      } catch (error) {
        console.log(`💥 [${this.requestId}] HATA:`, error.message);
        
        return { 
          success: false, 
          error: error.message,
          requestId: this.requestId,
          referenceId: this.instanceData.referenceId,
          instanceRequestId: this.instanceData.requestId,
          instanceData: this.getSummaryData()
        };
      } finally {
        this.cleanup();
      }
    },
    
    getSummaryData: function() {
      return {
        instanceId: this.requestId,
        email: this.instanceData.email,
        referenceId: this.instanceData.referenceId,
        requestId: this.instanceData.requestId,
        userInfo: this.instanceData.userInfo,
        stepStatus: this.instanceData.stepStatus,
        cookieCount: this.instanceData.cookies.size,
        fingerprint: this.instanceData.selectedHeaders?.fingerprint
      };
    }
  };
  
  return instance;
}

// WORKER - TAM ENTEGRASYON
var worker_default = {
  async fetch(request, env, ctx) {
    console.log("=== 📥 YENİ REQUEST ===");
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    
    // ✅ SONUÇLAR ENDPOINT'İ
    if (url.pathname === "/sonuc" || url.pathname === "/sonuclar") {
      const stats = resultsManager.getStats();
      const limit = parseInt(url.searchParams.get("limit")) || 50;
      
      return new Response(JSON.stringify({
        success: true,
        istatistikler: stats,
        sonuclar: resultsManager.getResults(limit)
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // ✅ TEK SONUÇ SİL
    if (url.pathname === "/sonuc-sil" && request.method === "DELETE") {
      const { instanceId } = await request.json().catch(() => ({}));
      
      if (!instanceId) {
        return new Response(JSON.stringify({
          success: false,
          error: "instanceId gerekli"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      
      const deleted = resultsManager.deleteResult(instanceId);
      
      return new Response(JSON.stringify({
        success: deleted,
        message: deleted ? "Sonuç silindi" : "Sonuç bulunamadı"
      }, null, 2), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    // ✅ TÜM SONUÇLARI SİL
    if (url.pathname === "/tumunu-sil" && request.method === "DELETE") {
      const count = resultsManager.clearAllResults();
      
      return new Response(JSON.stringify({
        success: true,
        message: `${count} sonuç silindi`,
        count: count
      }, null, 2), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    // ✅ CRON TRIGGER
    if (url.pathname === "/cron-trigger") {
      console.log("⏰ CRON TRIGGER TETİKLENDİ");
      
      try {
        const result = await cronManager.handleContinuousCron();
        
        return new Response(JSON.stringify({
          success: true,
          message: "Cron tetikleyici çalıştı",
          cronResult: result,
          cronStatus: cronManager.getCronStatus()
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
    
    // ✅ CRON DURUM
    if (url.pathname === "/cron-durum") {
      const status = cronManager.getCronStatus();
      
      return new Response(JSON.stringify({
        cronManager: status,
        message: "Cron durumu"
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // ✅ MANUAL KAYIT
    if (url.pathname === "/kayit") {
      const instanceId = `manual_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      const registration = createIsolatedInstance(instanceId);
      const email = url.searchParams.get("email");
      
      console.log(`🎯 MANUAL KAYIT BAŞLATILIYOR - ${instanceId}`);
      
      const task = taskManager.addTask(registration.requestId, email, 'manual');
      
      ctx.waitUntil((async () => {
        try {
          const result = await registration.startRegistration(email);
          
          // ✅ SONUCU KAYDET
          resultsManager.addResult(instanceId, {
            ...result,
            source: 'manual'
          });
          
          taskManager.updateTask(registration.requestId, {
            status: result.success ? "completed" : "failed",
            endTime: new Date().toISOString(),
            result: result
          });
          
          console.log(`✅ MANUAL KAYIT TAMAMLANDI - ${instanceId}: ${result.success ? '✅' : '❌'}`);
        } catch (error) {
          console.log(`💥 MANUAL KAYIT HATA - ${instanceId}:`, error.message);
          
          taskManager.updateTask(registration.requestId, {
            status: "error",
            endTime: new Date().toISOString(),
            error: error.message
          });
        }
      })());
      
      return new Response(JSON.stringify({
        success: true,
        message: "Manual kayıt başlatıldı",
        instanceId: registration.requestId,
        email: email || "YENİ oluşturulacak",
        status: "processing",
        sonuclar: "/sonuc"
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // ✅ SİSTEM DURUMU
    if (url.pathname === "/durum") {
      const stats = resultsManager.getStats();
      
      return new Response(JSON.stringify({
        sonucIstatistikleri: stats,
        cookieManager: cookieManager.getStatus(),
        cronManager: cronManager.getCronStatus(),
        taskManager: {
          aktifGorevler: taskManager.getRecentTasks().length
        },
        message: "Sistem durumu"
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // ✅ COOKIE YENİLE
    if (url.pathname === "/cookie-yenile") {
      try {
        cookieManager.cachedCookieSets = {};
        cookieManager.lastFetchTime = 0;
        await cookieManager.refreshCookiesWithLock();
        
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
    
    // ✅ ANA SAYFA
    return new Response(JSON.stringify({
      message: "Hepsiburada Kayıt API - GELİŞMİŞ SİSTEM",
      endpoints: {
        "/kayit": "MANUAL kayıt başlat",
        "/sonuc": "SONUÇLARI görüntüle (kalıcı)",
        "/sonuc-sil": "TEK sonuç sil (DELETE)",
        "/tumunu-sil": "TÜM sonuçları sil (DELETE)",
        "/cron-trigger": "CRON tetikleyici",
        "/cron-durum": "CRON durumu",
        "/durum": "Sistem durumu",
        "/cookie-yenile": "Cookie'leri yenile"
      },
      ozellikler: {
        "💾 Kalıcı Sonuçlar": "200 sonuç saklama",
        "📊 Detaylı İstatistik": "Başarı oranı, kaynak ayrımı",
        "⏰ 7/24 Cron Desteği": "Sürekli otomatik çalışma",
        "🗑️ Manuel Silme": "Sonuçları temizleme",
        "🔒 Instance İzolasyon": "Tam güvenlik"
      }
    }, null, 2), {
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      }
    });
  }
};

export default worker_default;
