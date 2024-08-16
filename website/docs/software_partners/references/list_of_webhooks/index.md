# List of webhooks

This document contains information around the list of webhooks that are emitted from SuperAPI. You can use this reference to find out:

1. When and why a webhook is emitted
2. The contents of that webhook.

We will also go into some detail around some hypothetical actions you might want to take in the system upon receiving a particular webhook.

## Understanding SuperAPI webhooks

### The subject

Webhooks are always based on a subject entity in our system. Currently these subject entities are one of either an `employer` or `onboarding_session` but we may extend this to more entities depending on the nature of the webhook. For example, if we were to emit a webhook that was related to an event occurring with a product in our system then the subject of that webhook would be a `product`. You can also think of the webhook subject being a kind of namespace for the webhook.

::: warning
We may introduce additional webhook namespaces for `employee` and `products` in the future.
:::

### The event

Webhooks are sent based on events occurring in our system and this information is also passed to the consumer of the webhook. Events include things like an employer changing their settings or an onboarding session being completed.

### The payload

Webhooks contain a minimal payload designed to give you enough information to be able to make a request to our API to fetch further information. All webhooks follow a similar structure, an example being:

```json
{
  "subject": "employer",
  "event": "employer_settings_changed",
  "id": "c2bc0c04-6b98-4333-91a6-919f5ebc9000",
  "remote_id": "1234",
  "url": "https://api.superapi.com.au/api/v1/employers/c2bc0c04-6b98-4333-91a6-919f5ebc9000"
}
```

| field     | kind   | description                                                          |
| --------- | ------ | -------------------------------------------------------------------- |
| subject   | string | The entity that the webhook belongs to                               |
| event     | string | The event in our system that triggered the webhook                   |
| id        | string | The primary key of the entity that triggered the webhook             |
| remote_id | string | The remote_id of this entity in your system                          |
| url       | string | The URL you should call to fetch the entity that triggered the event |

## Webhooks list

| Namespace          | Name                         | Fired when                                                                                                                                   | Response actions                                                                                                                                                                                     |
| ------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| employer           | employer_settings_changed    | An employer has changed settings that are relevant to our partner, e.g. they have picked a default fund or their stapling status has changed | You should fetch the employer object from SuperAPI and check if it is now correctly configured to allow onboarding sessions to be created.                                                           |
| onboarding_session | onboarding_session_completed | An employee has completed an onboarding session                                                                                              | This is fired only when all required details have been collected from the user (e.g. for superannuation selection, a fund USI, ABN, member number and generated PDFs will be present in the payload) |
