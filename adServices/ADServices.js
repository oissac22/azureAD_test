/*
    Por Cássio da Silva Carneiro
    oissac22@hotmail.com
    dbc.cassio@unimedpoa.com.br
*/

//@ts-check

/** @typedef { import('./type').TazureADconfigAuth } TazureADconfigAuth */
/** @typedef {import('express').Response} Response */

const msal = require('@azure/msal-node');
const { CSessionData } = require('./sessionData');

const LOGOUT_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri={{URL_REDIRECT}}`

/**
 * pega uma url e retorna os dados da query desta url
 * @param {string} query 
 * @returns {{[key:string]:any}} retorna um objeto
 */
function urlRequestToQueryData(query) {
    let data = {};
    if (!/\?/.test(query)) return data;
    query
        .replace(/^.+?\?/, '')
        .replace(/([^&#]+)=([^&#]+)/g, (text, key, value) => {
            data[key] = decodeURI(value);
            return '';
        });
    return data;
}

class CADServices {

    REDIRECT_URI = '';
    /** @type {msal.ConfidentialClientApplication} */
    pca;
    /** @type {CSessionData} */
    session;

    /**
     * classe de administração de login do azure AD
     * @param {string} REDIRECT_URI
     * @param {msal.NodeAuthOptions & {validateAuthority?:boolean}} authConfig
     * @param {CSessionData} sessionData
     */
    constructor(REDIRECT_URI, authConfig, sessionData) {
        this.REDIRECT_URI = REDIRECT_URI;
        this.session = sessionData;

        /** @type {msal.Configuration} */
        const config = {
            auth: authConfig,
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message, containsPii) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: msal.LogLevel.Verbose,
                }
            }
        };

        this.pca = new msal.ConfidentialClientApplication(config);
    }

    /**
     * efetuar o login e retornar a url de redirecionamento
     * @returns {Promise<string>} chave de acesso
     */
    login() {
        return new Promise((res, rej) => {
            const authCodeUrlParameters = {
                scopes: ["User.Read"],
                redirectUri: this.REDIRECT_URI,
            };
            // get url to sign user in and consent to scopes needed for application
            this.pca.getAuthCodeUrl(authCodeUrlParameters).then(async (response) => {
                res(response)
            }).catch((error) => {
                rej(error);
            });
        })
    }

    /**
     * 
     * @param {string} code código retornado pelo login da microsoft
     * @param {number} minutesExpires um número representando em quantos minutos expira o login
     * @returns {Promise<string>} retorna a chave para requisição de dados
     */
    async keyByCode(code, minutesExpires) {
        const userData = await this.loginWinData(code);
        const key = this.session.getNewKey(userData, minutesExpires)
        return key;
    }

    /**
     * Retorna os dados de um login se baseando na chave de acesso
     * @param {string} key 
     * @returns 
     */
    getKeyData(key) {
        return this.session.getKeyData(key);
    }

    /**
     * retorna os dados do usuário logado se baseando no código gerado pelo login
     * @param {string} code 
     * @returns {any}
     */
    loginWinData(code) {
        return new Promise((res, rej) => {
            const tokenRequest = {
                code: code,
                scopes: [],
                redirectUri: this.REDIRECT_URI,
            };

            this.pca.acquireTokenByCode(tokenRequest).then((response) => {
                res(response)
            }).catch((error) => {
                console.log(error);
                rej(error);
            });
        })
    }

    /**
     * retorna a url de logout da microsoft, com o redirecionamento já definido
     * @param {string} key chave de login
     * @param {string} urlRedirect url para ser retornada após o logoff
     * @returns url de logoff
     */
    logoff(key, urlRedirect) {
        this.session.deleteKey(key)
        return LOGOUT_URL.replace(/\{\{URL_REDIRECT\}\}/, encodeURI(urlRedirect))
    }

}

module.exports = {
    CADServices
}