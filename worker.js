// Email listesi
const EMAIL_LIST = [
    "jihpngpnd@emlhub.com", "tmrzfanje@emlpro.com", "wiraypzse@emlpro.com",
    "lnmwhbvvf@emltmp.com", "bshuzcvvf@emltmp.com", "hsfsqxcug@emltmp.com"
];

// Global cookie storage
let globalCookies = new Map();
let isProcessing = false;

// Chrome Cookies
const CHROME_COOKIES = [
    { name: "AKA_A2", value: "A", domain: ".hepsiburada.com", path: "/", secure: true, httpOnly: true },
    { name: "ak_bmsc", value: "6DD73A08578554295F40B28C2A079381~000000000000000000000000000000~YAAQt8YTAp9SqzCaAQAAy3kqNh0x8/1aNqvrYA7vSxYiLgmUIGOUq/gcq29fFniGnRHus+1ZEo2agHqlqSGA0RXCfHvX+owtx8/tApIoZaOUWUk6TxQ2KJ69ArEL5jZac38YcX80IPkv8H1qfu+w07c3fwzRgQA2O8s5zXBI1MjqmTrMXRSK9K1Llyp2awcA//FZXIfebLcdPzqNjKclqi3VidJxkhyxEmDFrEa730pmqrxwb+oeHT9SXqhv0FfyGLLNIUXpumlXgmhKhIdbsgB4SmkdGTsaynyZkawjnSFdh90CzDo3QKQ4C+EX6s3JzLpP2T4jSCQX78Rx408w5uEJDAy9i3bFGS6UusFj0hZ9kTV6Id1RTN4Joicu1Q/c+WgnEMRZdQOWRf4qf69DEp+b", domain: ".hepsiburada.com", path: "/", secure: false, httpOnly: true },
    // ... diğer cookie'ler
];

// Header Setleri
const HEADER_SETS = [
    {
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "SecCHUA": '"Chromium";v="120", "Google Chrome";v="120", "Not-A.Brand";v="8"',
        "SecCHUAMobile": "?0",
        "SecCHUAPlatform": '"Windows"',
        "Accept": "application/json, text/plain, */*",
        "AcceptLanguage": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
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

function getFingerprint() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomTurkishName() {
    const names = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Ayşe", "Fatma", "Zeynep"];
    return names[Math.floor(Math.random() * names.length)];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeCookies() {
    CHROME_COOKIES.forEach(cookie => {
        globalCookies.set(cookie.name, cookie.value);
    });
}

function getCookieHeader() {
    const cookies = [];
    globalCookies.forEach((value, name) => {
        cookies.push(`${name}=${value}`);
    });
    return cookies.join('; ');
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

// XSRF token al
async function getXsrfToken(selectedHeaders) {
    console.log('🔄 XSRF Token alınıyor...');
    
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

        console.log('📡 XSRF Response Status:', response.status);
        updateCookiesFromResponse(response);

        const cookies = response.headers.get("set-cookie");
        let xsrfToken = null;

        if (cookies) {
            const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
            if (xsrfMatch) {
                xsrfToken = decodeURIComponent(xsrfMatch[1]);
                console.log('✅ XSRF Token alındı:', xsrfToken.substring(0, 20) + '...');
            }
        }

        return xsrfToken;
    } catch (error) {
        console.log('❌ XSRF Token hatası:', error.message);
        return null;
    }
}

// OTP kodu al
async function getOtpCode(email) {
    const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${encodeURIComponent(email)}&mode=0`;
    
    console.log('📧 OTP API çağrılıyor...');
    console.log('🔗 OTP URL:', otpUrl);
    
    try {
        const response = await fetch(otpUrl, {
            redirect: 'follow'
        });
        
        console.log('📨 OTP Response Status:', response.status);
        console.log('📨 OTP Response OK:', response.ok);
        
        const otpResponse = await response.text();
        console.log('📄 OTP Response Body:', otpResponse);
        
        let otpCode = null;
        const match = otpResponse.match(/\b\d{6}\b/);
        
        if (match) {
            otpCode = match[0];
        } else if (/^\d{6}$/.test(otpResponse.trim())) {
            otpCode = otpResponse.trim();
        }
        
        if (otpCode) {
            console.log('✅ OTP Kodu bulundu:', otpCode);
        } else {
            console.log('❌ OTP kodu bulunamadı');
        }
        
        return otpCode;
    } catch (error) {
        console.log('❌ OTP Hatası:', error.message);
        return null;
    }
}

// POST isteği yap
async function makePostRequest(url, body, xsrfToken, selectedHeaders) {
    console.log('📤 POST isteği gönderiliyor:', url);
    
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

        console.log('📡 POST Response Status:', response.status);
        updateCookiesFromResponse(response);
        const data = await response.json();
        
        console.log('📊 POST Response Data:', JSON.stringify(data).substring(0, 200) + '...');
        
        return {
            success: response.ok,
            data: data,
            status: response.status
        };
    } catch (error) {
        console.log('❌ POST Hatası:', error.message);
        return { success: false, error: error.message };
    }
}

// ANA KAYIT İŞLEMİ
async function startRegistration(email) {
    if (isProcessing) {
        console.log('⏳ Zaten işlem devam ediyor...');
        return { success: false, error: "Zaten işlem devam ediyor" };
    }
    
    isProcessing = true;
    console.log('🚀 KAYIT BAŞLATILIYOR:', email);
    
    try {
        // Cookie'leri başlat
        initializeCookies();
        
        const selectedHeaders = getRandomHeaders();
        const fingerprint = getFingerprint();
        console.log('🖥️ Seçilen Header:', selectedHeaders.SecCHUAPlatform);

        // 1. XSRF Token al
        let xsrfToken = await getXsrfToken(selectedHeaders);

        // 1. POST: Üyelik İsteği
        const postBody1 = {
            email: email,
            returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
        };

        console.log('📧 1. POST gönderiliyor...');
        const result1 = await makePostRequest(
            "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest",
            postBody1,
            xsrfToken,
            selectedHeaders
        );

        if (result1.success && result1.data.success) {
            console.log('✅ 1. POST başarılı, OTP bekleniyor (20 saniye)...');
            
            // OTP için 20 saniye bekle
            await delay(20000);
            
            console.log('📧 OTP kodu alınıyor...');
            // OTP Kodu al
            const otpCode = await getOtpCode(email);
            
            if (otpCode) {
                console.log('✅ OTP kodu alındı, doğrulama yapılıyor...');
                
                // 2. POST: OTP Doğrulama
                xsrfToken = await getXsrfToken(selectedHeaders);
                
                const postBody2 = {
                    otpReference: result1.data.data.referenceId,
                    otpCode: otpCode
                };

                console.log('🔐 2. POST gönderiliyor...');
                const result2 = await makePostRequest(
                    "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp",
                    postBody2,
                    xsrfToken,
                    selectedHeaders
                );

                if (result2.success && result2.data.success && result2.data.requestId) {
                    console.log('✅ OTP doğrulama başarılı, kayıt tamamlanıyor...');
                    
                    // Kısa bekleme
                    await delay(3000);
                    
                    // 3. POST: Kayıt Tamamlama
                    xsrfToken = await getXsrfToken(selectedHeaders);
                    
                    const firstName = getRandomTurkishName();
                    const lastName = getRandomTurkishName();
                    const password = "Hepsiburada1";

                    console.log('👤 Kullanıcı bilgileri:', firstName, lastName);

                    const postBody3 = {
                        subscribeEmail: false,
                        firstName: firstName,
                        lastName: lastName,
                        password: password,
                        subscribeSms: false,
                        returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=0fe1789b3dee47458bdf70864a6a9931&code_challenge=1y2GcO5myCuDr8SsID6yMQyi5ZE6I_A9sJhKwYEgnpU&code_challenge_method=S256&response_mode=query",
                        requestId: result2.data.requestId
                    };

                    console.log('📝 3. POST gönderiliyor...');
                    const result3 = await makePostRequest(
                        "https://oauth.hepsiburada.com/api/authenticate/register",
                        postBody3,
                        xsrfToken,
                        selectedHeaders
                    );

                    if (result3.success && result3.data.success) {
                        console.log('🎉 KAYIT BAŞARILI!');
                        return {
                            success: true,
                            email: email,
                            password: password,
                            name: `${firstName} ${lastName}`,
                            accessToken: result3.data.data.accessToken,
                            refreshToken: result3.data.data.refreshToken
                        };
                    } else {
                        console.log('❌ Kayıt başarısız');
                        return { success: false, error: result3.data?.message };
                    }
                } else {
                    console.log('❌ OTP doğrulama başarısız');
                    return { success: false, error: "OTP doğrulama başarısız" };
                }
            } else {
                console.log('❌ OTP kodu alınamadı');
                return { success: false, error: "OTP alınamadı" };
            }
        } else {
            console.log('❌ Kayıt isteği başarısız');
            return { success: false, error: "Kayıt isteği başarısız" };
        }
    } catch (error) {
        console.log('💥 Genel hata:', error.message);
        return { success: false, error: error.message };
    } finally {
        isProcessing = false;
        console.log('🔄 İşlem durumu sıfırlandı');
    }
}

// Cloudflare Workers handler
export default {
    async fetch(request, env, ctx) {
        console.log('📥 Yeni request:', request.url);
        
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        
        if (url.pathname === "/register") {
            try {
                const email = url.searchParams.get("email") || getFormattedEmail();
                console.log('🎯 Kayıt başlatılıyor, email:', email);
                
                const result = await startRegistration(email);
                console.log('📤 Kayıt sonucu gönderiliyor:', result.success);
                
                return new Response(JSON.stringify(result), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
                
            } catch (error) {
                console.log('💥 API hatası:', error.message);
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }
        }

        return new Response(JSON.stringify({
            message: "Hepsiburada Otomatik Kayıt API",
            endpoints: { "/register": "Kayıt başlat" }
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
}
