"use strict"

const {loadNativeCerts} = require("./binding.node")
module.exports = () => loadNativeCerts().map(format)

function format(buf) {
    return (
        "-----BEGIN CERTIFICATE-----\n" +
        buf.toString("base64").match(/.{1,72}/g).join("\n") +
        "\n-----END CERTIFICATE-----"
    )
}
