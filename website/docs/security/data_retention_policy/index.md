# SuperApi Data Retention

## Changelog

| Version    | Changes                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 11/06/2024 | Adjusted date back to 30 days due to the need to handle the delay on MRR registrations over the SuperSend network                       |
| 21/02/2024 | Updated with details about the legal entity we comply with in Australia. Adjusted dates we hold data for (down from 30 days to 7 days). |
| 21/01/2024 | Initial version                                                                                                                         |

## Document Terminology

Specific terminology is used throughout this document. The following table gives you a reference to its meaning and anywhere this terminology is used will be marked _like this_.

| Term             | Description                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| SSSG             | The Super Simple Super Group, the owner of the software product that this policy details.                                               |
| SuperAPI         | Our embeddable super selection product.                                                                                                 |
| Software Partner | A 3rd party software partner that “embeds” our product into their software.                                                             |
| Superfund        | A superfund that has partnered with us to have their product displayed in the SuperAPI product.                                         |
| User             | Either an employee in the system making a super selection or an employer that can configure the SuperAPI system to suit their business. |

## Our Data Retention Posture

Before diving into the details of our data retention policy, it’s worthwhile understanding how SSSG treats the concept of personal data in its systems. Our standard posture is that we don’t want personal data in our system but recognize that it is required for many of our software products to function correctly or that we have legal requirements around holding. As such, we try to divest ourselves of personal data as soon as possible and collect as little of it as possible. This posture towards personal data reflects the concepts know as "Data Minimization Principles".

## Data Classification

Broadly, we classify data in the SuperAPI into two categories, they are:

- **Sensitive Data**: This is any kind of data that can be used to identify a user of the system. E.g., A user's name and address.
- **Non-Sensitive Data**: Any data that is not in the category of sensitive data. E.g., details about a superfund's name and description of their products.

## Data Retention Periods

Data retention periods are applied depending on the classification of the data in the system, they are:

### Sensitive Data

Sensitive data is retained for the minimal period of time possible for the system to function correctly and to be legally compliant to the standards set out by the Office of the Australian Information Commissioner (OAIC). To be specific:

- Data from a user making a super selection is retained for a maximum of 30 days before it is expired.
- The main driver to hold the data for 30 days is the need to issue MRR requests over the SuperStream network and to wait for a reply.
- When data is removed from the selection session object, we anonymize the data. It undergoes the following transformation:

  | Field          | Action                             |
  | -------------- | ---------------------------------- |
  | address_line_1 | Removed                            |
  | address_line_2 | Removed                            |
  | address_line_3 | Removed                            |
  | address_line_4 | Removed                            |
  | date_of_birth  | Date removed, year of birth stored |
  | family_name    | Removed                            |
  | gender         | Kept                               |
  | given_name     | Removed                            |
  | locality       | Kept                               |
  | other_name     | Removed                            |
  | postcode       | Kept                               |
  | state          | Kept                               |
  | tfn            | Removed                            |
  | title          | Kept                               |
  | email          | Sha256 hashed                      |
  | phone          | Sha256 hashed                      |

- We queue a payload of data that is sent to the partner which contains PII information. This data is retained for 30 days for debugging / auditing / service outage recovery (i.e., the partner system cannot accept the data at this time).
- We generate a PDF version of the super choice selection form. This is retained in our S3 bucket for 7 days (this is intentionally shorter than the usual timeout) before it undergoes automatic removal. A secure link is sent as part of the payload to the partner which allows them to download this document. It is also presented to the user at the end of the flow for them to download if they require a hard copy of it.

### Summary

The maximum length of time that sensitive data is held in the system is 30 days and this is mostly driven by the length of time we allow for our partner to receive the data or perform debugging against it. It is also possible to reduce this length of time for a partner if required, i.e., if 3 days was considered a sufficient amount of time to handle outages and debugging, we can reduce the time sensitive data is available in the system.

## Data Storage, Protection, Access and Logging

PII data in the SuperAPI product is held within Australian borders in the AWS “RDS” product. This product provides standard data protection controls like encryption in transit and at rest. Access to data is controlled using AWS’ “IAM” policy controls and is restricted to senior members of the SSSG organization only.

Some non-PII data is sent overseas in the form of our error logging and exception management software (Sentry). We have a policy in place that any data sent to this destination must be de-identified before being sent. This policy also applies to the way data is logged (using the AWS “Cloudwatch” product) despite the data remaining within Australian borders.

Please also see the Security FAQ document for answers to common questions about SSSGs security posture.

## Data Deletion Process

Data deletion is managed by the RDS database product, that is, a standard SQL query is used to delete the record from the database. It is possible to recover this data from backups however we store backups for a total of 30 days only.
