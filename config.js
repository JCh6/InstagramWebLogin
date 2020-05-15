const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    URL: {
        LOGIN: {
            HOST: process.env.INSTAGRAM,
            PATH: process.env.LOGIN_PATH
        },
        AJAX: {
            PATH: process.env.LOGIN_AJAX
        }
    },

    OPTIONS: {
        GET: process.env.METHOD_GET,
        POST: process.env.METHOD_POST,
        SCHEME: process.env.SCHEME
    },

    HEADERS: {
        ACCEPT: process.env.ACCEPT,
        ACCEPT_ENCODING: process.env.ACCEPT_ENCODING,
        NO_CACHE: process.env.NO_CACHE,
        CONTENT_TYPE: process.env.CONTENT_TYPE,
        USER_AGENT: process.env.USER_AGENT
    },

    GET_COOKIES: process.env.SET_COOKIE,

    ENCRYPTION_KEYS: {
        KEY_ID: process.env.KEY_ID,
        KEY_VERSION: process.env.KEY_VERSION,
        PUB_KEY: process.env.PUB_KEY,
    },

    KEY_BROWSER: process.env.KEY_BROWSER,

    USER_DATA: {
        USERNAME: process.env.USER_NAME,
        PASSWORD: process.env.PASSWORD
    }
};