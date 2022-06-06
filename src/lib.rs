use regex::Regex;
use napi_derive::napi;
use rustls_native_certs::Certificate;

#[napi]
fn nativeCerts() -> Vec<String> {
    match rustls_native_certs::load_native_certs() {
        Ok(certs) => certs_to_strings(certs),
        _ => [].to_vec()
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

fn cert_format(buf: Vec<u8>) -> String {
    let mut cert = "-----BEGIN CERTIFICATE-----\n".to_string();

    let re = Regex::new(r".{1,72}").unwrap();
    let c = base64::encode(buf);
    for result in re.find_iter(&c) {
        cert += result.as_str();
        cert += "\n";
    }

    cert += "-----END CERTIFICATE-----";
    
    return cert;
}