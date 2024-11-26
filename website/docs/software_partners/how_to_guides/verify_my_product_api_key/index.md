# Verify my product API key and view product settings

It's likely that if you're reading this guide, you've already been issued an API key and want to perform a basic check to make sure that you can successfully access SuperAPI. This guide has been written with the tool `curl` in mind but should also work equally well with tools like Postman and others.

You can also use this endpoint to validate the details related to an API key, such as `webhook_url`, `target_origin` and the `sandbox` status for your product.

::: info
If you haven't been issued an API key, request one from: support@superapi.com.au
:::

## Step 1

The first step is to issue a request to a special endpoint we have that will return details about the product that the key is associated with. To do so:

```bash
curl -X GET https://api.superapi.com.au/api/v1/product \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourkeyQvyaXOF"
```

::: tip
Remember to replace the `x-api-key` header with the API key that has been provisioned for you.
:::

## Step 2

After issuing the `curl` request above, you will receive a payload similar to the following. This payload contains the details about the product you are currently authenticated as. It will be similar to:

```json
{
  "data": {
    "id": "bffc9067-28ee-4381-a0f2-92fae25d9f83",
    "name": "Your Product Name",
    "slug": "your-product-name",
    "target_origin": "example.com",
    "webhook_url": "https://example.com/webhook",
    "sandboxed": true
  },
  "version": "v1"
}
```

After you've gotten your product key working, [check out how to create an employer](/software_partners/how_to_guides/create_an_employer/index.html).
