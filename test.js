"use strict"

const assert = require("assert")
const https = require("https")
const nativeCerts = require("./")

const ca = nativeCerts()
assert(ca.length > 0)

https.get({ca, host: "google.com", path: "/"}) // should not fail
