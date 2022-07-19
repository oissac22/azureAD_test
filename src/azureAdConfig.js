//@ts-check

// const msal = require('@azure/msal-node');

const CADServices = require("./adServices");

// const config = {
//     auth: {
//         clientId: "4ac266be-69e6-4ea6-97e8-cf13bb096c73",
//         // authority: "https://login.microsoftonline.com/common",
//         authority: "https://login.microsoftonline.com/062096f2-76c0-4ed8-b8bf-6644178496b2/",
//         // authority: "https://login.microsoftonline.com/062096f2-76c0-4ed8-b8bf-6644178496b2/oauth2/v2.0/token",
//         clientSecret: "6ff51577-2eb8-434c-977e-39ba450a6de4",
//         knownAuthorities: [],
//         cloudDiscoveryMetadata: "",
//         redirectUri: "http://localhost:3000/redirect",
//         postLogoutRedirectUri: "http://localhost:3000/logout/",
//         navigateToLoginRequestUrl: true,
//         clientCapabilities: ["CP1"],
//         knownAuthorities: ['http://localhost:3000/'],
//     },
//     system: {
//         loggerOptions: {
//             loggerCallback(loglevel, message, containsPii) {
//                 console.log(message);
//             },
//             piiLoggingEnabled: false,
//             logLevel: msal.LogLevel.Verbose,
//         }
//     }
// };

// const pca = new msal.ConfidentialClientApplication(config);

// module.exports = {
//     pca
// }

const PORT = 3000;
const REDIRECT_URI = "http://localhost:" + PORT + "/redirect";

const ADConnect = new CADServices(REDIRECT_URI, {
    clientId: "4ac266be-69e6-4ea6-97e8-cf13bb096c73",
    // authority: "https://login.microsoftonline.com/common",
    authority: "https://login.microsoftonline.com/062096f2-76c0-4ed8-b8bf-6644178496b2/",
    // authority: "https://login.microsoftonline.com/062096f2-76c0-4ed8-b8bf-6644178496b2/oauth2/v2.0/token",
    clientSecret: "6ff51577-2eb8-434c-977e-39ba450a6de4",
    cloudDiscoveryMetadata: "",
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: "http://localhost:3000/logout/",
    navigateToLoginRequestUrl: true,
    clientCapabilities: ["CP1"],
    knownAuthorities: ['https://login.microsoftonline.com/062096f2-76c0-4ed8-b8bf-6644178496b2/'],
})

module.exports = ADConnect