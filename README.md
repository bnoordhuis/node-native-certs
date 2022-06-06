# node-native-certs

Load TLS root certificates from the system trust store.

- Windows: loads certificates from the system certificate store.
- macOS: loads certificates from the keychain.
- Linux, BSD: looks for the OpenSSL CA bundle in the usual places.
  Honors the `SSL_CERT_FILE` and `SSL_CERT_DIR` environment variables.

The `SSL_CERT_FILE` environment variable overrides the default trust store
on all platforms.

```js
import { nativeCerts } from 'native-certs'
import { get } from 'https'

const ca = nativeCerts()

const req = get({ca, host: "google.com", path: "/"})
// do something with `req`
```

Node.js does not support globally overriding the built-in root certificates
but the list can be extended through the `NODE_EXTRA_CA_CERTS` environment
variable:

```
$ node -e 'fs.writeFileSync("cas.pem", require("native-certs")().join("\n"))'

$ NODE_EXTRA_CA_CERTS=cas.pem node app.js
```

Performance consideration: loading certificates can be slow. Cache 'em.

## Development

```shell
npm install
npm run build
npm test
```

If you need to run `napi-rs` scaffolder commands you may also need to `npm install -g @napi-rs/cli`.