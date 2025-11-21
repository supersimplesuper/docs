# Onboarding templates

Some features of [onboarding sessions](/software_partners/how_to_guides/work_with_onboarding_sessions/index.html) require an onboarding template to unlock additional functionality. An onboarding template is a reusable configuration for an onboarding session. It allows an employer to specify additional requirements (like extra documents to upload or custom questions to answer) for a particular type of employee or role. For example, imagine a childcare onboarding an employee who drives the bus. You would want to collect details like:

* An appropriate driver's license
* A working with children's check
* A question form to capture the driver's measurements for a uniform.

Onboarding templates provide the flexibility to capture additional information beyond the standard onboarding. They are designed to be applied to multiple employees that all perform the same role in an organisation. Onboarding templates are not required for onboarding sessions, they simply unlock additional features.

## Modules requiring onboarding templates

The following modules require onboarding session templates to be configured so that they can be used.

* Document uploads (for collecting files/documents from the employee)
* E-signing / form completion (for presenting forms or documents to be filled out and signed)

## Configuring onboarding templates

Onboarding templates are configured by the employer using a custom embed (very similar to the superannuation setup embed). Assuming an employer has already been created in SuperAPI, you can load the embed with:

```bash
curl -X POST https://api.superapi.com.au/api/v1/employer/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "app": "templates",
    "session_id": "f4ffe46e-170d-407b-8fc9-f6b594da9e5d",
    "valid_until": "2024-05-10T00:10:29Z"
  }'
```

This embed opens a UI where the employer can create and manage their onboarding templates. We recommend placing this embed in the employer configuration section of your app.

## Using an onboarding template

Onboarding templates should be given to the onboarding session at the time of creation. Templates cannot be added to an onboarding session after it has been created.

[Use the API to list available templates for an employer](https://swagger.superapi.com.au/#tag/employer_templates) when your employer is about to create a new onboarding session. Present these options in your UI for the employer to choose from. Once a template is selected, create the onboarding session via the API and include the chosen template’s ID in the `template_id` field of the payload.