const { nativeCerts } = require("./lib.js");

/**
 * Load native TLS certificates from the operating system trust store.
 * 
 * @returns the TLS certificates from the trust store, encoded in PEM format
 */
function loadNativeCerts() {
    return nativeCerts().map(certFormat)
}

/**
 * Converts a DER-encoded byte buffer (the binary representation of a TLS certificate) to a PEM-encoded string
 * 
 * @param {*} buf the DER-encoded certificate
 * @returns the PEM-encoded certificate
 */
function certFormat(buf) {
    const base64cert = buf.toString("base64");
    const lines = base64cert.match(/.{1,64}/g);

    var output =  "-----BEGIN CERTIFICATE-----\n";
    if (lines) {
        output += lines.join("\n")
        output += "\n"
    }
    output += "-----END CERTIFICATE-----"

    return output
}

module.exports.loadNativeCerts = loadNativeCerts;
module.exports.certFormat = certFormat;