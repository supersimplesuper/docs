# Life cycle of an onboarding session

Unlike [other entities](/software_partners/explanations/understanding_super_api_entities/index.html)) in the SuperAPI system, onboarding sessions follow a very defined life cycle of events as they designed to be created when we need an employee to take a discrete set of actions in the SuperAPI system vs say setting up some configuration as you might do with an employer. As such, we provide some additional webhooks which allow you take actions in your system based on how the user is progressing through the onboarding session. It's worth noting that an onboarding session is conceptually the same as a state machine (or rather a state chart as we nest state machines). Thinking about them like this may help with understanding how to model them in your system.

A diagram can speak for a thousand words:

```mermaid
stateDiagram-v2
    classDef movement font-style:italic
    initial --> custom_steps
    note right of initial
        All workflows will start here then
        move to the first custom_step as defined
        by your workflow slug
    end note
    state custom_steps {
        phone_verification --> tfn_declaration
        tfn_declaration --> bank_accounts
        bank_accounts --> disclaimers
        disclaimers --> super_selection
    }
    custom_steps --> abandoned: Moved after two weeks of inactivity
    custom_steps --> pending_results: User completed onboarding
    pending_results --> generate_output
    note right of pending_results
        We wait in this state for all actions in
        the custom steps to be completed, e.g.
        waiting for super registration to complete
    end note
    generate_output --> deliver_output
    note right of custom_steps
        Defined by which workflow slug is
        used when creating the onboarding session
    end note
    deliver_output --> completed
    completed --> pending_archived
    note right of completed
        Here we emit a event notifying you that the
        onboarding session has completed.
    end note
    abandoned --> pending_results
    note left of abandoned
        Actions taken here are dependent on what
        steps are in your custom_steps. E.g. if
        super selection is used, here we will
        staple the user then default them. After
        abadonment actions have been triggered,
        it then moves to wait for the results.
    end note
    pending_archived --> archived
    note left of pending_archived
        At this point we remove PII from the
        onboarding session
    end note

    class custom_steps movement
```

One of the benefits of using SuperAPI is that we have abstracted away from you most of the logic that surrounds handling some of the more complex actions that need to be taken, e.g. MRR registration.

## Events that move the workflow automatically

Workflow states can be moved by events outside of the users control. These are:

| Event                        | Effect                                                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abandoned                    | Fired after two weeks if the onboarding session has not been completed. Will trigger abandonment behaviour then wait for the results. This for example will be to start the stapling and defaulting behaviour |
| Archived                     | Fired after four weeks regardless of what state the onboarding session is. PII is removed here                                                                                                                |
| Duplicate onboarding session | If another onboarding session is created while a previous one exists for the same workflow and employee, we immediately archive the existing onboarding session                                               |
