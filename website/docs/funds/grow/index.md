---
outline: deep
---

# Grow documentation

Grow is the high level term for functionality within SuperAPI that facilitates the automation of new member creation within a super fund. The key integration to enable Grow features is the capability to receive an employee's details, register them as a new member with the super fund, and return the necessary details for a contribution to be made to the member from the employer (usually a member number).

## Implementation methods

### A) New member API

Super fund provides an API via which new members can be registered.

### B) Embeddable join form (iframe)

Super fund provides a join form that can be embedded within SuperAPI.

### C) Member registration via SuperStream

Super fund receives member registrations via the SuperStream network. This is a standard & ATO compliant method of receiving new member registrations, it is the method via which an employer will register a new employee as a member of their default super fund.

### D) Member registration via external join form

Super fund provides a join form that is not embedded within SuperAPI. Employees looking to join the fund are directed to the external join form in order to complete the new member join process. This option is provided as a fallback method of supporting funds that do not have the technical capability to enable the other implementation methods.
