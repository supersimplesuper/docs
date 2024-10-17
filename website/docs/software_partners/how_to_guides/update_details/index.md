# Update details

Using SuperAPI to update an employees details is very similar to the regular onboarding flow. The main difference being the presence of the employees existing details in the `employer_detail` object when you create an onboarding session. For an example, let's use the `phone_and_super` workflow along with an employees existing superfund details to get them to check their super details.

Here is an example onboarding created with a previous fund:

```bash
curl -X POST https://api.superapi.com.au/api/v1/onboarding-session \
  -H "Content-Type: application/json" \
  -H "x-api-key: superapi_yourapikeysDZFUnrDIyNp7YTAPDcJXge" \
  -d '{
    "employee_detail": {
      "data": {
        "super_details": {
          "super_funds": [
            "fund_abn": "53226460365",
            "fund_name": "Aware Super",
            "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
            "member_number": "1234abc",
            "usi": "53226460365001"
          ]
        }
      }
    },
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
    "workflow_slug": "phone_and_super"
  }'
```

Passing in the employees previous fund will have two main effects on the onboarding session for them. One, the fund will be shown to them in the "retain" section of our embed allowing them to easily select the fund that they are already with. Second, if the user abandons the onboarding session then we will use the provided fund as the "stapled" fund for that user and return it to you after the timeout of the session.

## Additional notes

- We do not support SMSF funds being supplied yet. If you would like to support this then please get in touch with us.
- We only support passing in one existing fund. If you have employees with more than one then please get in touch with us.
