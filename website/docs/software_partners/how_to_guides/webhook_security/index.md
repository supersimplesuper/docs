# Webhook security

When integrating with SuperAPI, it's important to ensure the origin of webhooks that are being sent into your system. To facilitate this we provide a message authentication code based on HMAC (https://en.wikipedia.org/wiki/HMAC)

Using this authentication code in practice looks like:

1. You receive a webhook from SuperAPI.
2. You extract the header `x-superapi-signature` from the request.
3. You sign the contents of our payload with the stored token and compare that with the extracted value from the header. If they match then you can attest the origin of the webhook was from SuperAPI.

## Signing tokens

A key component of this system is the token which is used to sign the request that is sent from us. This token is present on our [product object](https://api.superapi.com.au/swaggerui#/product/SuperApiWeb.Api.V1.ProductController.show) in the form of the field `webhook_signing_token`. This key will be returned to you when a product is created and should be stored securely in your system.
