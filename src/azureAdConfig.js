//@ts-check

const { CADServices, CSessionData } = require("../adServices");

const PORT = 3000;
const REDIRECT_URI = "http://localhost:" + PORT + "/redirect";

const ADConnect = new CADServices(REDIRECT_URI, {
    clientId: process.env.CLIENT_ID || '',
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET_VALUE
}, new CSessionData())

module.exports = ADConnect