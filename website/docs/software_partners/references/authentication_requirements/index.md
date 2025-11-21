# Authentication Standards

To protect sensitive superannuation data and meet ATO security expectations, all software partners must implement the following authentication and session standards. These are non-negotiable and apply to all new software partner integrations.

## Password complexity

Passwords must have a minimum of 80 bits of entropy.

This ensures passwords cannot be reliably guessed, even with high-speed automated attempts. At this level, cracking a password would take over 9 years at 1 trillion guesses per second.

Entropy should be calculated based on randomness, not password length or character types. Use passphrases or password generators to meet this standard. Avoid relying on user-created passwords without entropy checks.

## MFA required

All logins must use a second factor to protect against unauthorised access.

MFA must apply to every user account and be re-prompted when signing in from a new device, network, or browser.

## Shared logins are blocked

Users must have individual logins. Shared credentials aren’t allowed and should be blocked. Each user should be identifiable and auditable.

## Session time-out after inactivity

Sessions must auto-lock after a maximum of 30 minutes idle time. This lockout can be a screen lock—no need for full MFA to resume activity.

## ‘Remember me’ lasts no longer than 24 hours

If your app includes a "remember me" or persistent login feature, it must expire within 24 hours.

## Brute-force protection kicks in after 5 failed attempts

After five unsuccessful login attempts, your system must trigger a lockout event. The exact lockout method is up to you—we just require that it happens.

## Tokens must be short-lived and device-bound

Any temporary login token or credential must:
- Be tied to a single user and device
- Expire immediately after use or within 24 hours (whichever comes first)