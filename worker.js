// Cloudflare Workers için XSRF Token alma - BİREBİR AYNI
async function getNewXsrfToken() {
    console.log("🔄 YENİ XSRF TOKEN ALINIYOR...");
    
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Opera\";v=\"122\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "referer": "https://giris.hepsiburada.com/"
    };

    try {
        const response = await fetch("https://oauth.hepsiburada.com/api/authenticate/xsrf-token", {
            method: "GET",
            headers: headers,
            mode: "cors",
            credentials: "include"
        });

        console.log(`✅ Status: ${response.status}`);
        
        // Tüm response'u göster
        const cookies = response.headers.get('set-cookie');
        const responseText = await response.text();
        
        const result = {
            success: response.ok,
            status: response.status,
            cookies: cookies,
            body: responseText,
            headers: Object.fromEntries(response.headers.entries())
        };

        console.log("📊 Result:", JSON.stringify(result, null, 2));
        return result;
        
    } catch (error) {
        console.log("❌ HATA: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Kullanımı:
export default {
    async fetch(request, env, ctx) {
        const result = await getNewXsrfToken();
        
        return new Response(JSON.stringify(result, null, 2), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
} 
