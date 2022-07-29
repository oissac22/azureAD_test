//@ts-check

require('dotenv').config();
const express = require('express');
const path = require('path');
const ADConnect = require('./azureAdConfig');
const { pca } = require('./azureAdConfig');
const cors = require('cors');

const { requestSendFile } = require('./utils')

const MINUTES_EXPIRE = 30;

const PORT = 3000;

const api = express()

api.use(cors((req, callback) => {
    callback(null, {
        origin: true,
        credentials: true
    })
}))

api.get('/test', (req, res) => {
    res.send('test ok')
})

api.get('/', (req, res) => {
    res.send(`
        <a href="/login">fazer login</a>
    `)
})

api.get('/login', (req, res) => {
    ADConnect.login().then(result => {
        res.redirect(result);
    });
})

api.get('/redirect', async (req, res) => {
    const code = req.query.code + '';
    const key = await ADConnect.keyByCode(code, MINUTES_EXPIRE);
    res.redirect('/dashboard?key=' + key);
})

api.get('/dashboard', async (req, res) => {
    const key = req.query.key + '';
    const TAG_CODE = /\[dataSession\]/g;
    const TAG_DATA = /\[dataDetails\]/g;
    await requestSendFile(path.join(__dirname, 'pages/redirect.html'), res, async (html) => {
        const code = (req.query.code || '') + '';
        let codeData;
        try {
            codeData = await ADConnect.getKeyData(key);
        } catch (e) {
            codeData = `${e}`;
        }
        html = html
            .replace(TAG_CODE, JSON.stringify(req.query))
            .replace(TAG_DATA, JSON.stringify(codeData))
        return html;
    })
})

api.get('/logoff', (req, res) => {
    const key = req.query.key + '';
    res.redirect(ADConnect.logoff(key, 'http://localhost:3000/'))
})

api.get('/data', (req, res) => {
    const key = req.query.key + '';
    const result = ADConnect.getKeyData(key);
    res.json(result);
})

api.get('/logout', async (req, res) => {
    await requestSendFile('pages/logoff.html', res, async html => html);
})


api.listen(PORT, () => console.log(`run in port ${PORT}`))