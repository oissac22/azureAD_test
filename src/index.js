//@ts-check

require('dotenv').config();
const express = require('express');
const path = require('path');
const ADConnect = require('./azureAdConfig');
const { pca } = require('./azureAdConfig');

const { requestSendFile } = require('./utils')



const PORT = 3000;

const api = express()

api.get('/test', (req, res) => {
    res.send('test ok')
})

api.get('/', (req, res) => {
    res.send(`
        <a href="/login">fazer login</a>
    `)
})

api.get('/login', (req, res) => {
    ADConnect.login().then(result => res.redirect(result));
})

api.get('/redirect', async (req, res) => {
    const TAG_CODE = /\[dataSession\]/g;
    const TAG_DATA = /\[dataDetails\]/g;
    await requestSendFile(path.join(__dirname, 'pages/redirect.html'), res, async (html) => {
        const code = (req.query.code || '') + '';
        console.log('code :>> ', code);
        let codeData;
        try {
            codeData = await ADConnect.loginData(code);
        } catch (e) {
            codeData = `${e}`;
        }
        html = html
            .replace(TAG_CODE, JSON.stringify(req.query))
            .replace(TAG_DATA, JSON.stringify(codeData))
        return html;
    })
})

api.get('/data', (req, res) => {
    const code = `0.AQoA8pYgBsB22E64v2ZEF4SWsr5mwkrmaaZOl-jPE7sJbHMKAJ4.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P_64A2OI-vFudLSNRfenClYeGqnPVJmRjHw1laG82BOg2bzqNNgzN6UqLv0AFQXxICVarENxBjBWjupoiFImFGhdwFfhtNhGtu8RSNcIzUT3ea8S4rpLwdvcF_SIV3eIsDp9BmbkOB798v8XGYeXhsckY7giRqyaYG6bqTY001ugXMIBD4tNaf2haH86JjaX-VRQg-akd-5uAHJ4MhVh47jkRMuhac71o19F85bXEKNbd_4nVjv4fE8YTOPR9G53Epv9zug1Yg9XEfoVR8Fu9x-WSNVVCTJCa6iUldKhYs-3ocwNw8U9Em11EZolqExc4NtWpFzg3ltOIREWkkyNUcTGllx58j4poAzrt5Fw8hoFmSGuH4FMV6iFxGq5rNfMNMLLiSOLXHD8aW6gsg1uYgabLfiTNEHJp2mpAmcIdBlHdWyJoXahEQeA9fgoeJR1-2UEk6oonvods4G1oo48igE-nVXvzCJkSMtejnJWIbjx1uHA4U5N5rUlbjYzlreLmytxPkS55Lvl0--FxCddlWFyAgcZk8FIGwtM7Vt7lLskc-hkH7g8SQQX5cfqAwFtZVD1h8VOZ7JPsbuT7C1bqlRxJZTgkD8kZMX4vTGbEVSR7En-cfl04VIlBMY1fju9dtvIoPcor06fOUmmiLsZi8m9Ag3XKk0UCv1qxZDa3ZLLK1zLM7g6kFk4DnXXHQP_Cok2VtUaNXJjsKHt2CTlJ9wYNjOW1u4vR-4991zt-PBcdpjvRd5YwHsObxJXGPVvIgZ3-gK42ZOF_G2clWvDGTPJ-KrmJOdAN-1RBWxYsLrNsRC6S4j0gYtPmnGb2NR7oI6IFdCeKEyX1CwSF_vJsu0VHpJaLUH5-MmeAZZ3sMy-E_pP64feFrKZ8NZTkTSLXWTUoTiDJ93OE8`;
    ADConnect.loginData(code)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(`${err}`)
        });
})

api.get('/logout', (req, res) => {
    res.send('desloged')
})


api.listen(PORT, () => console.log(`run in port ${PORT}`))