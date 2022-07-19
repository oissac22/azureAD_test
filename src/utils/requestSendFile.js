//@ts-check

const path = require('path');
const fs = require('fs');

/**
 * send one file with respose from request
 * @param {string} fileName 
 * @param {import('express').Response} res 
 * @param {((value:string) => string) | ((value:string) => Promise<string>)} callback 
 */
async function requestSendFile(fileName, res, callback) {
    let fileText = fs.readFileSync(fileName, { encoding: 'utf-8' });
    if (callback) fileText = await callback(fileText);
    res.send(fileText);
}


module.exports = requestSendFile;