# Working with the employer status

For employees to start onboarding in SuperAPI, the employer record must be configured correctly. This configuration can sometimes be critical (a default fund must be selected) or non critical (stapling enabled). To help you manage this status in your system, we provide fields on the employer object which indicates the current onboarding status of the employer. These fields are:

## The `onboarding_status` field

This field indicates the overall status of the employers readiness for accepting onboarding and can be used as a "general indicator" in your system for the user to take action.

The `onboarding_status` can be in three states, they are:

- `complete` - This indicates that all configuration is in a good state and users onboarding will have the best possible experience.
- `incomplete` - Onboarding can proceed but not all settings are correctly configured for the best user experience. For example, if we're unable to perform stapling requests due to authorisation errors, this will be set to `incomplete`.
- `error` - Critical information is missing and we cannot onboard employees. This state is rare but will occur if a critical setting like the employers default fund has not been selected.

When an `onboarding_status` is not in the `complete` state, you should redirect the user to a page which [loads the employer embed](/software_partners/how_to_guides/create_an_employer/index.html#showing-the-employer-embed) for them. We will detect the current state that the employer is in and provide instructions for them to fix things so that onboardings can resume smoothly.

To visually represent the onboarding status of the employer, we suggest using an error icon (⛔) when in the error state. When the onboarding status is incomplete, we suggest using a warning (⚠️) icon.

## The `onboarding_configuration` field

This field is present as an object on the employer and can be used to present more information in your UI as to exactly what the employer needs to do to bring the `onboarding_status` back up to the `complete` status. The use of these fields are optional, they're returned to you so you can optionally customise the message present to the business owner in your UI. This object is present in the field `onboarding_configuration` on the employer record and contains:

```json
{
  "default_fund_configured": true,
  "stapling_enabled": true,
  "tfnd_enabled": true
}
```

Each field will be set to either true or false depending on the configuration on the employer. We may also expand these the fields returned over time (but will never remove any existing fields). These fields represent:

- `default_fund_configured` - Has a default fund been configured for this employer? This is critical to allowing onboardings.
- `stapling_enabled` - Have stapling requests been enabled for this employer? Stapling requests are used to lookup information from the ATO about the employees fund and can greatly improve the onboarding experience.
- `tfnd_enabled` - Have TFND (tax filed number declarations) requests been enabled for the employer? TFNDs are used in conjunction with the stapling to obtain the employees stapled super fund.

Again, the use of these fields are optional but are present to enable the customisation of an error message about the state of the employers `onboarding_status`.
