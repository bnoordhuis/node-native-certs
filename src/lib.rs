use regex::Regex;
use napi_derive::napi;
use napi::bindgen_prelude::*;
use rustls_native_certs::Certificate;

#[napi]
fn native_certs() -> Result<Vec<String>> {
    return match rustls_native_certs::load_native_certs() {
        Ok(certs) => Ok(certs_to_strings(certs)),
        Err(e) => Err(Error::from(e))
    }
}

fn certs_to_strings(certs: Vec<Certificate>) -> Vec<String> {
    certs.into_iter()
        .map(|e| {
            let buf = e.0.into();
            return cert_format(buf);
        })
        .collect()
}

// Exposed for testing
#[napi]
fn cert_format(buf: Buffer) -> String {
    internal_cert_format(buf.to_vec())
}


fn internal_cert_format(buf: Vec<u8>) -> String {
    let mut cert = "-----BEGIN CERTIFICATE-----\n".to_string();

    let re = Regex::new(r".{1,64}").unwrap();
    let c = base64::encode(buf);
    for result in re.find_iter(&c) {
        cert += result.as_str();
        cert += "\n";
    }

    cert += "-----END CERTIFICATE-----\n";
    
    return cert;
}