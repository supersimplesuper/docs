# Understanding member verification

When you're sending super contributions on behalf of an employee, you need to know whether the receiving fund will be able to match them to one of their members. If it can't, the contribution will fail and need to be remediated. To help you avoid that, SuperAPI exposes a `member_verification` object that describes how confident we are that the employee is genuinely a member of the fund, and therefore whether the contribution should be accepted.

The strongest source of confidence is the Member Verification Request (MVR), a SuperStream message that asks the fund to confirm the employee is one of their members. We send an MVR for the employee's nominated fund regardless of how that fund was determined; i.e., whether it came from ATO stapling, a fund API, partner-provided data, or the employee selecting it themselves. When the MVR comes back successful, you can treat that membership as safe to pay into. Where an MVR response isn't yet available, we fall back to weaker signals so you always have a value to work with.

## Where the field appears

The `member_verification` object is returned in two places:

1. On the [employee endpoint](https://swagger.superapi.com.au/#tag/employee/operation/SuperApiWeb.Api.V1.EmployeeController.show), once per fund the employee is a member of, at `super_fund_details.super_fund_memberships[].member_verification`.
2. On the [onboarding session endpoint](https://swagger.superapi.com.au/#tag/onboarding_session), at `onboarding_session_super_selection.member_verification`. This reads through to the membership for the fund the employee nominated during that session.

In both cases the shape is the same:

```json
{
  "member_verification": {
    "confidence": "verified",
    "mvr_received_at": "2026-04-10T12:00:00Z"
  }
}
```

The `confidence` field is one of `verified`, `rejected`, `high`, `medium`, or `low`; each is described in the next section. The `mvr_received_at` field is the timestamp of when an MVR response was received from the fund, and will be `null` when no response has been received yet.

## Confidence levels

The `confidence` value reflects the strongest verification signal we hold for the membership. The table below describes each level, where the signal comes from, and how partners typically use it when deciding whether to pay a contribution.

| Confidence | Source | Typical handling |
| --- | --- | --- |
| `verified` | A successful MVR response from the fund. | Safe to pay. The fund has explicitly confirmed the employee is one of their members. |
| `rejected` | An MVR response from the fund saying the membership does not exist. | Do not pay against this membership; a contribution will be returned. Reach out to the employee to collect correct details, or fall back to the employer's default fund. |
| `high` | A direct fund API integration, an MRR (Member Registration Response), or a fund member lookup. | Safe to pay. The value will normally progress to `verified` once the MVR response is received. |
| `medium` | The ATO stapling API, or a previous SuperAPI super selection carried forward. | Generally safe to pay. An MVR is sent even for stapled funds, so this should progress to `verified` (or `rejected`) once the response is received. |
| `low` | Default. Partner-provided, employee-provided, or no stronger signal exists. | Pay with caution. You may want to ask the employee to re-confirm their fund before sending a contribution. |

The handling column above is a guide rather than a rule; you should set your own thresholds based on your product, your employer base, and your appetite for the operational cost of failed contributions.

## When the value updates

The `confidence` value is derived and can change over time as stronger signals arrive for a membership. A common transition is from `medium` (discovered via stapling at the end of an onboarding session) to `verified` once the asynchronous MVR response is returned by the fund.

::: info
The exact mechanism for being notified of a `confidence` change, e.g., a webhook on the employee, or whether the MVR result blocks onboarding completion, is still being finalised. In the meantime, you can re-fetch the employee or onboarding session at the point you are about to send a contribution to read the latest value. We will update this guide once the notification mechanism is locked in.
:::

<!--@include: @/parts/getting_help.md-->
