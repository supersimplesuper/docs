# Onboarding templates

Some features of [onboarding sessions](/software_partners/how_to_guides/work_with_onboarding_sessions/index.html) require an onboarding template to be applied to the onboarding session to enable functionality. Conceptually, this is the employer customising an onboarding session for a particular kind of employee. As an example, imagine a childcare onboarding an employee who drives the bus. You would want to collect details like:

* An appropriate drivers license
* A working with children's check
* A question form to capture the drivers measurements for a uniform.

Onboarding templates allow the customisation required of an onboarding session to capture this kind of information. They are designed to be applied to multiple employees that all perform the same role in an organisation.

## Modules requiring onboarding templates

The following modules require onboarding session templates to be configured so that they can be used.

* Document uploads
* E-signing / form completion (coming soon)

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

This will present a UI that allows the creation and management of onboarding templates for that employer. You should place this embed in the appropriate employer setup or configuration portion of your software.

## Using an onboarding template

Onboarding templates should be given to the onboarding session at the time of creation. They cannot be added to an onboarding session after it has been created. You can [query a list of available onboarding templates](https://swagger.superapi.com.au/#tag/employer_templates) which should be done in your UI at the point the onboarding session is being created. Then, when the employer has chosen a template, create the onboarding session itself passing a `template_id` field equal to the onboarding template that should be used for that session.