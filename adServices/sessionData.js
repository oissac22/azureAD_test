/*
    Por Cássio da Silva Carneiro
    oissac22@hotmail.com
    dbc.cassio@unimedpoa.com.br
*/

//@ts-check

const VERIFY_TIME_EXPIRE = 1000 * 60 * 5;

function randomKey() {
    const f = () => Math.trunc(Math.random() * 100000000);
    return (new Date()).toISOString().replace(/[^\d]+/g, '') + f() + f();
}

/**
 * 
 * @param {number} minutesExpires quantos minutos para expirar
 * @returns 
 */
function newDateExpire(minutesExpires) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesExpires)
    return date;
}

function now() {
    return new Date();
}

class CSessionData {

    /** @private @type {import("./type").TMemoryLogin} */
    memory = {};
    timeVerify;

    constructor() {
        setInterval(() => {
            try {
                const memoriesArr = Object.entries(this.memory);
                const nowDate = now();
                memoriesArr.map(([key, value]) => {
                    if (nowDate > value.dateExpire)
                        this.deleteKey(key);
                });
            } catch (e) {
                clearInterval(this.timeVerify);
            }
        }, VERIFY_TIME_EXPIRE)
    }

    /**
     * gera uma nova chave com os dados específicos e retorna esta chave
     * @param {any} data 
     * @param {number} minutesExpires 
     * @returns {string} a chave referente aos dados do usuário
     */
    getNewKey(data, minutesExpires) {
        const key = randomKey();
        this.memory[key] = {
            data,
            dateExpire: newDateExpire(minutesExpires),
            key
        }
        return key;
    }

    /**
     * pega os dados do usuário logado pela chave
     * @param {string} key 
     * @returns os dados do usuário
     */
    getKeyData(key) {
        const data = this.memory[key];
        if (!data) return null;
        if (now() > data.dateExpire) {
            this.deleteKey(key);
            return null;
        }
        return data;
    }

    /**
     * deleta a chave finalizando assim o accesso
     * @param {string} key 
     */
    deleteKey(key) {
        if (this.memory[key])
            delete this.memory[key];
    }

}

module.exports = {
    CSessionData
}