# Understanding how SuperAPI stores and uses data

When integrating SuperAPI, your compliance team or an employer using your product will often want to know whether we actually hold employee data (including TFNs), or whether we act purely as a pass-through between your system and the ATO. The short answer is that we do hold data. SuperAPI stores what it needs to onboard an employee, lodge TFN declarations, request stapled super funds from the ATO, and send contributions through the SuperStream network. This page describes what we store, where we store it, who we share it with, and how data can be removed.

::: info
This is an operational overview written for partner compliance reviews and for employer-facing questions. For the formal statement, see our [privacy policy](/privacy_policy.html). For detail on our security posture (e.g. encryption, backups, third parties) see the [security FAQ](/security/faq/index.html).
:::

## What we store

We store personal information about employers and their employees so that we can complete the onboarding workflows our partners use us for. At a categorical level:

| Category | Examples |
| --- | --- |
| Identity information | Given names, family name, previous names, date of birth, gender, title |
| Tax information | Tax file number (TFN), residency type, employment type, tax scale, work condition, study and training support loan flags |
| Contact information | Email address, phone number, residential address, emergency contact |
| Employment information | Remote ID supplied by the partner, employer association, employment and pay type |
| Super fund information | Nominated fund, membership details, member number, USI and fund ABN |
| Bank account details | BSB and account number for the employee's nominated pay account |
| Uploaded documents | Identity documents (e.g. passport, driver's licence, Medicare card) where an employer requires them for onboarding, and any other files captured by a custom onboarding template |
| Onboarding session state | A record of each onboarding session, which modules were shown, and the choices the employee made |

Most of this data is only collected when the relevant onboarding module is used. For example, bank account details are only stored when the bank account module is included in the onboarding session, and identity documents are only stored where an employer's onboarding template requires an upload.

## Where data is stored

All personally identifiable data is hosted on AWS infrastructure located in Australia; PII does not leave Australian shores. The database and its backups are encrypted at rest with AES-256, and all connections are over TLS. For more detail, see the [security FAQ](/security/faq/index.html#data-management).

Some non-PII operational data (e.g. scrubbed application logs and exception traces) may pass through services whose infrastructure sits outside Australia. These services do not receive PII.

SuperAPI does not use any stored personal information to train or fine-tune machine learning or AI models, whether internally or via a third-party provider.

## Who data is shared with

Stored data is only shared outside of SuperAPI where it is required to deliver the service:

| Destination | What is sent | Purpose |
| --- | --- | --- |
| Australian Taxation Office | TFN declarations, stapled super fund requests | Statutory lodgement and stapling lookups |
| Super funds (via SuperStream) | Member registration requests (MRRs) and member verification requests (MVRs) | Joining an employee to a fund, and confirming membership before a contribution is sent |
| Partner (your system) | Fields returned via the REST API and in webhook payloads | Returning the onboarding result into your product |

We do not share personal information with third parties outside of this list, and we do not sell data.

## How long data is retained

Employee and onboarding records are retained indefinitely while a partner's relationship with SuperAPI is active. We do not automatically delete old data, so you can continue to resolve historic contributions, re-fetch records, or reconcile payroll against earlier onboarding sessions.

Data is deleted when you ask us to delete it. There are two paths:

- Partners can delete specific records (e.g. an employer or an onboarding session) through our REST API. See the [Swagger reference](https://api.superapi.com.au/swaggerui) for the available delete endpoints.
- If an employee or employer contacts SuperAPI directly with a deletion request, we will work with the relevant partner to fulfil it, so that the record is removed from both systems consistently.

## Further reading

- [Privacy policy](/privacy_policy.html)
- [Security FAQ](/security/faq/index.html)
- [Report a data breach](/software_partners/how_to_guides/report_a_data_breach/index.html)

<!--@include: @/parts/getting_help.md-->
