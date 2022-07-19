//@ts-check

/** @typedef { import('./type').TazureADconfigAuth } TazureADconfigAuth */
/** @typedef {import('express').Response} Response */

const msal = require('@azure/msal-node');


function queryRequestToJSON(query) {
    let data = {}
}

class CADServices {

    REDIRECT_URI = '';
    /** @type {msal.ConfidentialClientApplication} */
    pca;

    /**
     * classe de administração de login do azure AD
     * @param {string} REDIRECT_URI
     * @param {TazureADconfigAuth} authConfig
     */
    constructor(REDIRECT_URI, authConfig) {
        this.REDIRECT_URI = REDIRECT_URI;

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
     * @returns {Promise<string>} url de redirecionamento
     */
    login() {
        return new Promise((res, rej) => {
            const authCodeUrlParameters = {
                scopes: ["user.read"],
                redirectUri: this.REDIRECT_URI,
            };

            // get url to sign user in and consent to scopes needed for application
            this.pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
                res(response);
            }).catch((error) => {
                rej(error);
            });
        })
    }

    /**
     * retorna os dados do usuário logado se baseando no código gerado pelo login
     * @param {string} code 
     * @returns {any}
     */
    loginData(code) {
        return new Promise((res, rej) => {
            const tokenRequest = {
                code: code,
                scopes: ["user.read.all"],
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

    logoff(res) {

    }

}

module.exports = CADServices;