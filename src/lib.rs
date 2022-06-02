#[napi_derive::napi]
pub fn load_native_certs() -> napi::Result<Vec<napi::bindgen_prelude::Buffer>> {
    Ok(rustls_native_certs::load_native_certs()?
        .into_iter()
        .map(|e| e.0.into())
        .collect())
}