use napi_derive::napi;
use napi::bindgen_prelude::*;
use rustls_native_certs::Certificate;

#[napi]
fn native_certs() -> Result<Vec<Buffer>> {
    return match rustls_native_certs::load_native_certs() {
        Ok(certs) => Ok(certs_to_buffers(certs)),
        Err(e) => Err(Error::from(e))
    }
}

// Return the certs as raw DER-encoded buffers (the JS layer will convert them to PEM-encoded strings)
fn certs_to_buffers(certs: Vec<Certificate>) -> Vec<Buffer> {
    certs.into_iter()
        .map(|e| {
            let buf = e.0.into();
            return buf;
        })
        .collect()
}
