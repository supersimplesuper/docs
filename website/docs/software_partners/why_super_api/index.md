---
outline: deep
---

# Why SuperAPI?

## What is superannuation?

Superannuation, or super, is the Australian Government mandated retirement savings scheme which requires all employees in Australia, including most visiting workers, to be paid a percentage of their income in the form of a superannuation contribution. This superannuation contribution is paid by the employer, to the super fund nominated by the employee. The process for an employee to nominate their super fund is referred to as a super choice.

::: warning
Significant penalties, including criminal conviction, can apply to employers who fail to meet their obligations under the Australian Superannuation Act.
:::

## SuperAPI features

SuperAPI provides an embedded web service for building employee onboarding experiences in the Australian market. By integrating SuperAPI, you ensure compliance with both current and future regulatory requirements, in accordance with Australian Employment Law and the Superannuation Act.

### Reduce development effort

Integrating superannuation, tax, and employee onboarding for the Australian market requires connecting to the [ATO](https://www.ato.gov.au/), super funds and their administrators, trustees, clearing houses, and registries, as well as the Superstream network. SuperAPI handles all of this behind a single API, so you don’t have to build and maintain these integrations yourself. We support all [APRA](https://www.apra.gov.au/)-approved super funds, [self managed super funds](https://www.ato.gov.au/Super/Self-managed-super-funds/), and handle stapling lookups and default fund registration on your behalf.

### Full employee onboarding

SuperAPI goes beyond super choice. Collect tax declarations, bank accounts, identity details, emergency contacts, documents, policy acknowledgements, and more through a single embedded experience. See our [available modules](/software_partners/modules/index.html).

### Ongoing compliance

Australian superannuation regulation changes regularly. APRA updates its [heatmap](https://www.apra.gov.au/superannuation-heatmaps) of approved funds annually, which can restrict certain funds from accepting new members or re-approve previously restricted funds. Contribution rates change, and new requirements like payday super are introduced. SuperAPI keeps up with these changes so your product stays compliant without development effort on your side.

### Improved data accuracy

Capturing employee details digitally at the point of onboarding reduces manual handling and data entry errors for HR and payroll teams. Details like TFNs, fund membership, bank accounts, and self managed super fund details are validated before they reach your system.

### White-labelled experience

The SuperAPI embed carries none of our branding. It’s designed to look and feel like part of your product, not a third-party tool. Customise it with your own colours and styles, or use our CSS variables for a quick brand match.

### Auditable compliance record

SuperAPI provides a system of record for super choice, tax declarations, and other onboarding actions, giving employers and partners the documentation they need to demonstrate compliance.

## Integration without the build

SuperAPI is delivered as an embedded experience via iFrame. The embed is responsive, framework agnostic, and works on mobile, tablet, and desktop devices. We provide a [JavaScript library](https://github.com/supersimplesuper/super-api-embed) that handles the embedding process and listens for events that your application can react to.

The embed is fully [themable](/software_partners/how_to_guides/customise_the_look_and_feel/index.html) to match your brand. For a detailed walkthrough of how the embed fits into your product, see [Designing Your SuperAPI Integration](/software_partners/integrate_super_api/index.html).

### Why an embed?

Rather than providing a purely API-driven approach where partners build their own UI, SuperAPI uses an embedded experience. There are several reasons for this:

- **Compliance by default** - SuperAPI controls the UI, which means we can guarantee the correct forms, disclaimers, and regulatory requirements are presented to the employee. Partners don't need to worry about whether they're meeting the latest obligations.
- **Reduced development effort** - Partners don't need to build and maintain their own super choice, tax declaration, or onboarding UIs. The embed handles all of this out of the box.
- **Automatic regulatory updates** - When superannuation regulation changes, we update the embed. Partners receive these changes automatically without needing to make code changes on their side.
- **New features without additional effort** - As we add new modules and capabilities to SuperAPI, they are automatically available to partners through the embed. There is no additional integration work required.
- **Continuous improvement** - Improvements to existing features, such as better fund search, improved validation, or streamlined user flows, are rolled out to all partners automatically.

## Security

SuperAPI handles PII and financial details, and we take the security of that data seriously. We are ISO 27001:2022 certified and conduct annual penetration testing. All data resides within Australian borders, encrypted at rest and in transit.

For more detail on our security controls, see our [security FAQ](/security/faq/index.html).

## Who uses SuperAPI?

SuperAPI is trusted by leading HR, payroll, and workforce management platforms.

<div class="partners-grid">
  <a class="partner-card" href="https://www.deputy.com" target="_blank">Deputy</a>
  <a class="partner-card" href="https://www.tanda.co" target="_blank">Tanda</a>
  <a class="partner-card" href="https://www.humanforce.com" target="_blank">HumanForce</a>
  <a class="partner-card" href="https://www.intellihr.com" target="_blank">intelliHR</a>
  <a class="partner-card" href="https://www.payroo.com.au" target="_blank">Payroo</a>
  <a class="partner-card" href="https://www.pronto.net" target="_blank">Pronto</a>
  <a class="partner-card" href="https://www.canyou.com.au" target="_blank">CanYou</a>
  <a class="partner-card" href="https://www.xonboard.com.au" target="_blank">Xonboard</a>
</div>

## Next steps

- Follow the [getting started guide](/software_partners/getting_started/index.html) to go from API keys to a working onboarding session
- Read [Designing Your SuperAPI Integration](/software_partners/integrate_super_api/index.html) to understand how SuperAPI fits into your product architecturally
- Browse the [available modules](/software_partners/modules/index.html) to see what you can include in onboarding
- Explore the [API reference](https://api.superapi.com.au/swaggerui) for all available endpoints

<!--@include: @/parts/getting_help.md-->
