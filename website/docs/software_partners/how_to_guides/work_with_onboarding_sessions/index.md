# Working with onboarding sessions

Onboarding sessions are the core component of SuperAPI. Conceptually, they are like a workflow that is created then given to an employee to complete. The term "workflow" gives a hint to the capabilities of what an onboarding session can do in SuperAPI (in fact, the name may change in a future version of our API to better reflect what what they can do). As of the date of writing this document, some of the things that workflows can do for an employee includes:

- Complete a TFN declaration
- Verify a phone number
- Setup multiple bank accounts and configure fund splits between them
- Nominate a super fund

You can think about each of these features as a _module_. When we create a workflow for you, it is possible to configure which modules are present. This allows you for example to create a full onboarding flow vs. just a flow to allow a user to update their bank account details.

We expect over time to expand the capabilities of these workflows. This will include new features like being able to collect user details, present documents and perform police or license checks.

## Creating a basic onboarding session

Onboarding sessions belong to an employee in our system and are managed by your [product key](/software_partners/how_to_guides/verify_my_product_api_key/index.html). To get started with an onboarding session, ensure that you have an [employer](/software_partners/how_to_guides/create_an_employer/index.html) created. Once you have an id of an employer, you can get started:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "employer": {
      "id": "a46556e4-c7a6-40ec-be37-642c447df460"
    },
    "employee": {
      "remote_id": "1234"
    },
    "email": "employee@example.com",
    "email_validated": true,
    "phone": "0405 123 456",
    "phone_number_validated": false,
    "workflow_slug": "your_provided_slug"
  }'
```

This is the minimal payload that can be passed for an onboarding session. That is, the employer that is creating the onboarding session and some basic contact details for the user.

::: tip
If you have validated the users email address or phone number already, please tell us in the payload.
:::

## Passing additional details

It is possible to pass additional details when creating an onboarding session. For example, passing an `employee_detail` payload will prefill many of the fields in our system and ensure that the user does not have to double enter details about themselves. It is perfectly safe to pass only as much detail as you have, we will fill in the rest.

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "employer": {
      "id": "a46556e4-c7a6-40ec-be37-642c447df460",
      "name": "The new company name"
    },
    "employee": {
      "remote_id": "1234"
    },
    "employee_detail": {
      "data": %{
        "address": {
          "address_line_1": "10 The Street",
          "locality": "Brunswick",
          "postcode": "3041",
          "state": "nsw"
        },
        "identity": %{
          "date_of_birth": "2003/11/09",
          "family_name": "Smith",
          "gender": "male"
        },
        tax_detail: %{
          "tfn": "123456789",
        }
      }
    },
    "email": "employee@example.com",
    "email_validated": true,
    "phone": "0405 123 456",
    "phone_number_validated": false,
    "workflow_slug": "your_provided_slug"
  }'
```

Notice that you can also pass additional details about the _employer_ here. If passed, we will automatically update the employer with those details. This can provide an easy hook to ensure that the employer is always up to date in our system before a user is onboarded to them. After the onboarding session has been created, it will then return a payload of data back to you. The important thing in this payload will be the id, as this is then used to construct the embed which can be given to the user to complete the onboarding.

This can be done as follows:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "valid_until": "2024-05-10T00:10:29Z"
  }'
```

This will then return the URL which can then be given to our [embed JavaScript](https://github.com/supersimplesuper/super-api-embed) before finally being present to the employee so that they can complete their onboarding.
