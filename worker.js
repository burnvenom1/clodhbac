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
    
    // 🎯 TAM İZOLASYONLU KAYIT
    if (url.pathname === "/register") {
      const registration = createIsolatedRegistration();
      const email = url.searchParams.get("email") || registration.getFormattedEmail();
      
      console.log(`🎯 PARALEL KAYIT BAŞLATILIYOR - Instance: ${registration.requestId}, Email: ${email}`);
      
      // 👇 TASK MANAGER İLE İZOLASYONLU KAYIT
      const task = taskManager.addTask(registration.requestId, email);
      
      // 👇 ARKA PLANDA ÇALIŞTIR - TAM İZOLASYON
      ctx.waitUntil((async () => {
        try {
          console.log(`🚀 ARKA PLAN BAŞLADI - Instance: ${registration.requestId}`);
          
          const result = await registration.startRegistration(email);
          
          // 👇 TASK MANAGER İLE GÜVENLİ GÜNCELLEME
          taskManager.updateTask(registration.requestId, {
            status: result.success ? "completed" : "failed",
            endTime: new Date().toISOString(),
            result: result
          });
          
          console.log(`✅ ARKA PLAN TAMAMLANDI - Instance: ${registration.requestId}, Success: ${result.success}`);
        } catch (error) {
          console.log(`💥 ARKA PLAN HATA - Instance: ${registration.requestId}, Error: ${error.message}`);
          
          // 👇 TASK MANAGER İLE GÜVENLİ HATA KAYDI
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
    
    // 📊 SON İŞLEMLER - TASK MANAGER İLE
    if (url.pathname === "/recent-tasks") {
      const stats = taskManager.getStats();
      
      return new Response(JSON.stringify(stats, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // 🔧 COOKIE YÖNETİCİ DURUMU
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
        cookieManager.cachedCookieSets = {};
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
    
    // 🧹 TASK'LERİ TEMİZLE
    if (url.pathname === "/clear-tasks") {
      taskManager.tasks.clear();
      
      return new Response(JSON.stringify({
        success: true,
        message: "Tüm task'ler temizlendi",
        remainingTasks: taskManager.tasks.size
      }, null, 2), {
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        }
      });
    }
    
    // 📋 ANA SAYFA
    return new Response(JSON.stringify({
      message: "Hepsiburada Kayıt API - Tam İzole Versiyon",
      endpoints: {
        "/register": "Tam izole paralel kayıt başlat",
        "/recent-tasks": "Son işlemleri görüntüle", 
        "/cookie-status": "Sistem durumu",
        "/refresh-cookies": "Cookie'leri yenile",
        "/clear-tasks": "Task'leri temizle"
      },
      features: {
        "Tam Instance İzolasyonu": "Her instance kendi cookie set'ini alır",
        "Thread-Safe Task Management": "Map tabanlı güvenli task yönetimi",
        "Instance Bazlı Cookie": "Her instance unique cookie set alır", 
        "Race Condition Protection": "Hash bazlı set dağıtımı"
      }
    }, null, 2), {
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      }
    });
  }
};
