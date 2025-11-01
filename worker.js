export default {
    async fetch(request, env, ctx) {
        // Cloudflare Workers'ın DIŞARI attığı isteklerin IP'sini test et
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        const result = {
            workersOutgoingIP: ipData.ip,
            message: "HepsiBurada bu IP'yi görüyor!",
            testTime: new Date().toISOString(),
            note: "Sayfayı yenileyince IP değişecek mi bak!"
        };

        return new Response(JSON.stringify(result, null, 2), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
