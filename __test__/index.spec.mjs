import test from 'ava'
import { get } from 'https'
import { Buffer } from 'node:buffer';
import { readFile } from 'fs/promises'

import { nativeCerts, certFormat } from '../index.js'

// Promise-ify https.get
async function pget(params) {
    return new Promise((resolve, reject) => {
        const request = get(params, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    })
}

test('HTTPS request uses native certs', async (t) => {
    const ca = nativeCerts()
    t.not(ca.length, 0)
    
    let responseBody = await pget({ca, host: "example.com", path: "/"})

    t.not(responseBody.length, 0)
})

test('cert_format formats a certificate', async (t) => {
    const certFile = new URL('certificate.crt', import.meta.url)
    const input = await readFile(certFile, 'utf-8')
    const inputWithoutAsciiArmor = input
        .replace("-----BEGIN CERTIFICATE-----\n", "")
        .replace("-----END CERTIFICATE-----\n", "")
    const certBuffer = Buffer.from(inputWithoutAsciiArmor, 'base64')

    const output = certFormat(certBuffer)

    t.is(output, input)
})

test('cert_format formats an empty certificate', (t) => {
    const input = Buffer.from([], 'base64')

    const actual = certFormat(input)

    var expected = ""
    expected += "-----BEGIN CERTIFICATE-----\n"
    expected += "-----END CERTIFICATE-----\n"

    t.is(actual, expected)
})