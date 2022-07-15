//@ts-check

const express = require('express');
const CADServices = require('./adServices');
const ADConnect = require('./azureAdConfig');
const { pca } = require('./azureAdConfig');



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
    // const authCodeUrlParameters = {
    //     scopes: ["user.read"],
    //     redirectUri: REDIRECT_URI,
    // };

    // // get url to sign user in and consent to scopes needed for application
    // pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
    //     res.redirect(response);
    // }).catch((error) => {
    //     console.log(JSON.stringify(error));
    //     res.status(500).send('Erro interno no servidor')
    // });
})

api.get('/redirect', (req, res) => {
    res.send('redirected: <textarea>' + JSON.stringify(req.query, null, 4) + '</textarea>')
})

api.get('/logout', (req, res) => {
    res.send('desloged')
})


api.listen(PORT, () => console.log(`run in port ${PORT}`))