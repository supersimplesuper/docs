# SuperAPI in a Box

SuperAPI in a Box is designed for organisations that want the fastest integration path or have security concerns about iFrames. This solution allows your employers and employees to use SuperAPI without embedding iFrames directly into your product.

SuperAPI in a Box works by having SuperAPI handle the hosting of embeds on their servers while maintaining your product's branding and appearance. You create a custom CNAME entry on your domain that points to SuperAPI's servers. When users access these routes, SuperAPI takes over and users interact with the SuperAPI application until they complete onboarding or finish configuring employer details.

## For employees onboarding

The first step is that your system indicates that an employee wants to onboard. This can be from an event like an employer sending an onboarding request invite and the employee clicking the link or the employee selecting a "self-service" update flow, e.g. they want to update their superannuation details. At this point an [onboarding session](/software_partners/how_to_guides/work_with_onboarding_sessions/index.html) has been created and the employee is ready to complete it. Next, direct the employee to the URL that we host (e.g. `onboarding.yourdomain.com.au`) where they will be prompted to log in. This URL can be made to look as if it was part of your website via the use of a CNAME DNS record.

::: info
We support a few additional functions when loading this site, e.g. you can prefill the employee's email address to make it easier for them to log in.
:::

After the employee logs in, any pending onboarding sessions automatically load and prompt them to complete the process. Once finished, the system sends the details back to your system through our standard webhook and API requests.

SuperAPI in a Box includes proven best practices in its onboarding experience, such as onboarding progress indicators, that we've refined over time.

## For employers configuring onboarding

The employer workflow follows the same model as the employee process but handles one-time configuration tasks. Employers use this to configure default super funds or [onboarding templates](/software_partners/explanations/onboarding_templates/index.html). Launch the employer experience through a link or button placed alongside other configuration options for the logged-in employer.

::: info
Much like the employee experience above, we have a number of additional options available here to support the employers, e.g. we can log them automatically.
:::

After directing the employer to the SuperAPI-hosted domain (such as `onboarding.yourdomain.com.au`), they can configure their account settings, including setting a default super fund. All data returns to your system exactly as it would with the embedded iFrame experience.

## Conclusion

SuperAPI in a Box provides a hosted solution for organisations seeking fast integration or those with security concerns about iFrames. This solution eliminates the need for iFrame embedding while preserving your product's look and feel. Both employees and employers are seamlessly directed to SuperAPI-hosted domains via CNAME DNS records, where they complete onboarding or configuration tasks. The solution includes built-in best practices for user experience and returns all data to your system through standard webhooks and API requests, maintaining the same functionality as the embedded iFrame method.