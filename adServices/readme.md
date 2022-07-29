/*
    Por Cássio da Silva Carneiro
    oissac22@hotmail.com
    dbc.cassio@unimedpoa.com.br
*/

use a classe ADServices que pode ser exportada do index.js

siga umm padrão semelhante a esses:

execute este comando:

    npm install -S @azure/msal-node

use a classe CADServices e crie o objeto ADConnect, algo parecido com isso:

```
    const PORT = 3000;
    const REDIRECT_URI = "http://localhost:" + PORT + "/redirect";

    const ADConnect = new CADServices(REDIRECT_URI, {
        clientId: "<ID_DA_APLICACAO_CLIENTE>",
        authority: "https://login.microsoftonline.com/<ID_PROVEDOR>",
        clientSecret: "<VALUE_CHAVE_SECRETA>",
    }, new CSessionData())
```

crie um endpoint de login, algo parecido com isso:

```
    api.get('/login', (req, res) => {
        ADConnect.login().then(result => {
            res.redirect(result);
        });
    })
```

o result deve vim com o endereço do redirect.

crie o endpoint de redirect para pegar a chave de login, algo como isso:

```
    api.get('/redirect', async (req, res) => {
        const code = req.query.code + '';
        const key = await ADConnect.keyByCode(code, MINUTES_EXPIRE);
        res.redirect('/dashboard?key=' + key);
    })
```

MINUTES_EXPIRE é uma constante que diz em quantos minutos o login vai expirar.

agora crie o endpoint para captura de dados do usuário, algo parecido com isso:

```
    api.get('/data', async (req, res) => {
        const key = req.query.key + '';
        const codeData = await ADConnect.getKeyData(key);
        res.json(codeData);
    })
```

e por último crie o endpoint de logout, algo assim:

```
    api.get('/logoff', (req, res) => {
        const key = req.query.key + '';
        res.redirect(ADConnect.logoff(key, 'http://localhost:3000/'))
    })
```