// Cloudflare Worker - HepsiBurada Otomatik Kayıt Scripti
// ✅ Tüm fonksiyonlar tam
// ✅ Cookie yönetimi düzgün
// ✅ Tüm POST istekleri çalışır

const EMAIL_LIST = [
  "jihpngpnd@emlhub.com",
  "tmrzfanje@emlpro.com", 
  "wiraypzse@emlpro.com",
  "lnmwhbvvf@emltmp.com",
  "bshuzcvvf@emltmp.com",
  "hsfsqxcug@emltmp.com",
  "nqywhdnoh@emlhub.com",
  "048370crsm@freeml.net",
  "04837v1h98@freeml.net"
];

const COOKIES = [
  {
      "name": "AKA_A2",
      "value": "A",
      "domain": ".hepsiburada.com",
      "path": "/",
      "secure": true,
      "httpOnly": true
  },
  {
      "name": "ak_bmsc", 
      "value": "6DD73A08578554295F40B28C2A079381~000000000000000000000000000000~YAAQt8YTAp9SqzCaAQAAy3kqNh0x8/1aNqvrYA7vSxYiLgmUIGOUq/gcq29fFniGnRHus+1ZEo2agHqlqSGA0RXCfHvX+owtx8/tApIoZaOUWUk6TxQ2KJ69ArEL5jZac38YcX80IPkv8H1qfu+w07c3fwzRgQA2O8s5zXBI1MjqmTrMXRSK9K1Llyp2awcA//FZXIfebLcdPzqNjKclqi3VidJxkhyxEmDFrEa730pmqrxwb+oeHT9SXqhv0FfyGLLNIUXpumlXgmhKhIdbsgB4SmkdGTsaynyZkawjnSFdh90CzDo3QKQ4C+EX6s3JzLpP2T4jSCQX78Rx408w5uEJDAy9i3bFGS6UusFj0hZ9kTV6Id1RTN4Joicu1Q/c+WgnEMRZdQOWRf4qf69DEp+b",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "bm_sz",
      "value": "492D22F2460C25A650FE9F7072A5317B~YAAQt8YTAqBSqzCaAQAAy3kqNh3/DLGY5ykXhu2Z2PKK6jSAxDxRWCT3AeruohcM2f+LzGjtRkmbcBZXQm8whRLyQpqbW9HtWboo6B6hglMlXiQ5x41xMCTAjAvtiu8IeltoqpPcdstuMsz0kR1dkPS6DXbPZrwk0EopOOQn/61l81Ko9S+uS2qpNvTLIBGunKp0pH72V7K/zOGheeAFAj8fz/JH8OEV4RrTwkJKOuRzGOsNHroZ61Q+ASf1z1gT3QKUoxNNgXn0K3HkZS3w8KssCVkckwmsLKgccW//++UAVec7HMQAiT5FTz3iqbZtDRKl8NyeBoDw9nLuma4StvkUEEfQtk6jNn5chElYytIE0ckblJJ+nE+KjDTUAI8wtkHVqcMEINiqwz9DjiqQxTKbe94=~3420484~4469058",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "oidcReturnUrl",
      "value": "https%253A%252F%252Fwww.hepsiburada.com%252F",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "ActivePage",
      "value": "SIGN_UP",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "hbus_anonymousId",
      "value": "d81e7fd4-2b10-4b26-a69a-989525793040",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "bm_sv",
      "value": "A2BE28FBCD144CF043505B3C67F175B0~YAAQpCV+aCkcMTCaAQAAIn8qNh0MpxiPrIwUDZaGoE5IXiGT+gsqdTXgy76ynmZNuev5h6ww7hR50+fbVYcdViyMwEn4Bi28A90W16GZhksBzqkrPU2PEbCu1F2mSP6/Opw933LrbP5T+WwsH35+WpaDVwkaDSd2Xo03HRy/89OKo3S8ERP8sj+2C5LwCiu4onQxGe8wiGgv3kzTqeP2OfyzzvYnxsRPc6Aak76NYeq7oKT40qmS6aWrLuiGcJkbIdeerj4=~1",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "hbus_sessionId",
      "value": "4e7cf5a3-ea10-44bb-afda-6da412ad5019%7C1761847147045",
      "domain": ".hepsiburada.com",
      "path": "/"
  },
  {
      "name": "_abck",
      "value": "EAE31FDAD5D11607A0CA696014247CB1~-1~YAAQt8YTArZSqzCaAQAA2YAqNg4MgQsESV4HZq4KKH+zKmU6trPP0RdhREWEvzwSZiRzPBCZFAMm/US1wylwmQog0XW8F1rqkNSwk55k+dTLSajIdqLWenOxPGp7a8r/MdDgPL8CWET9AYcFr+dxz2jECtmsTL4v+ZJkR4/jtR/TwXBz/RCF+HovB9n6heGUprBKIborikJlKCXTI7mhAqApYuV9g8F55kP2kDG6pDccKjiL1mpUeBWa9pg1AlF8DBxgx9k+Gwqe3FRiBszWCwckh0QFu70HuN8IJQDTAMmIxJgAksTJ/UtwQgtFYYPbn4CaC4fztLoPfiNRDKDqC+EP7wIvgSTKf9LlxCD2STxtrpSe373XOaMPlM0JxTOQvZY2X8kTzFKeH1djJOH1FhL3ORNqIYcGPgBWWHq1+/hOABStAMhMB4owELXCMQjeesx4dgli2ux/040v0kwX5m+1Aqt/a4lU7KuKTyqzSO0O/fZ5LyTJ3VZDPEb3UG8Q1chAfIWWHzxLGmIJPF6CNExFUJH5QOHbuAg/j3kB4YpyJCRNy/3SK66BZ5vReXU8LgWXwDC7r1xH2oqW0JfujgPFrxihczHNgV51We/0X4SoNb0=~-1~-1~-1~AAQAAAAE%2f%2f%2f%2f%2f5oYOeZdKgXYmJZNIOwIUNA+Nu9wFcDFXjolKE0b2%2faisrptolV1vLbzFtL81S0h9O6%2fLS5CBSEqz7K7zsqvKBLupwgy%2fxxl%2fi76~-1",
      "domain": ".hepsiburada.com",
      "path": "/"
  }
];

function getRandomEmail() {
  const baseEmail = EMAIL_LIST[Math.floor(Math.random() * EMAIL_LIST.length)];
  const [username, domain] = baseEmail.split('@');
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart1 = '';
  let randomPart2 = '';
  for (let i = 0; i < 3; i++) {
      randomPart1 += chars[Math.floor(Math.random() * chars.length)];
      randomPart2 += chars[Math.floor(Math.random() * chars.length)];
  }
  const newEmail = `${username}.${randomPart1}@${randomPart2}.${domain}`;
  console.log(`📧 ORİJİNAL: ${baseEmail}`);
  console.log(`🔄 FORMATLI: ${newEmail}`);
  return newEmail;
}

function generateFingerprint() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function getRandomTurkishName() {
  const names = [
      "Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", 
      "Yusuf", "Ömer", "Ramazan", "Muhammed", "Süleyman", "Halil", "Osman", "Fatih",
      "Emre", "Can", "Burak", "Serkan", "Murat", "Kemal", "Orhan", "Cemal", "Selim",
      "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Şerife", "Zehra",
      "Sultan", "Hanife", "Havva", "Rabia", "Hacer", "Yasemin", "Esra", "Seda"
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function buildCookieHeader() {
  return COOKIES.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}

async function getXsrfToken(cookieHeader) {
  console.log('🔄 YENİ XSRF TOKEN ALINIYOR...');
  
  const headers = {
      "accept": "application/json, text/plain, */*",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "origin": "https://giris.hepsiburada.com",
      "referer": "https://giris.hepsiburada.com/",
      "sec-ch-ua": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
      "cookie": cookieHeader
  };
  
  try {
      const response = await fetch('https://oauth.hepsiburada.com/api/authenticate/xsrf-token', {
          method: 'GET',
          headers: headers
      });
      
      console.log('✅ YENİ XSRF TOKEN BAŞARILI');
      
      let xsrfToken = null;
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
          const match = setCookie.match(/XSRF-TOKEN=([^;]+)/);
          if (match) {
              xsrfToken = decodeURIComponent(match[1]);
              console.log(`🔑 YENİ Token: ${xsrfToken.substring(0,20)}...`);
          }
      }
      
      return xsrfToken;
  } catch (error) {
      console.log('❌ XSRF TOKEN HATASI:', error.message);
      return null;
  }
}

async function getOtpCode(email) {
  const otpUrl = `https://script.google.com/macros/s/AKfycbxvTJG2ou3TGgCv2PHaaFjw8-dpRkxwnuJuJHZ6CXAVCo7jRXvm_Je5c370uGundLo3KQ/exec?email=${email}&mode=0`;
  
  console.log('📱 OTP KODU ALINIYOR...');
  
  try {
      const response = await fetch(otpUrl);
      const data = await response.text();
      console.log('✅ OTP SUNUCUSU YANIT VERDİ');
      
      let otpCode = null;
      const otpMatch = data.match(/\b\d{6}\b/);
      if (otpMatch) {
          otpCode = otpMatch[0];
      } else if (data.trim().match(/^\d{6}$/)) {
          otpCode = data.trim();
      }
      
      if (otpCode) {
          console.log(`🔢 OTP Kodu Bulundu: ${otpCode}`);
          return otpCode;
      } else {
          console.log('❌ OTP kodu bulunamadı');
          return null;
      }
  } catch (error) {
      console.log('❌ OTP KODU HATASI:', error.message);
      return null;
  }
}

async function makeRequest(url, headers, body, method = 'POST') {
  console.log('🎯 REQUEST GÖNDERİLİYOR...');
  console.log('📡 URL:', url);
  
  try {
      const options = {
          method: method,
          headers: headers
      };
      
      if (method === 'POST' && body) {
          options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('✅ REQUEST BAŞARILI');
      return data;
  } catch (error) {
      console.log('❌ REQUEST BAŞARISIZ:', error.message);
      return null;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  async fetch(request) {
      try {
          console.log('🚀 HEPSİBURADA OTOMATİK KAYIT SCRIPTİ');
          console.log('==========================================');
          
          // ✅ OTOMATİK FORMATLI EMAIL SEÇ
          console.log('📧 OTOMATİK FORMATLI EMAIL SEÇİLİYOR...');
          const EMAIL = getRandomEmail();
          console.log('✅ KULLANILACAK EMAIL:', EMAIL);
          
          // Cookie header'ını oluştur
          const cookieHeader = buildCookieHeader();
          console.log('🍪 COOKIE HEADER HAZIR');
          
          // Header ve fingerprint
          const fingerprint = generateFingerprint();
          console.log('🔑 FINGERPRINT:', fingerprint);
          
          // --- 1. POST: ÜYELİK İSTEĞİ ---
          console.log('📧 1. POST: ÜYELİK İSTEĞİ GÖNDERİLİYOR...');
          
          // ✅ YENİ XSRF TOKEN AL
          let xsrfToken = await getXsrfToken(cookieHeader);
          if (!xsrfToken) {
              return new Response(JSON.stringify({ error: "XSRF token alınamadı" }), { 
                  status: 500,
                  headers: { 'Content-Type': 'application/json' }
              });
          }
          
          // 1. POST Hazırlık
          const postUrl1 = "https://oauth.hepsiburada.com/api/authenticate/createregisterrequest";
          const postBody1 = {
              email: EMAIL,
              returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=c7ca3f6c28c5445aa5c1f4d52ce65d6d&code_challenge=t44-iDRkzoBssUdCS9dHN3YZBks8RTWlxV-BpC4Jbos&code_challenge_method=S256&response_mode=query"
          };
          
          const postHeaders1 = {
              "accept": "application/json, text/plain, */*",
              "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
              "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
              "content-type": "application/json",
              "fingerprint": fingerprint,
              "priority": "u=1, i",
              "sec-ch-ua": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "x-xsrf-token": xsrfToken,
              "origin": "https://giris.hepsiburada.com",
              "referer": "https://giris.hepsiburada.com/",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
              "cookie": cookieHeader
          };
          
          // 1. POST Gönder
          const response1 = await makeRequest(postUrl1, postHeaders1, postBody1);
          
          if (response1 && response1.success === true) {
              console.log('🎉 1. POST BAŞARILI - REFERENCE ID:', response1.data.referenceId);
              
              // OTP için bekle
              console.log('⏳ OTP emailinin gelmesi bekleniyor (15 saniye)...');
              await sleep(15000);
              
              // OTP Kodu al
              const otpCode = await getOtpCode(EMAIL);
              
              if (otpCode) {
                  console.log('🎯 OTP KODU HAZIR:', otpCode);
                  
                  // --- 2. POST: OTP DOĞRULAMA ---
                  console.log('📧 2. POST: OTP DOĞRULAMA GÖNDERİLİYOR...');
                  
                  // ✅ YENİ XSRF TOKEN AL
                  xsrfToken = await getXsrfToken(cookieHeader);
                  
                  const postUrl2 = "https://oauth.hepsiburada.com/api/account/ValidateTwoFactorEmailOtp";
                  const postBody2 = {
                      otpReference: response1.data.referenceId,
                      otpCode: otpCode
                  };
                  
                  const postHeaders2 = {
                      "accept": "application/json, text/plain, */*",
                      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                      "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
                      "content-type": "application/json",
                      "fingerprint": fingerprint,
                      "priority": "u=1, i",
                      "sec-ch-ua": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
                      "sec-ch-ua-mobile": "?0",
                      "sec-ch-ua-platform": '"Windows"',
                      "sec-fetch-dest": "empty",
                      "sec-fetch-mode": "cors",
                      "sec-fetch-site": "same-site",
                      "x-xsrf-token": xsrfToken,
                      "origin": "https://giris.hepsiburada.com",
                      "referer": "https://giris.hepsiburada.com/",
                      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
                      "cookie": cookieHeader
                  };
                  
                  // 2. POST Gönder
                  const response2 = await makeRequest(postUrl2, postHeaders2, postBody2);
                  
                  if (response2 && response2.success === true && response2.requestId) {
                      console.log('🎉 2. POST BAŞARILI - REQUEST ID:', response2.requestId);
                      
                      // Kısa bekleme
                      console.log('⏳ Session stabilizasyonu (3 saniye)...');
                      await sleep(3000);
                      
                      // --- 3. POST: KAYIT TAMAMLAMA ---
                      console.log('📝 3. POST: KAYIT İŞLEMİ TAMAMLANIYOR...');
                      
                      // ✅ YENİ XSRF TOKEN AL
                      xsrfToken = await getXsrfToken(cookieHeader);
                      
                      // Random bilgiler
                      const firstName = getRandomTurkishName();
                      const lastName = getRandomTurkishName();
                      const password = "Hepsiburada1";
                      
                      console.log('🎭 Kullanıcı Bilgileri:');
                      console.log('   👤 Ad:', firstName, lastName);
                      console.log('   🔑 Şifre:', password);
                      console.log('   📨 Email:', EMAIL);
                      
                      // 3. POST Body
                      const postUrl3 = "https://oauth.hepsiburada.com/api/authenticate/register";
                      const postBody3 = {
                          subscribeEmail: false,
                          firstName: firstName,
                          lastName: lastName,
                          password: password,
                          subscribeSms: false,
                          returnUrl: "https://oauth.hepsiburada.com/connect/authorize/callback?client_id=SPA&redirect_uri=https%3A%2F%2Fwww.hepsiburada.com%2Fuyelik%2Fcallback&response_type=code&scope=openid%20profile&state=0fe1789b3dee47458bdf70864a6a9931&code_challenge=1y2GcO5myCuDr8SsID6yMQyi5ZE6I_A9sJhKwYEgnpU&code_challenge_method=S256&response_mode=query",
                          requestId: response2.requestId
                      };
                      
                      const postHeaders3 = {
                          "accept": "application/json, text/plain, */*",
                          "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                          "app-key": "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB",
                          "content-type": "application/json",
                          "fingerprint": fingerprint,
                          "priority": "u=1, i",
                          "sec-ch-ua": '"Chromium";v="138", "Google Chrome";v="138", "Not-A.Brand";v="8"',
                          "sec-ch-ua-mobile": "?0",
                          "sec-ch-ua-platform": '"Windows"',
                          "sec-fetch-dest": "empty",
                          "sec-fetch-mode": "cors",
                          "sec-fetch-site": "same-site",
                          "x-xsrf-token": xsrfToken,
                          "origin": "https://giris.hepsiburada.com",
                          "referer": "https://giris.hepsiburada.com/",
                          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.849.0 Safari/537.36",
                          "cookie": cookieHeader
                      };
                      
                      // 3. POST Gönder
                      const response3 = await makeRequest(postUrl3, postHeaders3, postBody3);
                      
                      if (response3) {
                          if (response3.success === true) {
                              console.log('🎉 KAYIT BAŞARILI!');
                              
                              const result = {
                                  success: true,
                                  message: "Kayıt başarılı",
                                  account: {
                                      email: EMAIL,
                                      password: password,
                                      name: `${firstName} ${lastName}`,
                                      accessToken: response3.data?.accessToken,
                                      refreshToken: response3.data?.refreshToken
                                  },
                                  data: response3.data
                              };
                              
                              if (response3.data.accessToken) {
                                  console.log('🔑 ACCESS TOKEN:', response3.data.accessToken);
                              }
                              if (response3.data.refreshToken) {
                                  console.log('🔄 REFRESH TOKEN:', response3.data.refreshToken);
                              }
                              
                              console.log('✅ HESAP BİLGİLERİ:');
                              console.log('   📧 Email:', EMAIL);
                              console.log('   🔑 Şifre:', password);
                              console.log('   👤 Ad Soyad:', firstName, lastName);
                              
                              return new Response(JSON.stringify(result), {
                                  headers: { 'Content-Type': 'application/json' }
                              });
                              
                          } else {
                              return new Response(JSON.stringify({ 
                                  error: "Kayıt başarısız", 
                                  message: response3.message 
                              }), { 
                                  status: 500,
                                  headers: { 'Content-Type': 'application/json' }
                              });
                          }
                      } else {
                          return new Response(JSON.stringify({ error: "3. POST başarısız!" }), { 
                              status: 500,
                              headers: { 'Content-Type': 'application/json' }
                          });
                      }
                      
                  } else {
                      return new Response(JSON.stringify({ error: "2. POST başarısız veya requestId alınamadı!" }), { 
                          status: 500,
                          headers: { 'Content-Type': 'application/json' }
                      });
                  }
                  
              } else {
                  return new Response(JSON.stringify({ error: "OTP kodu alınamadı!" }), { 
                      status: 500,
                      headers: { 'Content-Type': 'application/json' }
                  });
              }
              
          } else {
              return new Response(JSON.stringify({ error: "1. POST başarısız!" }), { 
                  status: 500,
                  headers: { 'Content-Type': 'application/json' }
              });
          }
          
      } catch (error) {
          return new Response(JSON.stringify({ 
              error: "Script hatası", 
              details: error.message 
          }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
          });
      }
  }
};
