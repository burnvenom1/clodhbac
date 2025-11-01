import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Email listesi
const EMAIL_LIST = [
    "jihpngpnd@emlhub.com", "tmrzfanje@emlpro.com", "wiraypzse@emlpro.com",
    "lnmwhbvvf@emltmp.com", "bshuzcvvf@emltmp.com", "hsfsqxcug@emltmp.com",
    "nqywhdnoh@emlhub.com", "048370crsm@freeml.net", "04837v1h98@freeml.net",
    "04838e039m@freeml.net", "04839mk808@freeml.net", "0483aa1zj4@freeml.net",
    "jy1c7eh2@mailpwr.com", "jy1kb68h@mailpwr.com", "jz6qk02m@mailpwr.com",
    "jz6ta9hn@mailpwr.com", "jz72a572@mailpwr.com", "jz74ndyw@mailpwr.com",
    "jz76sw1m@mailpwr.com", "manunasodun3@mimimail.me", "manun1kinyz3@mimimail.me",
    "manupefovuz3@mimimail.me", "manup0lutuj2@mimimail.me", "manusyk1taw2@mimimail.me",
    "manutinajyl3@mimimail.me", "manut0sepem3@mimimail.me", "lozydozajid2@10mail.xyz",
    "hiwemubadom2@10mail.xyz", "mobeliv1myn3@10mail.xyz", "mymib0sejyz2@10mail.xyz",
    "bohel1meken3@10mail.xyz", "b0togovojev2@10mail.xyz", "guv1s0f0tak2@10mail.xyz",
    "ahmcemzni@10mail.org", "ahmcffaeh@10mail.org", "ahmcfwpfd@10mail.org",
    "ahmcgaohd@10mail.org", "ahmcgiwye@10mail.org", "ahmcgoyfv@10mail.org",
    "ahmchfabm@10mail.org", "ahbzmfiun@yomail.info", "ahbzmxpoh@yomail.info",
    "ahbznddyb@yomail.info", "ahbznefnq@yomail.info", "ahbzognth@yomail.info",
    "ahbzoofgb@yomail.info", "ahbzoznkl@yomail.info", "jwjavzvej@emltmp.com",
    "iycfyzvej@emltmp.com", "aymjdawej@emltmp.com", "hcfuhawej@emltmp.com",
    "ztotqawej@emltmp.com", "bekxwawej@emltmp.com", "axhbbbwej@emltmp.com",
    "rhhzbqmgi@emlpro.com", "vcfdhqmgi@emlpro.com", "utcpmqmgi@emlpro.com",
    "hqnjtqmgi@emlpro.com", "qvkpyqmgi@emlpro.com", "jdawermgi@emlpro.com",
    "khhonrmgi@emlpro.com", "qwxugbxai@emlhub.com", "fejqjbxai@emlhub.com",
    "fjkwmbxai@emlhub.com", "tgyspbxai@emlhub.com", "pzbesbxai@emlhub.com",
    "qqkqubxai@emlhub.com", "tnglxbxai@emlhub.com", "04dndf7ps8@spymail.one",
    "04dndhs6fc@spymail.one", "04dndn5tw4@spymail.one", "04dndsn43c@spymail.one",
    "04dndz9z90@spymail.one", "04dne23ncg@spymail.one", "04dnebnewg@spymail.one"
];

// Global cookie storage
let globalCookies: Map<string, string> = new Map();

// Gerçekçi Header Setleri
const HEADER_SETS = [
    { // 1 - Windows 11 Chrome
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
        "SecCHUA": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Windows"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    { // 2 - Windows 10 Edge
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.188 Safari/537.36 Edg/116.0.1938.81",
        "SecCHUA": '"Chromium";v="116", "Microsoft Edge";v="116", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Windows"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    { // 3 - Windows Firefox
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        "SecCHUA": '"Not-A.Brand";v="8", "Firefox";v="121"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Windows"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    { // 4 - macOS Safari
        "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
        "SecCHUA": '"Not-A.Brand";v="8", "Safari";v="18"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"macOS"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7"
    },
    { // 5 - macOS Chrome
        "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
        "SecCHUA": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"macOS"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7"
    },
    { // 6 - Linux Chrome
        "UserAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
        "SecCHUA": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Linux"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7"
    },
    { // 7 - Android Chrome (mobile)
        "UserAgent": "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Mobile Safari/537.36",
        "SecCHUA": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?1",
        "SecCHUAPlatform": '"Android"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    { // 8 - iPhone Safari (mobile)
        "UserAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
        "SecCHUA": '"Not-A.Brand";v="8", "Safari";v="18"',
        "SecCHUAMobile": "?1",
        "SecCHUAPlatform": '"iOS"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    }
];

// Rastgele header seç
function getRandomHeaders() {
    return HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
}

// Formatlı email üret
function getFormattedEmail(): string {
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const parts = baseEmail.split('@');
    const username = parts[0];
    const domain = parts[1];
    
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart1 = "";
    let randomPart2 = "";
    
    for (let i = 0; i < 3; i++) {
        randomPart1 += chars[Math.floor(Math.random() * chars.length)];
        randomPart2 += chars[Math.floor(Math.random() * chars.length)];
    }
    
    const newEmail = `${username}.${randomPart1}@${randomPart2}.${domain}`;
    console.log(`📧 ORİJİNAL: ${baseEmail}`);
    console.log(`🔄 FORMATLI: ${newEmail}`);
    
    return newEmail;
}

// Cookie'leri güncelle
function updateCookiesFromResponse(response: Response): void {
    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) return;

    const cookies = setCookieHeader.split(/,\s*(?=\w+=)/);
    
    cookies.forEach(cookie => {
        const [nameValue, ...attributes] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        
        if (name && value) {
            globalCookies.set(name.trim(), value.trim());
            console.log(`🍪 Cookie güncellendi: ${name}=${value.substring(0,20)}...`);
        }
    });
}

// Cookie header'ını al
function getCookieHeader(): string {
    const cookies: string[] = [];
    globalCookies.forEach((value, name) => {
        cookies.push(`${name}=${value}`);
    });
    return cookies.join('; ');
}

// Fingerprint üret
function getFingerprint(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Random Türk ismi
function getRandomTurkishName(): string {
    const names = [
        "Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", 
        "Yusuf", "Ömer", "Ramazan", "Muhammed", "Süleyman", "Halil", "Osman", "Fatih",
        "Emre", "Can", "Burak", "Serkan", "Murat", "Kemal", "Orhan", "Cemal", "Selim",
        "Cengiz", "Volkan", "Uğur", "Barış", "Onur", "Mert", "Tolga", "Erhan", "Sercan",
        "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Şerife", "Zehra",
        "Sultan", "Hanife", "Havva", "Zehra", "Rabia", "Hacer", "Yasemin", "Esra", "Seda",
        "Gamze", "Derya", "Pınar", "Burcu", "Cansu", "Ebru", "Gizem", "Aslı", "Sibel"
    ];
    return names[Math.floor(Math.random() * names.length)];
}

// XSRF token al
async function getXsrfToken(selectedHeaders: any): Promise<string | null> {
    console.log("🔄 YENİ XSRF TOKEN ALINIYOR...");
    
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

    try {
        const response = await fetch("https://oauth.hepsiburada.com/api/authenticate/xsrf-token", {
            headers: headers
        });

        updateCookiesFromResponse(response);

        const cookies = response.headers.get("set-cookie");
        let xsrfToken = null;

        if (cookies) {
            const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
            if (xsrfMatch) {
                xsrfToken = decodeURIComponent(xsrfMatch[1]);
                console.log(`🔑 YENİ Token: ${xsrfToken.substring(0,20)}...`);
            }
        }

        if (xsrfToken) {
            return xsrfToken;
        } else {
            console.log("❌ Yeni Token bulunamadı");
            return null;
        }
    } catch (error) {
        console.log("❌ XSRF TOKEN HATASI:", error);
        return null;
    }
}

// OTP kodu al
async function getOtpCode(email: string): Promise<string | null> {
    const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${email}&mode=0`;
    
    console.log("📱 OTP KODU ALINIYOR...");
    
    try {
        const response = await fetch(otpUrl);
        const otpResponse = await response.text();
        
        console.log("✅ OTP SUNUCUSU YANIT VERDİ");
        
        let otpCode = null;
        const match = otpResponse.match(/\b\d{6}\b/);
        
        if (match) {
            otpCode = match[0];
        } else if (/^\d{6}$/.test(otpResponse.trim())) {
            otpCode = otpResponse.trim();
        }
        
        if (otpCode) {
            console.log(`🔢 OTP Kodu Bulundu: ${otpCode}`);
            return otpCode;
        } else {
            console.log("❌ OTP kodu bulunamadı");
            return null;
        }
    } catch (error) {
        console.log("❌ OTP KODU HATASI:", error);
        return null;
    }
}

// POST isteği yap
async function makePostRequest(url: string, body: any, xsrfToken: string | null, selectedHeaders: any) {
    const headers: any = {
        "accept": selectedHeaders.Accept,
        "accept-language": selectedHeaders.AcceptLanguage,
        "content-type": "application/json",
        "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
        "fingerprint": getFingerprint(),
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

    try {
        console.log(`📤 POST gönderiliyor: ${url}`);
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        updateCookiesFromResponse(response);
        const data = await response.json();
        
        console.log(`✅ POST başarılı: ${response.status}`);
        return {
            success: response.ok,
            data: data,
            status: response.status
        };
    } catch (error) {
        console.log(`❌ POST hatası: ${error}`);
        return { success: false, error: error.message };
    }
}

// Bekleme fonksiyonu
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ana kayıt işlemi
async function startRegistration(email: string) {
    console.log("🚀 HEPSİBURADA OTOMATİK KAYIT SCRIPTİ");
    console.log("==========================================");
    console.log(`✅ KULLANILACAK EMAIL: ${email}`);
    
    // Rastgele header seç
    const selectedHeaders = getRandomHeaders();
    console.log(`🖥️  Seçilen Header Set: ${selectedHeaders.SecCHUAPlatform} - ${selectedHeaders.UserAgent.split(' ')[2]}`);
    
    const fingerprint = getFingerprint();
    console.log(`🔑 FINGERPRINT: ${fingerprint}`);

    // 1. POST: Üyelik İsteği
    console.log("📧 1. POST: ÜYELİK İSTEĞİ GÖNDERİLİYOR...");
    
    let xsrfToken = await getXsrfToken(selectedHeaders);
    if (!xsrfToken) {
        console.log("⚠️ İlk token alınamadı ama devam ediyoruz...");
    }

    const postBody1 = {
        email: email,
        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
    };

    const result1 = await makePostRequest(
        "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
        postBody1,
        xsrfToken,
        selectedHeaders
    );

    if (result1.success && result1.data.success) {
        console.log(`🎉 1. POST BAŞARILI - REFERENCE ID: ${result1.data.data.referenceId}`);
        
        // OTP için bekle
        console.log("⏳ OTP email'inin gelmesi bekleniyor (15 saniye)...");
        await delay(15000);
        
        // OTP Kodu al
        const otpCode = await getOtpCode(email);
        
        if (otpCode) {
            console.log(`🎯 OTP KODU HAZIR: ${otpCode}`);
            
            // 2. POST: OTP Doğrulama
            console.log("📧 2. POST: OTP DOĞRULAMA GÖNDERİLİYOR...");
            
            xsrfToken = await getXsrfToken(selectedHeaders);
            
            const postBody2 = {
                otpReference: result1.data.data.referenceId,
                otpCode: otpCode
            };

            const result2 = await makePostRequest(
                "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
                postBody2,
                xsrfToken,
                selectedHeaders
            );

            if (result2.success && result2.data.success && result2.data.requestId) {
                console.log(`🎉 2. POST BAŞARILI - REQUEST ID: ${result2.data.requestId}`);
                
                // Kısa bekleme
                console.log("⏳ Session stabilizasyonu (3 saniye)...");
                await delay(3000);
                
                // 3. POST: Kayıt Tamamlama
                console.log("📝 3. POST: KAYIT İŞLEMİ TAMAMLANIYOR...");
                
                xsrfToken = await getXsrfToken(selectedHeaders);
                
                // Random bilgiler
                const firstName = getRandomTurkishName();
                const lastName = getRandomTurkishName();
                const password = "Hepsiburada1";

                console.log("🎭 Kullanıcı Bilgileri:");
                console.log(`   👤 Ad: ${firstName} ${lastName}`);
                console.log(`   🔑 Şifre: ${password}`);
                console.log(`   📨 Email: ${email}`);

                const postBody3 = {
                    subscribeEmail: false,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    subscribeSms: false,
                    returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=0fe1789b3dee47458bdf70864a6a9931&code_challenge=1y2GcO5myCuDr8SsID6yMQyi5ZE6I_A9sJhKwYEgnpU&code_challenge_method=S256&response_mode=query",
                    requestId: result2.data.requestId
                };

                const result3 = await makePostRequest(
                    "https://oauth.hepsiburada.com/api/authenticate/register",
                    postBody3,
                    xsrfToken,
                    selectedHeaders
                );

                if (result3.success && result3.data.success) {
                    console.log("🎉 KAYIT BAŞARILI!");
                    
                    if (result3.data.data.accessToken) {
                        console.log(`🔑 ACCESS TOKEN: ${result3.data.data.accessToken}`);
                    }
                    if (result3.data.data.refreshToken) {
                        console.log(`🔄 REFRESH TOKEN: ${result3.data.data.refreshToken}`);
                    }
                    
                    console.log("✅ HESAP BİLGİLERİ:");
                    console.log(`   📧 Email: ${email}`);
                    console.log(`   🔑 Şifre: ${password}`);
                    console.log(`   👤 Ad Soyad: ${firstName} ${lastName}`);
                    
                    return {
                        success: true,
                        email: email,
                        password: password,
                        name: `${firstName} ${lastName}`,
                        accessToken: result3.data.data.accessToken,
                        refreshToken: result3.data.data.refreshToken
                    };
                } else {
                    console.log(`❌ Kayıt başarısız: ${result3.data?.message || 'Bilinmeyen hata'}`);
                    return { success: false, error: result3.data?.message };
                }
            } else {
                console.log("❌ 2. POST başarısız veya requestId alınamadı!");
                return { success: false, error: "OTP doğrulama başarısız" };
            }
        } else {
            console.log("❌ OTP kodu alınamadı!");
            return { success: false, error: "OTP alınamadı" };
        }
    } else {
        console.log("❌ 1. POST başarısız!");
        return { success: false, error: "Kayıt isteği başarısız" };
    }
}

// API server
serve(async (req: Request) => {
    const url = new URL(req.url);
    
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // Otomatik kayıt endpoint'i
    if (url.pathname === "/register") {
        try {
            const email = url.searchParams.get("email") || getFormattedEmail();
            const result = await startRegistration(email);
            
            return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                error: error.message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
    }

    // Cookie durumu
    if (url.pathname === "/cookies") {
        const cookieArray = Array.from(globalCookies.entries()).map(([name, value]) => ({
            name,
            value: value.substring(0, 50) + (value.length > 50 ? "..." : "")
        }));

        return new Response(JSON.stringify({
            cookieCount: globalCookies.size,
            cookies: cookieArray
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }

    return new Response(JSON.stringify({
        message: "Hepsiburada Otomatik Kayıt API",
        endpoints: {
            "/register?email=test@example.com": "Kayıt başlat",
            "/cookies": "Cookie durumunu göster"
        }
    }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
    });
});
