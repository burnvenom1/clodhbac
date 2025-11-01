export default {
    async fetch(request, env, ctx) {
        // Farklı API'lerden IP'yi sorgula
        const [ip1, ip2, ip3] = await Promise.all([
            fetch('https://api.ipify.org?format=json').then(r => r.json()),
            fetch('https://ipapi.co/json/').then(r => r.json()),
            fetch('https://httpbin.org/ip').then(r => r.json())
        ]);

        const result = {
            ipify: ip1.ip,
            ipapi: ipapi.ip,
            httpbin: ip3.origin,
            cloudflareIP: request.headers.get('cf-connecting-ip'),
            message: "Tümü aynı IP'yi gösteriyor mu?"
        };

        return new Response(JSON.stringify(result, null, 2));
    }
} 
