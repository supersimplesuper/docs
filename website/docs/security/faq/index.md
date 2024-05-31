# Security FAQ

The following document answers many of our frequently asked questions regarding our security posture.

## Assurance

### Are you currently certified against any IT Security standards?

We are not currently certified against ISO standards, however we are currently in the process of obtaining our ISO27001 certification.

## Change and release

### Are changes tested prior to being applied to the production environment?

Yes. Prior to being released to production all code is tested in two ways. First, we have an extensive suite of automated tests that run on all changes to our code. Only once these tests have passed is it possible to merge the code changes to our codebase. Second, we have a dedicated staging environment where changes are sanity checked before going live. Only once both these processes have been completed is code released.

### Are all changes risk assessed to determine the impact to confidentiality, integrity, and availability?

Yes. All changes to our code go through a peer review process where at least one other developer evaluates the change before it is added to the codebase. Additionally, prior to writing any code, the overall concept, architecture and consequences of changes are discussed by the team.

### Are all changes reviewed to ensure that any impacts to security are understood and managed accordingly?

Yes. This occurs as part of the testing / code review before code is released to production.

### Are confidentiality, availability and integrity risks assessed as part of the change management processes?

Yes. This occurs as part of the testing / code review before code is released to production.

## Data management

### What countries host your data?

All personally identifiable data is hosted within Australia. Some non PII data, e.g. scrubbed logs, exception traces, analytics may be hosted outside of Australian borders.

### What third parties will have access to data?

As mentioned previously, no PII data is available to third parties. Non PII data is accessed by the following companies:

- Sentry (https://sentry.io) - Used to track exceptions (errors) that occur in our applications.
- Plausible (https://plausible.io/) - Used for user analytics.

### Do you use production data in development or staging environments?

We have the ability to load de-identified production data into our staging and development environments. This data is de-identified by replacing all identifiable fields (email, name, phone numbers etc) with randomly generated data.

### Can you provide a published procedure for transitioning out of the service arrangement, including assurance to sanitise all data?

Yes. If required we can provide a document that outlines all the steps that we take to remove or de-identify data.

### Are integrity controls present to prevent manual or systematic processing errors or corruption of data?

We have created a database design which is resistant to errors occurring over time. Additionally, we have extensive logging of changes which allows us to reconstruct historic data if required. Finally, our database undergoes regular snapshot backups.

### Are back-ups of data taken on a regular basis?

Our database is managed by AWS (the RDS product) and as such, we have access to all of the database backup functionality that is provided by using that service. This manifests as a daily backup snapshot which is taken every morning at about 8am. These backups are retained for the previous 30 days. All backups are encrypted and our standard AWS IAM access controls are applied to restrict access.

### Is data always encrypted in transit?

Yes. We enforce https connections to our apps only (http connections will automatically be redirected to https). More detailed information about the supported TLS versions and ciphers we support can be found at https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html

We use the `ELBSecurityPolicy-2016-08` predefined security policy.

### Is data encrypted at rest?

Yes. The running database and any snapshots are encrypted using AES-256.

### Is data classified and treated in a fashion appropriate given its sensitivity and confidentiality?

Yes. We have internal policy documents which define how data is to be treated. These policy documents influence other security practices. E.g. the use of production data in our development / staging environments is governed by a data use policy which enforces that the data be de-identified before use.

### Do you comply with Australian legal requirements for information privacy?

Yes. All information privacy is at least to the Australian legal standards. Furthermore, we have also adopted GDPR standards around data privacy as we predict Australia to introduce a framework similar to what is currently used in the European Union.

## Infrastructure

### What third parties provide hosting, infrastructure, or management services?

All hosting and infrastructure is provided by AWS. Management of the infrastructure is performed using Terraform via their Terraform Cloud product.

### What protections do you have around access to your infrastructure?

Our AWS environment has been configured using the product "Control Tower Landing Zone". This has provided an "out of the box", industry standard setup for our cloud hosting which has partitioned our staging / production environments from each other along with configuring separate accounts for auditing and billing. We use IAM identities to configure access to these various sub accounts. All accounts enforce the use of 2FA.

### What monitoring do you have around access to your infrastructure?

We employ AWS Guard duty to automatically monitor and alert us if any unauthorised access to our cloud environment is detected.

### What best practices do you have in place for architecting your infrastructure?

Our AWS infrastructure uses the best practices outlined by AWS, this is achieved by use of the [AWS Control Tower](https://aws.amazon.com/controltower/) software which is design to automatically setup a multi-account best practices environment with default security controls in place.

## Service availability

### What level of service availability do you provide?

We provide 99.5% uptime

### What do you consider acceptable outage and recovery timeframes?

Outages of 4 hours are considered acceptable. However, these are rare and would only be present when making large changes to the site or infrastructure that it sits on.

### Do you have a disaster recovery plan?

Yes. We have dedicated disaster recovery run plans that can be executed in the event that one of our systems needs to be rolled back. These are tested yearly against our staging environment.

## Security governance

### What processes do you have in place for third parties that wish to access or handle data?

Our policy stipulates that vetted third parties have unrestricted access to de-identified data. For identifiable data, only a list of pre approved providers may have (potential) access to the data. Modifying the PII data access approval list requires sign off from one of the founders of the company.

### Can you provide access to your IT security and data risk policies?

Yes. If required, these can be supplied.

### Does the organisation have dedicated Information Security roles defined?

Yes. We currently have a CSO (chief security officer) role defined.

## Risk management

### Have there been any reportable breaches under Australian law in the last 12 months?

No. We have had no breaches, reportable or otherwise, in the previous 12 months

## Security control

### At a high level, what is your security approach?

Our IT security approach is a combination of industry best practices combined with certification. This covers us both for the controls mentioned in the standards but also will extend them with best practices as defined by the industry. A good example of this is code signing which is not explicitly mentioned in the ISO27001 controls but is now widely understood as a mechanism to prevent a hostile actor from adding additional code. Finally, our approach to PII data is to minimise the amount that we collect and handle only to what is required for our business to operate.

### How do you handle identity access and authorisation controls?

We use the AWS standard services (in particular, IAM) to handle infrastructure access to our apps. The privileges these accounts need for access are handled by creating roles, attach policies to those roles then finally attaching the roles to IAM identities.

### Is multi-factor authentication required for all remote user access?

Yes. This extends to all of the services that we interface with as well (AWS, Sentry etc. See the question "What third parties will have access to data?" for a full list)

### What are your timeframes for notification around a data breach?

If a data breach is suspected then a full investigation will be launched. Notification to third parties that a breach has occurred will be performed once we have confirmed the exact nature and extent of the breach. Disclosure timeframes would vary depending on the breach itself however we would expect notification to take no longer than 24 hours after detection.

### Do you have an incident response plan in place?

Yes. Broadly, our incident response plan covers:

- Detection and Identification
- Containment and mitigation
- Investigation and analysis
- Communication and notification
- Recovery and prevention

A copy of this plan can be provided if required. Testing of this plan occurs yearly.

### Do you have a capability to rapidly patch vulnerabilities across all computing devices, applications, and systems, including those used by third parties?

Yes. This is achieved via the MDM management of our devices. In our cloud hosting environment, patching of the software that runs our application occurs automatically. Likewise, we constantly scan our codebase for use of vulnerable libraries and raise pull requests to patch the out of date library. This scanning and patching is provided by our code hosting provider GitHub via their Dependabot product.

### Do you have a Data Leakage Protection solution deployed that is able to detect data being removed from your organisation?

Yes. This is monitored by the use of the AWS product "GuardDuty". Also see the question "What monitoring do you have around access to your infrastructure?"

### Are all identified security, contractual and legal requirements for customer access contractually addressed and remediated prior to granting customers access to data, assets, and information systems?

Yes. The documents surrounding this process can be made available if required.

### Have you experienced any security incidents that have resulted in a breach of customer data?

No

## Effectiveness

### Do you engage third parties to perform penetration tests, vulnerability assessments, or similar? If so, please describe the frequency of the audits.

Yes. Security audits are conducted annually. We use auditors that are well regarded in the industry and cover items like:

- Access controls
- Data protection
- Incident response and monitoring
- Our compliance with industry standards and best practices.
- How are the results of security auditing reported?
- Security audit results and completed remediation steps are reported by our periodic newsletter. Detailed results are available on request.

### Can we engage our own auditor to test the effectiveness of your security controls?

Yes. Please reach out to us to organise this.

## Human resources

### Are all employment candidates, contractors, and third parties subject to background verification?

Yes. We mandate police checks against all employees.

### Are security responsibilities included in all employee's contracts?

Yes. Security responsibilities and requirements are clearly defined to all employees. Employees undergo regular security training and awareness programs.

### Are third parties who have access to systems uniquely identified?

Yes. All third party systems are uniquely identified via API keys or other similar authentication systems.

### Are all third-party access connections logged and monitored for anomalies?

Yes. However, we currently don't have any third party connections with access _into_ the system as all data is currently sent out of the system via push. Where possible, we follow this pattern to maintain the maximum control over the flow of data. Where this is not possible, we establish detailed logging and monitoring around the integration.

### Are all third-party connections reviewed by the security team to ensure that the required security controls are in place and functioning as required?

Yes. All third parties are reviewed before use and monitored over time for any possible reported vulnerabilities or data breaches.

### Is third party access subject to a risk assessment based on the data classification / level of access that is provided?

Yes. Granting access to third party systems is not taken lightly. As such, an assessment is taken which asks questions about why we need to use the third party vs. building internally, the kinds of data that would be given to the third party and the nature of the data that will be given to that third party.

## Privacy

### Is your Privacy Policy aligned with the Australian Privacy Principles?

Yes. As mentioned earlier, as well as aligning with the Australian Privacy Principles, we also align with the requirements of the GDPR where possible.

### Do you have a data breach response plan?

Yes. This can be made available if required.
