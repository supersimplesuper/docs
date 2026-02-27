---
outline: deep
---

# Getting Started

This guide walks you through everything you need to go from receiving your API keys to displaying a working onboarding session in the browser.

## Prerequisites

You'll need:

- Your **partner API key** (provided by SuperAPI, email support@superapi.com.au if you don't have one)
- `curl` or a tool like [Postman](/postman_collection.json){target="_blank" download="download"} for making API requests
- A browser to view the employer and onboarding embeds

::: tip
All new partners start in **sandbox mode**. Sandbox behaves identically to production but will not cause any side effects in the real world. For example, requests to the ATO stapling API and direct super fund integrations are simulated so you can develop safely.
:::

## Step 1: Verify your partner key

Your partner key manages the relationship between SuperAPI and your organisation. Test it by fetching your partner details:

```bash
curl -X GET https://api.superapi.com.au/api/v1/partner \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyhere"
```

You should receive a response like:

```json
{
  "data": {
    "id": "a334d4cf-5599-4615-9616-991823eabbfb",
    "name": "YourCompanyName",
    "slug": "yourcompanyname",
    "custom_theme": null,
    "sandboxed": true
  },
  "version": "v1"
}
```

## Step 2: Create a product

A product represents an instance of your application in SuperAPI. For example, if your application runs on a custom domain for each customer, each instance would be a separate product. The data stored on the product defines how SuperAPI delivers information to your system and how SuperAPI behaves when embedded in your application (e.g. the `target_origin` and `webhook_url`).

Create a product using your partner key:

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/product \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyhere" \
  -d '{
    "name": "My App",
    "target_origin": "http://localhost",
    "webhook_url": "https://example.com/webhooks/superapi"
  }'
```

Note the `id` from the response as you'll need it in the next step.

::: info
`target_origin` is the origin where you'll embed SuperAPI iFrames. For local development, use `http://localhost`. See the [MDN docs on targetOrigin](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#targetorigin) for more detail.
:::

## Step 3: Create a product API key

Your product API key is what you'll use for day-to-day operations (creating employers, onboarding sessions, etc.). Generate one using your partner key:

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/product/:id/product-api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapipartner_yourkeyhere"
```

Replace `:id` with the product ID from Step 2.

The response will include an `api_key` field. **Save this securely.** This is your product API key and is used for all subsequent steps.

::: danger
Your product API key is sensitive. Do not check it into source control.
:::

Verify it works:

```bash
curl -X GET https://api.superapi.com.au/api/v1/product \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourproductkeyhere"
```

You should receive a response similar to:

```json
{
  "data": {
    "id": "bffc9067-28ee-4381-a0f2-92fae25d9f83",
    "name": "My App",
    "slug": "my-app",
    "target_origin": "http://localhost",
    "webhook_url": "https://example.com/webhooks/superapi",
    "sandboxed": true
  },
  "version": "v1"
}
```

## Step 4: Create an employer

Employers represent the businesses using your software. Every onboarding session belongs to an employer, so you need to create one first:

```bash
curl -X POST https://api.superapi.com.au/api/v1/employer \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourproductkeyhere" \
  -d '{
    "abn": "96878537596",
    "name": "Test Company",
    "remote_id": "employer-1",
    "country": "aus"
  }'
```

Note the `id` from the response.

::: info
The `remote_id` is your internal identifier for this employer (e.g. a primary key from your database). It's returned in webhooks so you can match SuperAPI events back to your records.
:::

## Step 5: Show the employer embed

Before employees can be onboarded, the employer needs to configure their settings via the employer embed. This is where the employer selects their default super fund, which is used as the fallback when an employee does not make a super choice and does not have a stapled fund. The employer default super fund must be set before onboarding sessions can be created.

Generate an embed URL to display this configuration UI:

```bash
curl -X POST https://api.superapi.com.au/api/v1/employer/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourproductkeyhere" \
  -d '{
    "app": "super_settings",
    "session_id": "test-session-1",
    "valid_until": "<UTC timestamp within 2 hours from now>"
  }'
```

Replace `:id` with the employer ID from Step 4.

The response contains an `embed_url` field. Open it in a browser to see the employer configuration embed. Use our [JavaScript library](https://github.com/supersimplesuper/super-api-embed) to embed this in your application via iFrame.

::: warning
Generated URLs are ephemeral. `valid_until` must be within 2 hours of the current time (UTC). Generated URLs are sensitive and should not be stored in a database.
:::

## Step 6: Create an onboarding session

Once the employer has configured their settings, you can create onboarding sessions for their employees:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourproductkeyhere" \
  -d '{
    "employer": {
      "id": "your-employer-id"
    },
    "employee": {
      "remote_id": "employee-1"
    },
    "email": "employee@example.com",
    "remote_id": "onboarding-1",
    "email_validated": true,
    "phone": "0405 123 456",
    "phone_number_validated": false,
    "workflow_slug": "standard_onboarding"
  }'
```

Note the `id` from the response.

::: tip
The more employee details you pass, the less the employee has to enter themselves. See [working with onboarding sessions](/software_partners/how_to_guides/work_with_onboarding_sessions/index.html) for the full set of fields you can pre-fill.
:::

## Step 7: Show the onboarding embed

Generate an embed URL for the onboarding session:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapiproduct_yourproductkeyhere" \
  -d '{
    "valid_until": "<UTC timestamp within 2 hours from now>"
  }'
```

Open the returned `embed_url` in a browser. You'll see the onboarding experience your employees will go through, including super choice, tax details, bank accounts, and whatever other [modules](/software_partners/explanations/modules/index.html) are configured.

## What happens next?

When an employee completes their onboarding session, SuperAPI will:

1. Send a **webhook** to the `webhook_url` you configured on your product. The webhook is an event notification and does not contain the session data itself. When you receive a webhook, you should fetch the relevant data from SuperAPI using the ID included in the event.
2. Emit a **post-message** via the iFrame so your frontend can react immediately (e.g. close the iFrame, show a success message)

To handle these in your integration:

- [Webhook security](/software_partners/how_to_guides/webhook_security/index.html): verify incoming webhooks with HMAC
- [List of webhooks](/software_partners/references/list_of_webhooks/index.html): understand the events and payloads
- [Work with webhooks locally](/software_partners/how_to_guides/work_with_webhooks_locally/index.html): test with ngrok during development

## Next steps

- Browse the [available modules](/software_partners/explanations/modules/index.html) to see what you can include in onboarding
- [Customise the look and feel](/software_partners/how_to_guides/customise_the_look_and_feel/index.html) to match your brand
- Read about [SuperAPI entities](/software_partners/explanations/understanding_super_api_entities/index.html) to understand the full data model
- Explore the [API reference](https://api.superapi.com.au/swaggerui) for all available endpoints

<!--@include: @/parts/getting_help.md-->
