# Show fair work statements

SuperAPI provides a [fair work statements module](/software_partners/explanations/modules/fair_work_statements.html) that displays designated fair work statements to employees during onboarding. Employees can view, download and attest that they have received the required statements. This attestation is recorded as a datetime and returned to your system.

Fair work statements consist of three available options:

* Fair work information statement
* Casual employment information statement
* Fixed term contract information statement

Typically, you will send the Fair work information statement along with either the casual or fixed term contract statement depending on how the employee is engaged by the company.

Fair work statements do not require configuration in the onboarding templates as they are very straightforward. Instead, present them at the point you create the onboarding, for example:

![Identity](./images/fair_work_options.png)

Allow the employee to select the relevant statements on the fly.

## Creating an onboarding session with fair work statements

To create an onboarding session with fair work statements, use a payload like:

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
    "remote_id": "1234",
    "email_validated": true,
    "phone": "0405 123 456",
    "phone_number_validated": false,
    "workflow_slug": "your_provided_slug",
    "fair_work_statements": [
      "fair_work_information",
      "casual_employment"
    ]
  }'


Note the `fair_work_statements` field, which contains an array of enum values. For the full list of available enums, [consult our swagger spec](https://swagger.superapi.com.au/#/onboarding_session/superapiweb.api.v1.onboardingsessioncontroller.create).