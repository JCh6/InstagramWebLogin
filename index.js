const { URL, OPTIONS, HEADERS, GET_COOKIES, ENCRYPTION_KEYS, USER_DATA } = require('./config');
const https = require('https');
const querystring = require('querystring');
const { handler } = require('./handler');

var options = {
    host: URL.LOGIN.HOST,
    authority: URL.LOGIN.HOST,
    path: URL.LOGIN.PATH,
    method: OPTIONS.GET,
    scheme: OPTIONS.SCHEME,
    
    headers: {
        'accept': HEADERS.ACCEPT,
        'accept-encoding': HEADERS.ACCEPT_ENCODING,
        'cache-control': HEADERS.NO_CACHE,
        'pragma': HEADERS.NO_CACHE,
        'user-agent': HEADERS.USER_AGENT
    }
};

https.request(options, function(response) {

   try {
        const web_key_id = response.headers[ENCRYPTION_KEYS.KEY_ID]
        const web_key_version = response.headers[ENCRYPTION_KEYS.KEY_VERSION]
        const web_pub_key = response.headers[ENCRYPTION_KEYS.PUB_KEY]
        const stringCookies = response.headers[GET_COOKIES].join(';');
        const cookies = ['csrftoken', 'ig_did', 'mid'];

        cookies.forEach((cookie, index) => {
            let regExp = RegExp(`${cookie}=[A-Z-a-z0-9-_]+`);
            cookies[index] = regExp.exec(stringCookies) ? regExp.exec(stringCookies)[0] : null
        });

        if (cookies.length != 3 || cookies.includes(null) || cookies.includes(undefined)) 
            throw new Error('csrftoken and/or ig_did and/or mid not defined in response!');

        new Promise(resolve => {
            resolve(handler(web_key_version, web_key_id, web_pub_key, USER_DATA.PASSWORD));
        })
        .then(data => {

            const body = querystring.stringify({
                username: USER_DATA.USERNAME,
                enc_password: data.body.replace(/"/g, ''),
                queryParams: '{}',
                optIntoOneTap: false
            });

            options = {
                host: URL.LOGIN.HOST,
                authority: URL.LOGIN.HOST,
                path: URL.AJAX.PATH,
                method: OPTIONS.POST,
                scheme: OPTIONS.SCHEME,
                
                headers: {
                    'accept': HEADERS.ACCEPT,
                    'accept-encoding': HEADERS.ACCEPT_ENCODING,
                    'cache-control': HEADERS.NO_CACHE,
                    'pragma': HEADERS.NO_CACHE,
                    'cookie': cookies.join('; '),
                    'x-csrftoken': cookies[0].split('=')[1],
                    'user-agent': HEADERS.USER_AGENT,
                    'content-type': HEADERS.CONTENT_TYPE,
                    'content-length': Buffer.byteLength(body)
                }
            };

            const req = https.request(options, function(res) {
                res.on('data', function (chunk) {
                    console.log('Auth Response:');
                    console.log(` ${chunk}`);
                    console.log('Response Cookies:');
                    res.headers[GET_COOKIES].forEach(cookie => {
                        console.log(` * ${cookie}`)
                    });
                });
            });

            req.write(body);
            req.end();

        });
   } catch (error) { console.error(error) }

}).end();
