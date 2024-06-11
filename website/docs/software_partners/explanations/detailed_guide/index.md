---
outline: deep
---

# Integrating SuperAPI

The following is a detailed step by step guide on how to integrate SuperAPI into your product.

<!--@include: @/parts/getting_help.md-->
<!--@include: @/parts/terminology.md-->

## Changelog

| Date       | Change                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| 10/05/2024 | `valid_until` changed to be an ISO8601 timestamp for consistency                                           |
| 08/05/2024 | Documented disclaimers and bank accounts                                                                   |
| 07/05/2024 | Generated PDF super assets moved under the onboarding_session_super_selection                              |
| 16/04/2024 | Return more fields on `employee_detail`'s                                                                  |
| 08/04/2024 | Add more detail on the `expires_at` column for `onboarding_session`'s                                      |
| 21/03/2024 | Added `middle_name` and `has_financial_supplement_debt` to employee creation                               |
| 20/03/2024 | Added `casual` and `labour_hire` pay basis enums                                                           |
| 06/03/2024 | Indicate that the TFN under the `super_fund_member_detail` response can be null                            |
| 05/03/2024 | Modified endpoint from `v2.superapi.com.au` to `api.superapi.com.au`                                       |
| 15/02/2024 | Added `other` type for gender (free form entry coming soon). Added additional titles.                      |
| 15/02/2024 | Converted enums to be lowercase, added additional tax fields to employees and address details to employers |
| 02/02/2024 | Added an example payload for the onboarding session webhook response                                       |
| 29/01/2024 | Public release of the docs                                                                                 |

## Getting setup

Make sure you read the [Overview](/software_partners/explanations/overview/index.html) so you have an understanding of how SuperAPI integrates with 3rd party products. This document has been designed to give you a high level overview of how the pieces of software, i.e. your product and SuperAPI, fit together. That high level understanding will make the following detailed process much easier to follow.

### Obtaining your API keys

The first step is to obtain your API keys from SuperAPI. These API keys identify your software to SuperAPI and allows you to create and read data from our system. If you have not obtained your keys yet then please email sam@superapi.com.au to have one provisioned.

Depending on your setup, we can provision keys for your staging and local development environments (it is also possible for developers to share a key). Once you're happy with your implementation of SuperAPI then get in touch with us and we can provision you production keys for use in your live environment.

If your software is not multi-tenanted then please talk to us about how to programatically generate api keys for each of your instances. Ideally you should have only one production key but in some software architectures it may make sense to generate API keys for each instance of your production software.

::: danger
Your api key is sensitive data and should be treated as such. With it, personal information about the sessions your users have created in SuperAPI can be read. Ensure it is not checked into your source code repository.
:::

#### What is the sandbox?

Sandboxed instances of SuperAPI are made for development and testing purposes. Sandboxed instances have the same functionality as unsandboxed (production) instances. Sandboxed instances are restricted from interacting with external services, such as Super Fund & ATO services. This protects your development & testing environments from accidentally interacting with any external production systems.

This does not impact how you can integrate with SuperAPI, as any required external services are mocked to enable the required functionality within the sandbox. Only the experience that users will have when going through a super selection flow is impacted.

### Details needed to create your API key

When we create your API key, we will need some details about you. These are:

| Field               | Description                                                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| product_name        | Name of your product that will be using the API key                                                                                                                                                                                 |
| webhook_url         | The callback URL that will be used to send data as it changes in our system                                                                                                                                                         |
| target_origin       | Target origin so we can safely broadcast iFrame message to the secured destination (need help? [Read the MDN docs on `targetOrigin` for iFrames](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#targetorigin)) |
| show_toast_messages | If we should show toast messages in the iFrame. Disable this if you want to hook our JavaScript API into your toast display system to create seamless notifications.                                                                |

In addition to the API key, you will also be provided a unique token which has been generated by us that you can use to identify webhook as originating from our system.

## SuperAPI Overview

```mermaid
sequenceDiagram
    participant P as 3rd Party Platform
    actor Employer as Employer
    actor Employee
    participant S as SuperAPI

    note over P,S: Employer setup

    P->>S: Create employer object
    P->>Employer: Present employer embed to employer user
    Employer->>Employer: Configure employer options via the employer embed
    Employer-->>S: Save employer options via SuperAPI
    S->>P: Send post-message (or webhook?) confirmation that employer has completed configuration
    P->>P: Process post-message from employer embed

    note over P,S: Employer setup complete

    note over P,S: Employee onboarding begins

    P->>Employee: Commence employee onboarding process
    Employee->>Employee: Completes one or more onboarding steps
    Employee->>P: Receive employee details

    note over P,S: SuperAPI process begins

    P->>S: Create onboarding_session w/ employee details
    S->>P: Receive onboarding_session response
    P->>S: Generate embed url
    S->>P: Receive embed url response
    P->>Employee: Create iframe with embed url and present to employee
    Employee->>Employee: Completes super selection session
    Employee-->>S: Super selection session saved
    S->>P: Webhook
    S->>P: Post-message via iframe
    P->>P: process post-message
    P->>Employee: Close iframe / navigate to other onboarding steps (not part of SuperAPI)

    note over P,S: Employee SuperAPI Onboarding Session Complete
```

## Our REST endpoints

All calls to our Rest endpoints will return the same structured metadata, this is represented as:

| Field   | Kind   | Description                                                                                                  |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| data    | object | The serialised object in our system                                                                          |
| version | string | The version of serialised data. This will match the version in the endpoint that the record was created with |

## Employer setup process

Each new employer must be setup in SuperAPI before they can begin onboarding their employees. Setting up an employer is a two step process. First the employer must be created via the API. Then the employer embed must be presented to a user of the employer so they can configure their employer settings.

### Overview

```mermaid
sequenceDiagram
    participant P as 3rd Party Platform
    actor Employer as Employer
    actor Employee
    participant S as SuperAPI

    P->>S: Create employer object
    P->>Employer: Present employer embed to employer user
    Employer->>Employer: Configure employer options via the employer embed
    Employer-->>S: Save employer options via SuperAPI
    S->>P: Send webhook with employer configuration data
    S->>P: Send post-message via iframe to confirm employer has completed configuration
    P->>P: Process post-message from employer embed

    note over P,S: Employer setup complete
```

## Employer endpoint

### Creating employers

An `employer` object must be created before an employee can be onboarded via SuperAPI. Employer objects contain information about the employer that the employee is onboarding with. This can include the name, abn and default super fund for the employer.

::: warning
If you don't configure an employer and attempt to create an onboarding session, you will receive an error! Please ensure that your system prevents onboarding sessions being created for an employer until the employer object has been created, and you've presented the employer configuration embed to a member of the employer team.
:::

We suggest that you create a table to map the relationship between the employer in your system and the employer object in SuperAPI. In a relational database system, this could look like:

```mermaid
classDiagram
    class SuperAPI {
        +UUID id
    }
    class EmployerSuperAPIEmployers {
        +int id
        +int employer_id Foreign key to internal employers table
        +UUID super_api_employer_id Foreign key to remote SuperAPI record
        +data data returned to you from SuperAPI about the employer
    }
    class Employers {
        +int id
    }
    SuperAPI "1" -- "1" EmployerSuperAPIEmployers : linked via Rest API
    EmployerSuperAPIEmployers "1" -- "*" Employers : internal link via foreign key
```

With this join table in place, you will have a way of linking the employer record in your system with the employer object that is in SuperAPI.

### Example request

To create an employer object within SuperAPI, you can use an API call like:

```bash
curl -X POST https://api.superapi.com.au/api/v1/employer \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "name": "The company name",
    "abn": "12345",
    "remote_id": "12345"
  }'
```

::: info
After the `api` component in the URL you will notice a version. Creating a record under a particular version will affect the format of the data returned to you from the request and in future webhook responses. We will keep you updated about changes to the versions as they occur.
:::

### Request payload

When sent, this endpoint will respond with a `201` HTTP status code indicating that the employer object was created.

The request payload of the data is:

| Field               | Kind   | Required | Description                                                                                                                                                                            |
| ------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| abn                 | string | Yes      | A valid Australian ABN number. This is used when generating the superannuation selection                                                                                               |
| address_line_1      | string | Yes      | The first line of the address                                                                                                                                                          |
| address_line_2      | string | No       | The second line of the address                                                                                                                                                         |
| contact_email       | string | Yes      | The email address of the primary contact of the business                                                                                                                               |
| contact_person_name | string | Yes      | The name of the primary contact of the business                                                                                                                                        |
| contact_phone_name  | string | Yes      | The phone nuimber of the primary contact of the business                                                                                                                               |
| locality            | string | Yes      | The locality (e.g. suburb) of this employer                                                                                                                                            |
| name                | string | Yes      | The name of the company or organisation being setup                                                                                                                                    |
| postcode            | string | Yes      | The postcode of this employer                                                                                                                                                          |
| remote_id           | string | Yes      | The id of the record that this employer is being linked to in your database. This remote_id will be returned to you so that you can map responses back to the record that created them |
| state               | string | Yes      | The state of this employer, one of: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act` or `tas`                                                                                              |

### Response payload

The response will contain an [employer](#response_data_employer)

## Onboarding session

The process of onboarding a new employee with SuperAPI is a two step process. First an onboarding session is created, then the employee is presented with the employee embed (iframe), via which they can complete their super selection.

It is assumed that the SuperAPI super selection step is **not** the first step within your employee onboarding process. Based on this assumption, it is also assumed that you will bootstrap the the onboarding session with employee details that have been collected through the other steps in your employee onboarding journey. The employee details you provide to the onboarding session will be use to prefill any details the employee is required to enter. Some functionality within the employee onboarding session is dependent on employee details (such as stapling / presenting existing super funds) but these features will gracefully degrade is the emloyee details are not provided (or are invalid).

Unlike the employer embed, the onboarding session is ephemeral. It is expected that a user will have at least one onboarding session but may have more. For example, you may want to require the user to come back to your system to make another super selection after a year to ensure they are making optimal choices about the super fund that they use. In this case, the employee would have two onboarding sessions, each a year apart.

### Overview

```mermaid
sequenceDiagram
    participant P as 3rd Party Platform
    actor Employee
    participant S as SuperAPI

    P->>Employee: Commence employee onboarding process
    Employee->>Employee: Completes one or more onboarding steps
    Employee->>P: Receive employee details

    note over P,S: SuperAPI process begins

    P->>S: Create onboarding_session w/ employee details
    S->>P: Receive onboarding_session response
    P->>S: Generate embed url
    S->>P: Receive embed url response
    P->>Employee: Create iframe with embed url and present to employee
    Employee->>Employee: Completes super selection session
    Employee-->>S: Super selection session saved
    S->>P: Webhook w/ onboarding_session details (completed)
    S->>P: Post-message via iframe to confirm onboarding_session has been completed
    P->>P: process post-message
    P->>Employee: Close iframe / navigate to other onboarding steps (not part of SuperAPI)

    note over P,S: Employee SuperAPI Onboarding Session Complete
```

## Onboarding sessions endpoint

### Creating onboarding sessions

Onboarding sessions are created via the onboarding_session endpoint. An employee can have multiple onboarding sessions (i.e one current session and multiple historic sessions that have been archived). An onboarding session will expire after 7 days. After an onboarding session expires it will be archived and any PII information removed or hashed in the database.

### Example request

To create an onboarding session under your account, you can use an API call like:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding_session \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "employer": {
      id: "8f19e887-0530-4e24-af9b-0cb8a6ce5e91",
    },
    "email": "person@example.com",
    "phone_number": "0405472748",
    "remote_id": "12345",
    "employee_detail": {
      "given_name": "The Name"
    }
  }'
```

::: info
After the `api` component in the URL you will notice a version. Creating a record under a particular version will affect the format of the data returned to you from the request and in future webhook responses. We will keep you updated about changes to the versions as they occur.
:::

### Request Payload

The request payload of the data is:

| Field                                         | Kind    | Required | Default | Description                                                                                                                                                                            |
| --------------------------------------------- | ------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| email                                         | string  | Yes      |         | The email address of the employee that is onboarding, used to identify and verify them in some circumstances                                                                           |
| email_validated                               | boolean | No       | true    | Has the employees email address been validated by you? One of either this or `phone_number_validated` must be true                                                                     |
| employee_detail.address_line_1                | string  | No       |         | The first line of the employees address (e.g. Apartment 10)                                                                                                                            |
| employee_detail.address_line_2                | string  | No       |         | The second line of the employees address (e.g. 10 The Street)                                                                                                                          |
| employee_detail.address_line_3                | string  | No       |         | The third line of the employees address                                                                                                                                                |
| employee_detail.address_line_4                | string  | No       |         | The fourth line of the employees address                                                                                                                                               |
| employee_detail.date_of_birth                 | string  | No       |         | Must be in the format yyyy/mm/dd                                                                                                                                                       |
| employee_detail.family_name                   | string  | No       |         | The last name of the employee                                                                                                                                                          |
| employee_detail.gender                        | string  | No       |         | Must be one of `male`, `female` or `other`                                                                                                                                             |
| employee_detail.given_name                    | string  | No       |         | The given name of the employee, used to prefill fields in our forms                                                                                                                    |
| employee_detail.has_financial_supplement_debt | boolean | No       |         | Does this employee have a financial supplement debt?                                                                                                                                   |
| employee_detail.locality                      | string  | No       |         | The suburb that you are located in, e.g. Footscray                                                                                                                                     |
| employee_detail.middle_name                   | string  | No       |         | The middle name of the employee                                                                                                                                                        |
| employee_detail.pay_basis                     | string  | No       |         | Must be one of: `full_time`, `part_time`, `casual` or `labour_hire`                                                                                                                    |
| employee_detail.postcode                      | string  | No       |         | The postcode of the employee, e.g. 3000 for Melbourne City                                                                                                                             |
| employee_detail.previous_family_name          | string  | No       |         | The previous family name you might have been known by                                                                                                                                  |
| employee_detail.previous_given_name           | string  | No       |         | The previous given name you might have been known by                                                                                                                                   |
| employee_detail.residency_type                | string  | No       |         | Must be one of: `australian_resident_for_tax_purposes`, `foreign_resident` or `working_holiday_maker`                                                                                  |
| employee_detail.state                         | string  | No       |         | Which state the employee is located in, one of: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act` or `tas`                                                                                  |
| employee_detail.tfn                           | string  | No       |         | The Tax File Number of the employee                                                                                                                                                    |
| employee_detail.tfn_exemption_type            | string  | No       |         | Must be one of: `not_quoted`, `pending`, `pensioner` or `under_eighteen`                                                                                                               |
| employee_detail.title                         | string  | No       |         | Must be one of: `mr`, `mrs`, `miss`, `ms`, `dr` or `other`                                                                                                                             |
| employer.has_study_and_training_repayment     | boolean | No       |         | Does this employee have any training or loan repayments (e.g. HELP loan)                                                                                                               |
| employer.id                                   | string  | Yes      |         | The id of the employer that this onboarding session is being created for. This was returned to you when an employer was created.                                                       |
| employer.tax_free_threshold_claimed           | boolean | No       |         | Has this employee claimed the tax free threshold for this employer?                                                                                                                    |
| phone_number                                  | string  | Yes      |         | The mobile phone number of the employee that is onboarding, used to identify and verify them in some circumstances                                                                     |
| phone_number_validated                        | boolean | No       | false   | Has the employees email address been validated by you? One of either this or `email_validated` must be true                                                                            |
| remote_id                                     | string  | Yes      |         | The id of the record that this employer is being linked to in your database. This remote_id will be returned to you so that you can map responses back to the record that created them |

::: info
If optional fields are not provided then the user will have to enter them again. By passing fields when constructing the onboarding session, we avoid double entry of data. The user will also get a chance to amend any details that have been passed into the system. You will receive the updated details via a webhook later if you want to update your own internal systems.
:::

### Response Payload

When a valid request is received this endpoint will respond with a `201` HTTP status code indicating that the onboarding session record was created.

The response will contain an [onboarding_session](#response_data_onboarding_session)

### Partner implementation example

Designing database tables to support the SuperAPI onboarding sessions is similar to the way the employer <> SuperAPI relationship works:

```mermaid
classDiagram
    class SuperAPI {
        +UUID id
    }
    class SuperAPIOnboardingSession {
        +int id
        +int super_api_onboarding_session_request_id
        +UUID super_api_onboarding_session_id
        +data data returned to you from SuperAPI about the created onboarding_session
    }
    class Employee {
        +int id
    }
    SuperAPI "1" -- "1" SuperAPIOnboardingSession : linked via Rest API
    SuperAPIOnboardingSession "1" -- "*" Employee : internal link via foreign key
```

## UI embeds (iframes)

Once you have created the employer in SuperAPI you are then ready to show the embed which allows the employer to configure themselves in SuperAPI. SuperAPI has been designed to be very easy to integrate into your system and most of the ease comes from the use of our embed system which reduces the amount of code that you need to write and reduces the burden of keeping up to date with our changes.

### Creating a UI embed (iframe)

To create the employer embed URL given to our JavaScript library for rendering, you have two options:

1. Self sign the URL in your system using the signing token. This is fairly complex but it removes the need to make a request to our system.
2. Use our `generate_embed_url` endpoint which can provide the signed URL for you. (**recommended**)

::: info
Signed URLs are a core part of the SuperAPI security infrastructure. They allow you to control how long a URL is valid for and to modify other behaviour around the way the embed works. This configuration is enabled while also preventing any possibility of tampering by users of the system
:::

### Example Request

To obtain a self signed URL in our system you will need a SuperAPI employer object ID (see above for how to create this). Once you have this, you can use an API call like:

```bash
curl -X POST https://api.superapi.com.au/api/v1/employer/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "options": {
      "valid_until": "2024-05-10T00:10:29Z",
      "app": "super_settings",
      "session_id": "your_session_id"
    },
  }'
```

### Request Payload

This request takes an `options` payload which allows you to customise the way the embed functions. You can control the embed behaviour with the following options:

| Field       | Kind   | Description                                                                                                                                                                                                                                     |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| valid_until | string | At what point in time does this URL stop functioning in IS8601 format                                                                                                                                                                           |
| app         | string | The name of the app that you want to load. Generally, this will be `super_settings`                                                                                                                                                             |
| session_id  | string | A unique string by which we will identify the session in our system. This is useful for maintaining state across multiple instances of the embed for the same user. We recommend you use something like a 'userid' or equivalent in your system |

::: danger
**Do not store the generated urls!** Rather, create them at the time the page is being rendered. It is important to set a value for the `valid_until` which is not too far into the future. A suggested value is 30 seconds. It is safe to sign or request a generated URL each time the page is loaded.
:::

The other embed available in the system is for the onboarding session. Once you have an onboarding session created, you can create an embed for it using a very similar request to the employer embed:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding_session/:id/generate-embed-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "options": {
      "valid_until": "2024-05-10T00:10:29Z"
    },
  }'
```

The `onboarding_session` embed takes the same options as the `employer` embed.

### Managing embeds

Once the employer embed URL has been created you can then use our JavaScript library to manage the creation of the embed. This library manages mounting the iFrame containing our UI and provides an interface for easily listening to events that emanate from the iFrame.

See: [super-api-embed](https://github.com/supersimplesuper/super-api-embed) JavaScript library

## Webhooks

Webhooks exist as the primary mechanism to transport data from SuperAPI back to the partner website. Webhooks will always deliver to the same URL (this is configured when we provision your partner account, contact us if you need to update this) but will be wrapped in metadata to help distinguish the event that triggered the webhook.

### Response payload

The fields contained in a webhook are:

| Field   | Kind   | Description                                                                                                  |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| data    | object | The serialised object in our system that is related to the webhook being sent                                |
| version | string | The version of serialised data. This will match the version in the endpoint that the record was created with |
| kind    | string | The event kind of the webhook                                                                                |

### Types of webhooks

Currently we deliver two webhooks:

| Name                         | Description                                                                                                                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| employer_settings_changed    | The employer changed their settings in SuperAPI (e.g. changed the default super fund for their employees). The `data` key contains an [employer](#response_data_employer)                                                   |
| onboarding_session_completed | The employee has completed onboarding within SuperAPI. The `data` key contains an [onboarding_session](#response_data_onboarding_session). See an [example onboarding session webhook](#example_onboarding_session_webhook) |

From a programming point of view, it is suggested that within the endpoint controller of the webhook, you match on the `kind` field (which will always be unique) then dispatch from that as needed.

## Response data types

SuperAPI returns a number of different data types. By default, we will automatically unroll the relationships that an object has so it easy for you to access. These data types are identical between our REST API and Webhook requests.

::: danger
We may expand the returned payload with additional fields in the future, it is assumed that this is NOT a breaking change to our API. If fields are required to be removed then they will be deprecated with notice.
:::

### <a id="response_data_employer"></a> `employer`

Represents an employer that the employee is onboarding to.

| Field                               | Kind      | Description                                                                                             |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| id                                  | uuid      | ID                                                                                                      |
| abn                                 | string    | The ABN of the company that was just created                                                            |
| address_line_1                      | string    | The first line of the employers address                                                                 |
| address_line_2                      | string    | The second line of the employers address                                                                |
| contact_email                       | string    | The contact email for this employer                                                                     |
| contact_person_name                 | string    | The name of the person to contact at this employer                                                      |
| contact_phone_number                | string    | The contact number of this employer                                                                     |
| employer_default_super_fund_product | reference | [employer_default_super_fund_product](#response_data_employer_default_super_fund_product)               |
| last_activity_at                    | string    | ISO8601 timestamp of the last time the employer interacted with the embed                               |
| locality                            | string    | Locality (suburb) that the employer is located in                                                       |
| name                                | string    | The name of the company you just created                                                                |
| postcode                            | string    | Postcode of the employers location                                                                      |
| remote_id                           | string    | ID that points back to the record in **your** system                                                    |
| requires_default_fund_selection     | boolean   | Indicates if a default super fund must be set by the employer before onboarding sessions can be created |
| state                               | string    | Which state this employer is located in                                                                 |

### <a id="response_data_employer_default_super_fund_product"></a> `employer_default_super_fund_product`

Details about the default super fund product that the employer has selected.

| Field                 | Kind      | Description                                                                   |
| --------------------- | --------- | ----------------------------------------------------------------------------- |
| id                    | uuid      | ID                                                                            |
| employer_number       | string    | An id for this employer which allows them to be identified by the super fund. |
| super_fund_product.id | reference | [super_fund_product](#response_data_super_fund_product)                       |

### <a id="response_data_super_fund_product"></a>`super_fund_product`

A product offered by a super fund. Often what is considered a "super fund" because of the ABN and USI numbers associated with it.

| Field             | Kind   | Description                                                                          |
| ----------------- | ------ | ------------------------------------------------------------------------------------ |
| id                | uuid   | ID                                                                                   |
| abn               | string | The ABN of the fund                                                                  |
| long_description  | string | A longer of description about the fund, suitable for content in the body of the page |
| name              | string | The name of the fund being offered                                                   |
| short_description | string | A shorter description about the fund, suitable for use in a list                     |
| usi_number        | string | The unique usi of the fund                                                           |

### <a id="response_data_onboarding_session"></a> `onboarding_session`

An instance of an employee being taken through our onboarding flow. Currently only super onboarding is supported.

| Field                              | Kind      | Description                                                                                                                                                                                  |
| ---------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                 | uuid      | ID                                                                                                                                                                                           |
| bank_account_collection            | reference | [bank_account_collection](#response_data_bank_account_collection)                                                                                                                            |
| data_delivery_state                | string    | What state is the delivery of the data to you in? This will always be `complete`                                                                                                             |
| email                              | string    | Email address of the employee as given when the onboarding session was created                                                                                                               |
| email_validated                    | boolean   | Has this email address been validated as belonging to the employee                                                                                                                           |
| employee_detail                    | reference | [employee_detail](#response_data_employee_detail)                                                                                                                                            |
| employer                           | object    | Contains the same details as the employer webhook. Mirrored here for convenance.                                                                                                             |
| expires_at                         | string    | What date will this onboarding session expire. Once expired this onboarding session can no longer be used. Additionally, all PII data is removed. Defaults to 30 days from time of creation. |
| onboarding_session_super_selection | reference | [onboarding_session_super_selection](#response_data_onboarding_session_super_selection)                                                                                                      |
| phone_number                       | string    | Mobile number of the employee as given when the onboarding session was created                                                                                                               |
| phone_number_validated             | boolean   | Has this mobile number been validated as belonging to the employee                                                                                                                           |
| super_disclaimer                   | reference | [super_disclaimer](#response_data_super_disclaimer)                                                                                                                                          |

### <a id="response_data_employee_detail"></a> `employee_detail`

The details that were passed in about an employee from a partner to bootstrap the data entry in the system.

| Field                            | Kind     | Description                                                                                           |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| id                               | uuid     | ID                                                                                                    |
| address_line_1                   | ?string  | The first line of the employees address (e.g. Apartment 10)                                           |
| address_line_2                   | ?string  | The second line of the employees address (e.g. 10 The Street)                                         |
| address_line_3                   | ?string  | The third line of the employees address (likely not needed, required for the SuperStream network)     |
| address_line_4                   | ?string  | The fourth line of the employees address (likely not needed, required for the SuperStream network)    |
| date_of_birth                    | ?string  | Must be in the format yyyy/mm/dd                                                                      |
| family_name                      | ?string  | The last name of the user                                                                             |
| gender                           | ?string  | Must be one of `male` `female` or `other`                                                             |
| given_name                       | ?string  | The given name of the employee, used to prefill fields in our forms                                   |
| has_financial_supplement_debt    | ?boolean | Does this employee have a financial supplement debt?                                                  |
| has_study_and_training_repayment | ?boolean | Does this employee have any training or loan repayments (e.g. HELP loan)                              |
| locality                         | ?string  | The suburb that you are located in, e.g. Footscray                                                    |
| middle_name                      | ?string  | The middle name of the employee                                                                       |
| pay_basis                        | ?string  | Must be one of: `full_time`, `part_time`, `casual` or `labour_hire`                                   |
| previous_given_name              | ?string  | The previous given name of the employee                                                               |
| previous_family_name             | ?string  | The previous family name of the employee                                                              |
| residency_type                   | ?string  | Must be one of: `australian_resident_for_tax_purposes`, `foreign_resident` or `working_holiday_maker` |
| postcode                         | ?string  | The postcode of the employee, e.g. 3000 for Melbourne City                                            |
| state                            | ?string  | Which state the employee is located in, one of: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act` or `tas` |
| tax_free_threshold_claimed       | ?string  | Has this employee claimed the tax free threshold for this employer?                                   |
| tfn                              | ?string  | The Tax File Number of the employee                                                                   |
| title                            | ?string  | Must be one of: `mr`, `mrs`, `miss`, `ms`, `dr` or `other`                                            |

### <a id="response_data_super_disclaimer"></a> `super_disclaimer`

Details about the superannuation disclaimer the user has agreed to.

| Field       | Kind     | Description                                           |
| ----------- | -------- | ----------------------------------------------------- |
| id          | uuid     | ID                                                    |
| accepted_at | datetime | The datetime the user accepted the disclaimer notice. |

### <a id="response_data_bank_account_collection"></a> `bank_account_collection`

The bank accounts that the user has added

| Field         | Kind             | Description                                 |
| ------------- | ---------------- | ------------------------------------------- |
| id            | uuid             | ID                                          |
| bank_accounts | array(reference) | [bank_Account](#response_data_bank_account) |

### <a id="response_data_bank_account"></a> `bank_account`

The bank accounts that the user has added

| Field | Kind    | Description                                                           |
| ----- | ------- | --------------------------------------------------------------------- |
| id    | uuid    | ID                                                                    |
| name  | string  | The name the user has given to the bank account                       |
| rank  | integer | The rank the user has order this bank in the set of all bank accounts |

### <a id="response_data_onboarding_session_super_selection"></a> `onboarding_session_super_selection`

The onboarding step related to selecting a super fund.

| Field                     | Kind      | Description                                                                                                                    |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| id                        | uuid      | ID                                                                                                                             |
| progress_state            | string    | The progress state of the user selecting a super fund. Will usually be completed unless a SuperStream MRR request is in flight |
| select_super_fund_product | reference | [select_super_fund_product](#response_data_select_super_fund_product)                                                          |
| self_managed_super_fund   | reference | [self_managed_super_fund](#response_data_self_managed_super_fund)                                                              |
| super_fund_member_detail  | reference | [super_fund_member_detail](#response_data_super_fund_member_detail)                                                            |
| generated                 | reference | [onboarding_session_super_selection_generated](#response_data_generated_onboarding_session_super_selection)                    |

Either a `self_managed_super_fund` or a `select_super_fund_product` will be present in the response, but not both.

### <a id="response_data_generated_onboarding_session_super_selection"></a> `onboarding_session_super_selection_generated`

Generated assets for the onboarding sessions super selection

| Field                            | Kind    | Description                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| super_choice_form_pdf_url        | string  | Contains a reference to the generated super choice form PDF. This should be downloaded and stored in your document storage. Expires 6.5 days after the creation of the onboarding session.                                                                                                                                                                          |
| compliance_letter_url            | ?string | Contains a reference to the compliance letter used to verify the selected super fund. This will be supplied by users in the case of self-managed super funds. This should be downloaded and stored in your document storage. Expires 6.5 days after the creation of the onboarding session. Might be null in the event the user-supplied document is not available. |
| super_choice_form_pdf_merged_url | ?string | Contains a reference to the generated super choice form PDF merged with the supplied compliance letter. This should be downloaded and stored in your document storage. Expires 6.5 days after the creation of the onboarding session. Might be null in the event the PDF merge process fails.                                                                       |

### <a id="response_data_super_fund_member_detail"></a> `super_fund_member_detail`

The details that have been confirmed by the user about their membership to a super fund. These will likely be close to or identical to the [employee_detail](#response_data_employee_detail) however the user has reviewed and possibly amended these details.

| Field          | Kind    | Description                                                                                           |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| id             | uuid    | ID                                                                                                    |
| address_line_1 | string  | The first line of the users address (e.g. Apartment 10)                                               |
| address_line_2 | string  | The second line of the users address (e.g. 10 The Street)                                             |
| address_line_3 | string  | The third line of the users address                                                                   |
| address_line_4 | string  | The fourth line of the users address                                                                  |
| date_of_birth  | string  | Must be in the format yyyy/mm/dd                                                                      |
| family_name    | string  | The last name of the user                                                                             |
| gender         | string  | Must be one of `male`, `female` or `other`                                                            |
| given_name     | string  | The given name of the employee, used to prefill fields in our forms                                   |
| locality       | string  | The suburb that you are located in, e.g. Footscray                                                    |
| other_name     | string  | Any previous name you might have been known by                                                        |
| postcode       | string  | The postcode of the employee, e.g. 3000 for Melbourne City                                            |
| state          | string  | Which state the employee is located in, one of: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act` or `tas` |
| tfn            | string? | The Tax File Number of the employee                                                                   |
| title          | string  | Must be one of: `mr`, `mrs`, `miss`, `ms`, `dr` or `other`                                            |

### <a id="response_data_select_super_fund_product"></a> `select_super_fund_product`

Details about the fund the user has selected

| Field              | Kind      | Description                                                                           |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| id                 | uuid      | ID                                                                                    |
| member_number      | string    | The member number of the user at this fund                                            |
| super_fund_product | reference | [super_fund_product](#response_data_super_fund_product) The product the user selected |

### <a id="response_data_self_managed_super_fund"></a> `self_managed_super_fund`

Details about a self managed super fund

| Field                           | Kind   | Description                                                                                         |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| id                              | uuid   | ID                                                                                                  |
| bank_account_bsb                | string | The BSB of the bank account associated with the self-managed super fund                             |
| bank_account_name               | string | The name of the bank account associated with the self-managed super fund                            |
| bank_account_number             | string | The account number of the bank account associated with the self-managed super fund                  |
| fund_abn                        | string | The self-managed super fund's ABN                                                                   |
| fund_electronic_service_address | string | The self-managed super fund's electronic service address, used to identify the fund for SuperStream |
| fund_name                       | string | The name of the self-managed super fund                                                             |
| member_name                     | string | The full name of the member                                                                         |
| member_number                   | string | The member number of the user at their self-managed super fund                                      |

## Examples

### <a id="example_onboarding_session_webhook"></a> Onboarding session webhook

```json
{
  "data": {
    "id": "751ff54e-d57f-4c6b-a2a0-4a6a30c4ca09",
    "email": "demo1@example.com",
    "employer": {
      "id": "815db9d9-d9e0-4528-968e-4f7413a2b02c",
      "abn": "17088268884",
      "name": "SuperSimpleSuperGroup PTY LTD",
      "state": "vic",
      "locality": "Gisborne",
      "postcode": "3437",
      "remote_id": "1234",
      "contact_email": "payroll@superchoiceform.com.au",
      "address_line_1": "1 The Willows",
      "address_line_2": null,
      "last_activity_at": null,
      "contact_person_name": "Riley James",
      "contact_phone_number": "0480586728",
      "requires_default_fund_selection": false,
      "employer_default_super_fund_product": {
        "id": "809ab350-a0ba-4de6-afa1-e79f358d3c65",
        "employer_number": null,
        "super_fund_product": {
          "id": "7fff9db6-3862-40e3-8be9-a7685fde13c6",
          "abn": "60905115063",
          "name": "Australian Retirement Trust",
          "usi_number": "60905115063003",
          "long_description": "Australian Retirement Trust is a leading superannuation fund in Australia, trusted by over 2.2 million members to manage their retirement savings. With a focus on strong performance and a commitment to providing lower fees and better services, Australian Retirement Trust ensures that its members' financial needs are met. As one of the largest super funds in the country, Australian Retirement Trust offers a range of products and services to help individuals plan for their retirement. Their superannuation accounts provide competitive investment performance and low fees, allowing members to grow their savings effectively. The fund also offers income accounts, including transition-to-retirement and retirement income accounts, to help individuals manage their finances during retirement. Australian Retirement Trust has received numerous awards and recognition for its outstanding performance, including the SuperRatings Platinum Performance rating for 20 consecutive years. The fund is dedicated to helping its members make the most of their superannuation, offering exclusive member rewards, a user-friendly mobile app, and access to professional financial advice. Join Australian Retirement Trust today and secure your financial future with one of Australia's largest and most trusted super funds.",
          "short_description": "Join Australian Retirement Trust, one of the largest super funds, taking care of over $240 billion in retirement savings for over 2.2 million members."
        }
      }
    },
    "expires_at": "2024-06-06T23:56:07Z",
    "phone_number": "+61405472748",
    "email_validated": true,
    "employee_detail": {
      "id": "46427539-7042-4595-aca3-c6fb1d7d1d74",
      "tfn": "220114653",
      "state": "vic",
      "title": "mr",
      "gender": "male",
      "locality": "Gisborne",
      "postcode": "3437",
      "pay_basis": "full_time",
      "given_name": "Riley",
      "family_name": "Cocklin",
      "middle_name": null,
      "date_of_birth": "1987-12-28",
      "address_line_1": "1 The Willows",
      "address_line_2": null,
      "address_line_3": null,
      "address_line_4": null,
      "residency_type": "australian_resident_for_tax_purposes",
      "previous_given_name": null,
      "previous_family_name": null,
      "tax_free_threshold_claimed": true,
      "has_financial_supplement_debt": null,
      "has_study_and_training_repayment": null
    },
    "super_disclaimer": {
      "id": "1a307f1b-0039-45e9-9f12-6eb15ffef833",
      "accepted_at": "2024-05-07T23:57:11Z"
    },
    "data_delivery_state": "deliver_output",
    "phone_number_validated": true,
    "bank_account_collection": {
      "id": "628883e0-9776-4341-a09f-137fa1d5b233",
      "bank_accounts": [
        {
          "id": "4b0b13c3-8f7e-4817-8d7f-417c4b7ce7b3",
          "name": "The Bank Account Name",
          "rank": 1,
          "branch": {
            "bsb": "012003",
            "state": "NSW",
            "branch": "Merged",
            "suburb": "Sydney",
            "address": "Refer to BSB 012-019",
            "mnemonic": "ANZ",
            "postcode": "2000"
          }
        }
      ]
    },
    "onboarding_session_super_selection": {
      "id": "ecce0a35-a8e2-47fe-86ad-138145c8560b",
      "generated": {
        "compliance_letter_url": "http://minio:9000/generated-assets/751ff54e-d57f-4c6b-a2a0-4a6a30c4ca09/compliance-letter.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240508%2Flocal%2Fs3%2Faws4_request&X-Amz-Date=20240508T000214Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=165c7071e88c0979d6fb44abce5dc7a92bdcf05b8e2e973f4144e2248e84defc",
        "super_choice_form_pdf_url": "http://minio:9000/generated-assets/751ff54e-d57f-4c6b-a2a0-4a6a30c4ca09/super-choice-form.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240508%2Flocal%2Fs3%2Faws4_request&X-Amz-Date=20240508T000214Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=d8a26cf5bd1c1b18f647c50dec3b93dea894a96fc33896b819e7b0273b730b9a",
        "super_choice_form_pdf_merged_url": "http://minio:9000/generated-assets/751ff54e-d57f-4c6b-a2a0-4a6a30c4ca09/super-choice-form-merged.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240508%2Flocal%2Fs3%2Faws4_request&X-Amz-Date=20240508T000214Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=c90961b7a6e66d120a4864b170725d0954aa76db5e44fe7c5ed5c8374f54d4c0"
      },
      "progress_state": "completed",
      "self_managed_super_fund": null,
      "super_fund_member_detail": {
        "id": "978c4fb1-c6b6-4b50-a9b4-7540cc2dae4c",
        "tfn": "220114653",
        "state": "vic",
        "title": "mr",
        "gender": "male",
        "locality": "Gisborne",
        "postcode": "3437",
        "given_name": "Riley",
        "family_name": "Cocklin",
        "date_of_birth": "1987-12-28",
        "address_line_1": "1 The Willows",
        "address_line_2": null,
        "address_line_3": null,
        "address_line_4": null,
        "previous_given_name": null,
        "previous_family_name": null
      },
      "select_super_fund_product": {
        "id": "6ce11090-a0b0-4079-8c0e-9360e92880f6",
        "member_number": "12345678901234",
        "super_fund_product": {
          "id": "e9d585b4-cedc-45ff-93a1-753ec1f7bf75",
          "abn": "65714394898",
          "name": "Australian Super",
          "usi_number": "STA0100AU",
          "long_description": "AustralianSuper is Australia's largest superannuation fund, dedicated to helping members achieve their best financial position in retirement. As a member-focused organization, AustralianSuper doesn't pay profits or dividends to shareholders. Instead, all the money they make goes back into the fund, ensuring that members receive the maximum benefit. AustralianSuper offers a range of products and services to support their members throughout their superannuation journey. Their offerings include superannuation accounts, retirement solutions, transition-to-retirement options, and business solutions. They provide tools and calculators to help members make informed financial decisions and offer educational resources such as articles, webinars, and forms to further empower their members. The organization is committed to sustainable investments and environmental, social, and governance considerations. They have a diverse workforce, led by their dedicated Executive Team and Board of Directors, who ensure the effective implementation of their business strategy. Through their efforts, AustralianSuper aims to be the leading superannuation fund in Australia, delivering strong, long-term returns to their members.",
          "short_description": "AustralianSuper is run only to benefit members, offering low fees and strong long-term investment returns."
        }
      }
    }
  },
  "kind": "onboarding_session_completed",
  "version": "v1"
}
```

### <a id="example_onboarding_session_webhook_smsf"></a> Onboarding session webhook containing a self-managed super fund

```json {
  "data": {
    "id": "54a36ad6-9437-49b8-8b9e-e497a3857b1f",
    "email": "sam+embedendtoend@richardson.co.nz",
    "employer": {
      "id": "13d64d65-4291-4b13-bf59-b4df07037284",
      "abn": "11111111138",
      "name": "Demo Company (AU)",
      "requires_default_fund_selection": false,
      "employer_default_super_fund_product": {
        "id": "f93cd690-c527-49dd-a0b2-34f293208fbb",
        "employer_number": "123myNumber",
        "super_fund_product": {
          "id": "25621433-90fa-4e6c-8bdb-774c3d0b82e9",
          "abn": "22599554834",
          "name": "Guildsuper",
          "usi_number": "22599554834401",
          "long_description": "GuildSuper is a brand that focuses on providing superannuation products and services specifically designed for the pharmacy sector, veterinary, and allied health industries. However, what sets GuildSuper apart is its dedication to working for women. They understand the challenges that Australian women face when it comes to saving for retirement, and they aim to help women understand, grow, and protect their super. With a core focus on working for women, GuildSuper is inclusive and for everyone, recognizing that 85% of their members are women. They offer competitive fees and charges, personal assistance, great value insurance, and advice on super accounts at no extra cost. GuildSuper has been recognized as an industry leader in working for women and takes pride in looking after the superannuation savings of over 75,000 members and helping more than 16,000 employers meet their superannuation obligations.",
          "short_description": "At GuildSuper we look after the retirement savings for those who look after others. Our products and services have been designed for caring professions."
        }
      }
    },
    "generated": {
      "super_choice_form_pdf_url": "https://s3.ap-southeast-2.amazonaws.com/superapi-assets/54a36ad6-9437-49b8-8b9e-e497a3857b1f/super-choice-form.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWQF2CJNHP4TBBAKD%2F20240201%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240201T222621Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=d37af14f93353255b6972a6a2fe49206322f48b3c0387cd72ba48cfaf014d4fa"
      "compliance_letter_url": "https://s3.ap-southeast-2.amazonaws.com/superapi-assets/54a36ad6-9437-49b8-8b9e-e497a3857b1h/super-choice-form.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWQF2CJNHP4TBBAKD%2F20240201%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240201T222621Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=d37af14f93353255b6972a6a2fe49206322f48b3c0387cd72ba48cfaf014d4fa"
      "super_choice_form_pdf_merged_url": "https://s3.ap-southeast-2.amazonaws.com/superapi-assets/54a36ad6-9437-49b8-8b9e-e497a3857b1g/super-choice-form.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWQF2CJNHP4TBBAKD%2F20240201%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240201T222621Z&X-Amz-Expires=561600&X-Amz-SignedHeaders=host&X-Amz-Signature=d37af14f93353255b6972a6a2fe49206322f48b3c0387cd72ba48cfaf014d4fa"
    },
    "expires_at": "2024-02-08T22:22:16Z",
    "phone_number": "0405472748",
    "employee_detail": {
      "id": "1a866a87-abb5-4bd8-92c6-331f8244d2c0",
      "tfn": "787800030",
      "state": "vic",
      "title": "mr",
      "gender": "male",
      "locality": "West Footscray",
      "postcode": "3012",
      "given_name": "Testing",
      "other_name": null,
      "family_name": "Embed",
      "date_of_birth": "1980-04-11",
      "address_line_1": "10 Warleigh Road",
      "address_line_2": null,
      "address_line_3": null,
      "address_line_4": null
    },
    "data_delivery_state": "deliver",
    "onboarding_session_super_selection": {
      "id": "8812a824-60e6-4578-a164-826b48056e46",
      "progress_state": "completed",
      "super_fund_member_detail": {
        "id": "dccd5c16-2373-4c32-ae71-e997ce56390d",
        "tfn": null,
        "state": "vic",
        "title": "mr",
        "gender": "male",
        "locality": "West Footscray",
        "postcode": "3012",
        "given_name": "Testing",
        "other_name": null,
        "family_name": "Embed",
        "date_of_birth": "1980-04-11",
        "address_line_1": "10 Warleigh Road",
        "address_line_2": null,
        "address_line_3": null,
        "address_line_4": null
      },
      "select_super_fund_product": null,
      "self_managed_super_fund": {
        id: "f029034f-abd6-4e5a-8b40-ed881984608c",
        bank_account_bsb: "123456",
        bank_account_name: "John Doe",
        bank_account_number: "12345678",
        fund_abn: "12345678901",
        fund_electronic_service_address: "example_esa@example.com",
        fund_name: "John Doe Super Fund",
        member_name: "John Doe",
        member_number: "2"
      }
    }
  },
  "kind": "onboarding_session_completed",
  "version": "v1"
}
```
