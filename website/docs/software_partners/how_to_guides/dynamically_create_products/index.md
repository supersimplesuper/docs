# Dynamically create products

In [some situations](/software_partners/explanations/product_vs_partner_api_keys/index.html) you may want to dynamically create products in SuperAPI. This is a short guide on how to use a product API key to create a product on the fly.

## Step 1

To perform these steps, you'll need to have access to a partner API key, first, test if it works by fetching information about the partner the key is linked to:

```bash
curl -X GET https://api.superapi.com.au/api/v1/partner \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyQvyaXOF"
```

This should return a small JSON payload similar to:

```json
{
  "data": {
    "id": "a334d4cf-5599-4615-9616-991823eabbfb",
    "name": "PartnerName"
  },
  "version": "v1"
}
```

## Step 2

With your working partner key, send a request similar to the following to create a new product.

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/product \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyQvyaXOF" \
  -d '{
    "name": "My product name",
    "show_toast_messages": true,
    "target_origin": "example.com",
    "webhook_url": "https://www.example.com/webhook_destination"
  }'
```

This will create the product entity, similar to:

```json
{
  "data": {
    "id": "b99557ae-44eb-43c0-b2e7-20d73161ef1e",
    "name": "My product name",
    "slug": "my-product-name",
    "target_origin": "target_origin_example.com",
    "webhook_url": "https://www.example.com/webhook_destination",
    "bank_details_configuration": {
      "id": "2e6b4c5a-3336-4ce9-89d1-5137fda6379b",
      "max_bank_accounts": 3
    },
    "sandboxed": true,
    "show_toast_messages": true
  },
  "version": "v1"
}
```

## Step 3

The final step is to then request an API key for that product. As we don't have an API key for our product yet, we must use our partner API key to also create the product API key, that can be done with:

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/product/:id/product-api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyQvyaXOF"
```

(remember to replace :id with the product generated in step 2)

This final step will return the product API key to you in the field `api_key`.

::: warning
Ensure you protect this API key! Do not check it into your source code control.
:::
