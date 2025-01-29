---
outline: deep
---

# Retain documentation

Retain is the high level term used for functionality within SuperAPI that assists super funds to retain & engage their existing members. The key integration to enable Retain features is the capability to lookup existing members at super fund.

## Implementation methods

There are multiple methods of implementing the Retain member lookup service. They differ in the technical requirements for implementation, and who is required to perform the implementation (SuperAPI vs Superfund).

### A) Member lookup API

Super fund provides an API that enables member lookup.

### B) Hashed lookup (local) (low touch)

This integration method requires a super fund to provide a hashed copy of the member details database, but does not require any futher technical integration.

## Member lookup data payloads

Regardless of the method of implementation, the following data we can utilise to lookup a members details:

- email
- phone_number
- date_of_birth

- first_name
- middle_name
- family_name
- other_name (previous family name)

- address (residential)
- postcode

> Due to the sensitive nature of a Tax File Number (TFN) is it not recommended to use this data in any member lookup functionality. If your systems requires TFN for the purposing of verifying a member, or looking up their details, please get in [contact to discuss your requirements](mailto:developers@superapi.com.au).

## Member lookup process overview

A high level overview of the member lookup process within the overall SuperAPI worflow.

```mermaid
sequenceDiagram
    participant P as 3rd Party Software
    participant S as SuperAPI
    participant F as Super Fund

    P-->>S: Creates a new onboarding session for an employee
    P->>S: Directs employee to complete onboarding
    S->>S: Employee confirms details / adds additional details
    S->>S: Employee agrees to disclaimers & terms related to member lookup service
    S-->>F: Send employee details to member lookup service
    F-->>S: Respond with member details (or not found)
    S->>S: Present existing super fund membership(s) to employee
    S->>S: Employee nominates a super fund for their super choice
    S->>P: Return employee upon completion of super choice
    S-->>P: Webhook with employee's super choice details (confirmed)
```

## A) Member lookup API technical specs

Documentation for building an API integration to meet SuperAPI's requirements for the member lookup feature.

### Endpoint

Super fund receives a POST request from SuperAPI which contains the member details to look up.

`POST /member_lookup`

### Request

```json
{
  "request_id": "09c58fab-d162-4dfc-acb5-e87c5c58e91c",
  "member_lookup": {
    "email": "test@test.com",
    "phone_number": 0413001300,
    "date_of_birth": "1990-04-23",
    "first_name": "Riley",
    "middle_name": "John",
    "family_name": "James",
    "other_name": "Lennon",
    "address": {
      "address_line_1": "100 Station Street",
      "address_line_2": "",
      "address_line_3": "",
      "address_line_4": "",
      "locality": "North Fitzroy",
      "postcode": "3064",
      "state": "VIC"
    }
  }
}
```

### Response

#### Success

Member number & account number are the most critical details to be returned for a successful member lookup. Providing additional details is optional. Considerations should be made regarding 'does our fund receive and process an update of the members details after lookup' and 'what details does the member need to provide to payroll in order to successfully process their super contributions'.

```json
{
	"request_id": "09c58fab-d162-4dfc-acb5-e87c5c58e91c",
	"member_found": true,
	"member_details": {
		"member_number": "123123123",
		"account_number": "123123123",
		...
	}
}
```

#### Failure

```json
{
  "request_id": "09c58fab-d162-4dfc-acb5-e87c5c58e91c",
  "member_found": false
}
```

#### Failure (detailed)

If you have the capability to provide more insight into why a member was not found, you can provide those details in the following format. The `member_lookup` object in the response is the same object that was sent in the request. Each field is replaced with a true/false response based on whether the field was matched in the member lookup.

This enables us to prompt the user to provide alternative addresses, contact details or names. Or we can submit these in alternative formats to attempt a match.

```json
{
  "request_id": "09c58fab-d162-4dfc-acb5-e87c5c58e91c",
  "member_found": false,
  "member_lookup": {
    "email": true,
    "phone_number": false,
    "date_of_birth": true,
    "first_name": false,
    "middle_name": false,
    "family_name": false,
    "other_name": false,
    "address": {
      "address_line_1": false,
      "address_line_2": false,
      "address_line_3": false,
      "address_line_4": false,
      "locality": false,
      "postcode": false,
      "state": false
    }
  }
}
```

## B) Hashed Lookup (local) Technical Specs

Super fund generates a SHA-256 hashed member lookup table, which we utilise (locally) to determine fund membership.

| email | phone | member_number |
| 909378d4be0d759c88e456e35d14351961646d11f9f0192e61b41427fc1d4e45 | 38f30c489a1c294cf7d8193847979ae6c5c45f78ee5cecf8288827310bb866de | ADF382718 |
| f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a | a891c6a1a72cb34418124a70cc929f924ea3d8474b6e2929b21952a8cb6914a4 | AAA867483 |
