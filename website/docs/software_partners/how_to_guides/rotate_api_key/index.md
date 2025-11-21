# Rotating API keys

SuperAPI does not enforce a lifetime on API keys but allows you to rotate your API keys if you have a requirement to do so. Broadly, these steps are:

1. Provision a new API key
2. Test that the new key works
3. Store your new key
4. Deactivate the old key

API key rotation is currently supported only for product API keys and requires the use of a partner API key to perform rotation.

## Provisioning a new key

The first step in the key rotation is to request a new key for the product that is having its key rotated. This request looks like:

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/product/:id/product-api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyQvyaXOF"
```

Here, `:id` is the product having its key rotated, and `x-api-key` is the partner key you are using to perform the rotation. The response to this request will contain the new API key in the `api_key` field.

## Test and store your API key

At this point you will have two API keys (SuperAPI supports an unlimited number of active keys for a product, but we suggest limiting this to just the keys you require for use). To test that the new API key is functioning as expected:

```bash
curl -X GET https://api.superapi.com.au/api/v1/product \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourkeyQvyaXOF"
```

This route will return details about the product that was used when calling it. A 200 response indicates that the key is working correctly. Once tested, please store the API key for future use.

## Remove the old API key

Now that you have minted the new, working API key, you can remove the old key by using a `DELETE` request:

```bash
curl -X DELETE https://api.superapi.com.au/api/v1/partner/product/:id/product-api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyQvyaXOF"
```

This will then mark the old API key as deactivated. Deactivated keys are still present in our database (along with the deactivation time for auditing purposes) but can no longer be used.
