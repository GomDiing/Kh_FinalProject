import {TCATS_DOMAIN} from "./Config";

const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/',
        createProxyMiddleware({
            target: "https://open-api.kakaopay.com",
            changeOrigin: true,
        })
    );
};