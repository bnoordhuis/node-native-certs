import { notEqual, ok, strictEqual } from 'assert';
import { get } from 'https';
import { Buffer } from 'node:buffer';
import { loadNativeCerts, certFormat } from '../index.js';

// Promise-ify https.get
async function pget(params) {
    return new Promise((resolve, reject) => {
        const request = get(params, (response) => {
            if (response.statusCode < 200 || response.statusCode > 399) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    })
}

// HTTPS request should use native certs
{
    const ca = loadNativeCerts()
    notEqual(ca.length, 0)
    
    await pget({ca, host: "www.npmjs.com", path: "/"})

    ok('request was ok')
}

// cert_format should format a certificate
{
    const input = `-----BEGIN CERTIFICATE-----
MIIE5jCCAs4CCQD5/huzlZjclTANBgkqhkiG9w0BAQsFADA1MQswCQYDVQQGEwJV
UzEQMA4GA1UECgwHRXhhbXBsZTEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjIw
NjA3MTAwNjQ3WhcNMjMwNjA3MTAwNjQ3WjA1MQswCQYDVQQGEwJVUzEQMA4GA1UE
CgwHRXhhbXBsZTEUMBIGA1UEAwwLZXhhbXBsZS5jb20wggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQDSDfhg07OTS82Gb+V0jI6hVVQzH1Ncysb4qp3LZSYh
kHCzZuYbPSFX7UZbYlgn2I2imW1zVsK53wKYgL2Lj/1UMG2pmdkD7DF52aRLlBBV
P918Xe7M6Tj3c2vy79xiOI50e5KE+IIn5nYIncrndKLeOQBMdv3zb6zO012czQih
hg7sFEDkRNPnEXzVlsXjptx0l0v4ThHKWHXN4QEWn+jjiivNYgyNDPoSEMxpcKFY
xnocJQePvftZhauX+sJTtcV/GtHCd+d4p5EIbRqMXDYUfwAQmWm4MG37XQnHOFF6
51JrnvD/V3IbFcX7VX9Jo6rBuBLTNx9XbN1jYsMHFU06Ns0HGJB36x0nHtK8KB/V
gqPBT7F/FJrej2DZDDQMHQh5no3zARFQkhV2id45Ha95OesaIkOBvhQ56dpwATdD
0ExcK/uLz5mVPcESLIdxrlj0V0YWXqjdXV8rwdW3F14EreGNcAD2lzUm1u/3A2Oo
5Xi3hM6sjuEsGO/JrtQdk6F2+PGMzKw4mZFpSf89G4uGYzmb0eAjdkwqBIt+Bi5O
wo/lH7476eHQQzwmgqjxpgMqhBj+Uy+weX/g8ecH+ViKsIvTts0C7tL51zg9/w9T
8JaygKSWnM/Y9YkVDRTwwYGQ55f++40bRxa8npLTw6YpgC4hFJ2FdQSEEhyl4roi
KwIDAQABMA0GCSqGSIb3DQEBCwUAA4ICAQDBfFdVKDIGftiK0QPDgUTx03uViu+9
7lr9OGWxGATgKebKEUvhWZyLdt2F/wxMAwBLHV/KDQNBmkMgUHPbqmQ0B3x49JZv
paJ6YWG6W9PiiZYmUE6olNLBIA1qXD5dHtpzrJnAW/xAL0tLCzW+zXjmLtUYhJ+y
sB/CgpwDp0EbRk0zTa6Yd4emb0Ly41SPL4dQoYugbZqAjU5LRlHxjHsh9etMImrX
LCAhlbcK0PGe7S+UDmMvkL5hM5AjnssQg+06Hmii6Xbns6gfk2wtxim4Q8mVymst
XLqgrOvQ46HTPydi2uYahzwnkTp9KR20SEnP++S1793oGSI+FR43rL5a/lioNcl8
aY172JsHtNknRSkOQEGPvqqfutXOki27ArVfJdjzWyQvFTKghxb+5kK+NJ77D7px
YzVM8olT/mKMqvyO26+kjfpjSUs+KiwGaw14TAPizUes3dx47VBicT+XDr/mMYAy
gJBH3AFtO0wBlU8d+P3iDslu3FHUnLCQK+5An7N8iZDOjhGLI50XZ+2Wi4My6N5D
Mi5qSX4AxL8NnIUg20rkAF582W6/jD1xDAefWZKtHWRuYx0iKiisaWZ9ZCFqt/OK
RgJ6aGUHlpoSEYnBkMNJ/fL5WTu8HJ+l4RmDgpkiR+JfX05/tm5DkJjWVafsjs9e
0VP1X/7wvBPhEg==
-----END CERTIFICATE-----`

    const inputWithoutAsciiArmor = input
        .replace("-----BEGIN CERTIFICATE-----\n", "")
        .replace("-----END CERTIFICATE-----\n", "")
    const certBuffer = Buffer.from(inputWithoutAsciiArmor, 'base64')
    const output = certFormat(certBuffer)

    strictEqual(input.trim(), output.trim())
}

// cert_format should format an empty certificate
{
    const input = Buffer.from([], 'base64')

    const actual = certFormat(input)

    var expected = ""
    expected += "-----BEGIN CERTIFICATE-----\n"
    expected += "-----END CERTIFICATE-----\n"

    strictEqual(actual.trim(), expected.trim())
}