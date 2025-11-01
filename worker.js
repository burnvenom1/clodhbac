// Email listesi
const EMAIL_LIST = [
    "jihpngpnd@emlhub.com", "tmrzfanje@emlpro.com", "wiraypzse@emlpro.com",
    "lnmwhbvvf@emltmp.com", "bshuzcvvf@emltmp.com", "hsfsqxcug@emltmp.com"
];

// Global cookie storage
let globalCookies = new Map();

// Header Setleri
const HEADER_SETS = [
    {
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "SecCHUA": '"Chromium";v="120", "Google Chrome";v="120", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Windows"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    {
        "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "SecCHUA": '"Not-A.Brand";v="8", "Safari";v="17"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"macOS"',
        "Accept": "application/json, text/plain, */*", 
        "AcceptLanguage": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7"
    }
];

// Yardımcı fonksiyonlar
function getRandomHeaders() {
    return HEADER_SETS[Math.floor(Math.random() * HEADER_SETS.length)];
}

function getFormattedEmail() {
    const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
    const [username, domain] = baseEmail.split('@');
    const random1 = Math.random().toString(36).substring(2, 5);
    const random2 = Math.random().toString(36).substring(2, 5);
    return `${username}.${random1}@${random2}.${domain}`;
}

function updateCookiesFromResponse(response) {
    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) return;

    const cookies = setCookieHeader.split(/,\s*(?=\w+=)/);
    cookies.forEach(cookie => {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
            globalCookies.set(name.trim(), value.trim());
        }
    });
}

function getCookieHeader() {
    const cookies = [];
    globalCookies.forEach((value, name) => {
        cookies.push(`${name}=${value}`);
    });
    return cookies.join('; ');
}

function getFingerprint() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomTurkishName() {
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "Yusuf", "Ömer", "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif"];
    return names[Math.floor(Math.random() * names.length)];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// XSRF token al
async function getXsrfToken(selectedHeaders) {
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
            }
        }

        return xsrfToken;
    } catch (error) {
        return null;
    }
}

// OTP kodu al
async function getOtpCode(email) {
    const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${email}&mode=0`;
    
    try {
        const response = await fetch(otpUrl);
        const otpResponse = await response.text();
        
        let otpCode = null;
        const match = otpResponse.match(/\b\d{6}\b/);
        
        if (match) {
            otpCode = match[0];
        } else if (/^\d{6}$/.test(otpResponse.trim())) {
            otpCode = otpResponse.trim();
        }
        
        return otpCode;
    } catch (error) {
        return null;
    }
}

// POST isteği yap
async function makePostRequest(url, body, xsrfToken, selectedHeaders) {
    const headers = {
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
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        updateCookiesFromResponse(response);
        const data = await response.json();
        
        return {
            success: response.ok,
            data: data,
            status: response.status
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Ana kayıt fonksiyonu - BACKGROUND'da çalışır
async function startRegistration(email) {
    try {
        console.log(`🚀 BACKGROUND: Kayıt başlatılıyor - ${email}`);
        
        const selectedHeaders = getRandomHeaders();
        const fingerprint = getFingerprint();

        // 1. XSRF Token al
        let xsrfToken = await getXsrfToken(selectedHeaders);
        console.log(`🔑 BACKGROUND: XSRF Token alındı`);

        // 1. POST: Üyelik İsteği
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
            console.log(`✅ BACKGROUND: Kayıt isteği başarılı - Reference: ${result1.data.data.referenceId}`);
            
            // OTP için bekle - BACKGROUND'da sorun yok
            console.log(`⏳ BACKGROUND: 15 saniye bekleniyor...`);
            await delay(15000);
            
            // OTP Kodu al
            const otpCode = await getOtpCode(email);
            
            if (otpCode) {
                console.log(`🔢 BACKGROUND: OTP alındı: ${otpCode}`);
                
                // 2. POST: OTP Doğrulama
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
                    console.log(`✅ BACKGROUND: OTP doğrulama başarılı - Request: ${result2.data.requestId}`);
                    
                    // Kısa bekleme
                    await delay(3000);
                    
                    // 3. POST: Kayıt Tamamlama
                    xsrfToken = await getXsrfToken(selectedHeaders);
                    
                    const firstName = getRandomTurkishName();
                    const lastName = getRandomTurkishName();
                    const password = "Hepsiburada1";

                    console.log(`👤 BACKGROUND: Kullanıcı bilgileri - ${firstName} ${lastName}`);

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
                        console.log(`🎉 BACKGROUND: Kayıt BAŞARILI - ${email}`);
                        console.log(`🔑 ACCESS TOKEN: ${result3.data.data.accessToken}`);
                    } else {
                        console.log(`❌ BACKGROUND: Kayıt başarısız - ${result3.data?.message}`);
                    }
                } else {
                    console.log(`❌ BACKGROUND: OTP doğrulama başarısız`);
                }
            } else {
                console.log(`❌ BACKGROUND: OTP alınamadı`);
            }
        } else {
            console.log(`❌ BACKGROUND: Kayıt isteği başarısız`);
        }
    } catch (error) {
        console.log(`💥 BACKGROUND Hata: ${error.message}`);
    }
}

// Cloudflare Workers handler
export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        
        // Otomatik kayıt endpoint'i
        if (url.pathname === "/register") {
            try {
                const email = url.searchParams.get("email") || getFormattedEmail();
                
                // ⚡ HIZLI RESPONSE - 10ms altında
                const response = new Response(JSON.stringify({
                    status: "processing",
                    message: "Kayıt işlemi başlatıldı",
                    email: email,
                    id: Date.now(),
                    note: "İşlem arka planda devam ediyor, logları kontrol edin"
                }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });

                // 🎯 UZUN İŞLEMİ BACKGROUND'A AT
                ctx.waitUntil(startRegistration(email));
                
                return response; // ⚡ 2-3ms'de response dön
                
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

        // Ana sayfa
        return new Response(JSON.stringify({
            message: "Hepsiburada Otomatik Kayıt API",
            endpoints: {
                "/register": "Kayıt başlat (GET veya POST)",
                "/register?email=test@example.com": "Belirli email ile kayıt",
                "/cookies": "Cookie durumunu göster"
            }
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
}
