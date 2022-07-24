//@ts-check

const CADServices = require("./adServices");

const PORT = 3000;
const REDIRECT_URI = "http://localhost:" + PORT + "/redirect";

const ADConnect = new CADServices(REDIRECT_URI, {
    clientId: "67b4d16f-420c-4688-bd70-9311b6c143c4",
    // authority: "https://login.microsoftonline.com/organizations",
    authority: "https://login.microsoftonline.com/9eb04dee-e30c-49b8-8d66-1fb1929449d5",
    clientSecret: "icv8Q~5iiXL4PicCinSPdZb1jelXMpC3HeJh0bRk",
    // cloudDiscoveryMetadata: "",
    // // redirectUri: REDIRECT_URI,
    // // postLogoutRedirectUri: "http://localhost:3000/logout/",
    // // navigateToLoginRequestUrl: true,
    // clientCapabilities: ["CP1"],
    // knownAuthorities: ['https://login.microsoftonline.com/9eb04dee-e30c-49b8-8d66-1fb1929449d5/'],
    // validateAuthority: false
})

module.exports = ADConnect