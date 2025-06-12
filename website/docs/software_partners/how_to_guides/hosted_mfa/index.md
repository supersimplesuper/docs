# Hosted MFA

To enhance security, SuperAPI offers a hosted Multi-Factor Authentication (MFA) solution. Currently, we support SMS-based verification as the second factor.

If you require support for other methods, such as authenticator apps or passkeys, please [contact us](mailto:support@superapi.com.au) with your requirements.

## Implementing MFA

### 1. Creating an employee

Before initiating MFA, ensure the employee exists in SuperAPI. You can create an [employee directly](https://swagger.superapi.com.au/#tag/employee/operation/SuperApiWeb.Api.V1.EmployeeController.create) or as part of an [onboarding session](https://swagger.superapi.com.au/#tag/onboarding_session/operation/SuperApiWeb.Api.V1.OnboardingSessionController.create) using the `employee` key in the payload.

You will need to ensure that you have created a phone number under the `employee_details` key.

Example: Create an employee:

```bash
curl -X POST "https://api.superapi.com.au/api/v1/employer/bce2ed15-460a-4fd7-8a06-bc3378e88419/employee" \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "email": "employee@example.com",
    "data": {
      "phone_numbers": [
        {"phone_number": "+61405472749"}
      ]
    },
    "remote_id": "150"
  }'
```

Store the returned `id` of the employee for subsequent requests.

### 2. Generate the MFA Embed URL

After creating the employee, [generate a one-time MFA embed URL](https://swagger.superapi.com.au/#tag/mfa_embed_url/operation/SuperApiWeb.Api.V1.MfaEmbedUrlController.create).

Example: Generate MFA embed URL:

```bash
curl -X POST "https://api.superapi.com.au/api/v1/mfa-verification/employee/0a2ed63d-0fbb-4bf1-a98d-b72d0be70667/generate-embed-url?valid_until=2025-06-09T07:44:54Z&app=mfa&max_attempts=3&session_id=555" \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge"
```

The response includes an `embed_url`. Use this URL with the [SuperAPI Embed JavaScript Library](https://github.com/supersimplesuper/super-api-embed) to render the MFA widget on your page.

### 3. Handle the MFA Result

Once the employee completes the MFA process, a client-side event `mfa_verification:complete` is emitted. This event will be emitted for both success and failure flows. To determine if the flow was a success, you will need to fetch the employee entity.

Example: Fetch employee status

```bash
curl -X GET "https://api.superapi.com.au/api/v1/employee/bce2ed15-460a-4fd7-8a06-bc3378e88419" \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge"
```

In the response, examine the `phone_numbers` array to:

* Confirm the verified phone number matches your records.
* Ensure the verification occurred within your acceptable timeframe (e.g., within the last hour).