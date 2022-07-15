import { Response } from "express";

export type TCodesStatesADServices = {
    code: string,
    client_info: string,
    session_state: string,
}

export type TazureADconfigAuth = {
    /** ID do cliente */
    clientId: string,
    /** URL de autoridade, exempo: "https://login.microsoftonline.com/common" ou "https://login.microsoftonline.com/<key>/" */
    authority: string,
    /** chave secreta do cliente */
    clientSecret: string,
    cloudDiscoveryMetadata?: string,
    /** url de redirecionamento, exemplo: "http://localhost:3000/redirect" */
    redirectUri: string,
    /** url de redirecionamento de logout, exemplo: "http://localhost:3000/logout/" */
    postLogoutRedirectUri: string,
    /** exemplo: true */
    navigateToLoginRequestUrl?: true,
    /** exemplo: ["CP1"] */
    clientCapabilities?: ("CP1" | string)[],
    /** Exemplo: ['http://localhost:3000/'] */
    knownAuthorities: string[],
}