export default {
    async fetch(request, env, ctx) {
        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7", 
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "referer": "https://giris.hepsiburada.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        };

        try {
            const response = await fetch("https://oauth.hepsiburada.com/api/authenticate/xsrf-token", {
                method: "GET",
                headers: headers
            });

            const cookies = response.headers.get('set-cookie');
            let xsrfToken = null;

            if (cookies) {
                const match = cookies.match(/XSRF-TOKEN=([^;]+)/);
                if (match) xsrfToken = decodeURIComponent(match[1]);
            }

            return new Response(JSON.stringify({
                success: response.status === 200,
                status: response.status,
                xsrfToken: xsrfToken,
                cookies: cookies
            }, null, 2), {
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                error: error.message
            }, null, 2), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
}
