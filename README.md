# node-native-certs

Load TLS root certificates from the system trust store.

- Windows: loads certificates from the system certificate store.
- macOS: loads certificates from the keychain.
- Linux, BSD: looks for the OpenSSL CA bundle in the usual places.
  Honors the `SSL_CERT_FILE` and `SSL_CERT_DIR` environment variables.

## Setup

```shell
npm install native-certs
```

## Usage

```js
const https = require("https")
const { loadNativeCerts } = require("native-certs")

const ca = loadNativeCerts()

const req = https.get({ca, host: "google.com", path: "/"})
// do something with `req`
```

The `SSL_CERT_FILE` environment variable overrides the default trust store
on all platforms.

Node.js does not support globally overriding the built-in root certificates
but the list can be extended through the `NODE_EXTRA_CA_CERTS` environment
variable:

```shell
node -e 'fs.writeFileSync("cas.pem", require("native-certs")().join("\n"))'

NODE_EXTRA_CA_CERTS=cas.pem node app.js
```

Performance consideration: loading certificates can be slow. Cache 'em.

## License

ISC, see the LICENSE file.

## Development

```shell
npm install
npm run build
npm test
```

If you need to run `napi-rs` scaffolder commands you may also need to `npm install -g @napi-rs/cli`.
