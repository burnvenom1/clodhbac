export default {
    async fetch(request, env, ctx) {
        // Farklı IP servislerini dene
        let ipResults = {};
        
        try {
            // 1. httpbin.org - en güvenilir
            const httpbin = await fetch('https://httpbin.org/ip');
            const httpbinData = await httpbin.json();
            ipResults.httpbin = httpbinData.origin;
        } catch (e) {
            ipResults.httpbin = 'Hata: ' + e.message;
        }
        
        try {
            // 2. ipify.org - alternatif
            const ipify = await fetch('https://api.ipify.org?format=json');
            const ipifyData = await ipify.json();
            ipResults.ipify = ipifyData.ip;
        } catch (e) {
            ipResults.ipify = 'Hata: ' + e.message;
        }
        
        try {
            // 3. JSONIP.com - basit
            const jsonip = await fetch('https://jsonip.com');
            const jsonipData = await jsonip.json();
            ipResults.jsonip = jsonipData.ip;
        } catch (e) {
            ipResults.jsonip = 'Hata: ' + e.message;
        }

        const result = {
            ipResults: ipResults,
            message: "HepsiBurada hangi IP'yi görüyor?",
            testTime: new Date().toISOString(),
            note: "httpbin.org en güvenilir sonucu verir"
        };

        return new Response(JSON.stringify(result, null, 2), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
