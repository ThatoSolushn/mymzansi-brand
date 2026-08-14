# MyMzansi — Feature Requirements

**Version** 1.0.0 · **Updated** 2026-08-13 · **Status** Proposal, for discussion
**Companions:** [`BRAND.md`](./BRAND.md) (design rules, WCAG audit) · [`tokens.json`](./tokens.json) (design tokens)

> **Affiliation notice.** Unofficial concept work. Not endorsed by or affiliated with the Presidency's Digital Services Unit (DSU) or any organ of the South African state. Written to open a conversation, not to specify a procured system.

---

## 0. Instructions for AI agents

**Read this section and `BRAND.md` §0 before implementing anything.**

- This document is **technology-agnostic**. It states *what* must be true, never *how*. Do not infer a framework, database, or protocol from it unless a requirement names one.
- `BRAND.md` governs how things look and behave. This document governs what exists. Where they overlap, both apply.
- Every requirement has a stable ID (`FR-F3-04`). **Cite the ID in code comments, commit messages, and tests.** Do not renumber.
- Acceptance criteria are written as Given/When/Then and are meant to become tests. If you implement a requirement without a corresponding test, say so.
- **Priority is MoSCoW.** `MUST` items are not negotiable — several exist because omitting them excludes people from grants, identity documents, or income.
- Where a requirement says a decision is **unresolved**, do not resolve it silently. Surface it.

### 0.1 The ordering principle

When two requirements conflict, resolve in this order:

1. **Nobody is excluded** — a person with worn fingerprints, no smartphone, no data, or no English must still complete the task.
2. **The user can verify what happened** — anything the state does with a person's data is visible and contestable.
3. **It works on a cheap phone on a slow network.**
4. **It is beautiful.**

### 0.2 The rule that catches most mistakes

> **Design the failure path first.** For every feature below, the failure path is not an error state bolted on afterwards — it is the requirement. Most government products invert this and lose trust exactly where it is decided.

---

## 1. Scope and provenance

### 1.1 What this covers

Requirements for the **Trust & Inclusion Layer** of MyMzansi: identity presentation, consent, audit, assurance fallback, recovery, and delegation. Plus the cross-cutting language, accessibility and channel requirements that apply to all of it.

### 1.2 What this does not cover

Registry management, biometric matching, payment rails, departmental back-office systems, or the service catalogue. Those are assumed to exist and are integrated with, not specified here.

### 1.3 Evidence base

| Source | What it contributed |
|---|---|
| MyMzansi roadmap and live site | Four DPI blocks, existing design tokens, delivery posture |
| Open Cities Lab published methodology | "One-touch government", product thinking (beneficiary ≠ user), the streetlight critique |
| Aadhaar (India) | Documented biometric exclusion harms → F3 |
| gov.br (Brazil) | Tiered assurance (bronze/silver/gold) → F3 |
| X-Road / e-ID (Estonia) | Citizen-visible access log → F6 |
| Diia (Ukraine) | Legal parity of digital credentials → NFR-LEG-01 |
| Myinfo (Singapore) | Verified-attribute sharing to private sector → F2 |
| GOV.UK Verify (failure) | Federated coverage gaps → F3, F5 |
| Draft SA Digital ID regulations, public comment | Device-dependency objection → F5 |
| Constitution 18th Amendment (2023) | SASL as 12th official language → F10 |

---

## 2. Conventions

### 2.1 Requirement IDs

```
FR-F3-04     Functional requirement, feature 3, item 4
NFR-A11Y-02  Non-functional requirement, accessibility, item 2
```

IDs are permanent. Deprecate, never reuse.

### 2.2 Priority

| Level | Meaning |
|---|---|
| **MUST** | Ship-blocking. Omitting it excludes people or breaks a legal duty. |
| **SHOULD** | Strongly expected. Omission requires a recorded decision. |
| **COULD** | Desirable. Drop under pressure without escalation. |
| **WON'T** | Explicitly out of scope for this phase. Recorded so it is not re-litigated. |

### 2.3 Roles (Open Cities Lab vocabulary — use it consistently)

| Role | Who |
|---|---|
| **Beneficiary** | The person whose life should measurably improve. Often not the person touching the software. |
| **User** | Whoever operates the interface — citizen, counter official, or delegate. |
| **Customer** | The department or unit adopting the service. |

A feature that works for the *user* and does not improve the *beneficiary's* outcome has failed.

---

## 3. The exclusion cases

Every feature is tested against these people. They are not edge cases; they are a large share of the user base.

| # | Case | Implication |
|---|---|---|
| P1 | Manual worker, worn fingerprints | Biometric auth fails repeatedly → F3 |
| P2 | Older grant recipient, no smartphone | Cannot use the app at all → F8, F9 |
| P3 | Phone stolen | Locked out of legal identity → F5 |
| P4 | No data or airtime | App unreachable → F9 |
| P5 | Speaks isiXhosa, limited English | Cannot read the interface → F10 |
| P6 | Deaf, SASL first language | Text-only consent is not informed consent → F10 |
| P7 | Rural, nearest office is hours away | "Visit your nearest office" is not a next step → F3 |
| P8 | Caregiver collecting for a relative | Must act for someone else lawfully → F8 |
| P9 | Low vision / motor impairment | Contrast and target size → NFR-A11Y |
| P10 | Distrusts government with data | Needs verifiable evidence, not reassurance → F6, F7 |

---

## 4. Feature catalogue

| ID | Feature | Priority | Concept | Status |
|---|---|---|---|---|
| **F1** | Identity wallet and home | MUST | — | Prototyped |
| **F2** | Consent and verified-attribute sharing | MUST | — | Prototyped |
| **F3** | Tiered assurance and biometric fallback | MUST | A | Prototyped |
| **F4** | Assisted verification (counter official) | MUST | A | Prototyped |
| **F5** | Device loss and recovery | MUST | A / E | Prototyped |
| **F6** | Access log — consent and audit ledger | MUST | B | Prototyped |
| **F7** | Dispute and escalation | MUST | B | Prototyped |
| **F8** | Delegated and guardianship access | MUST | D | Prototyped |
| **F9** | Low-bandwidth, offline and USSD channel | MUST | E | Partly prototyped |
| **F10** | Language and South African Sign Language | MUST | — | Specified, not built |
| **F11** | Credential conformance and interoperability | SHOULD | C | Not started |
| **F12** | Municipal adapter | COULD | F | Not started |

---

## 5. Features

---

### F1 — Identity wallet and home

**Beneficiary:** any resident holding a state-issued credential.
**Purpose:** establish the wallet as the home surface, and invert the direction of travel — institutions ask, the citizen decides.

| ID | Priority | Requirement |
|---|---|---|
| FR-F1-01 | MUST | The home surface presents the person's held credentials as the primary content. |
| FR-F1-02 | MUST | Requests from institutions are surfaced to the citizen. The citizen never navigates to a department to respond to one. |
| FR-F1-03 | MUST | Each pending request states the requesting organisation, the purpose, and when it was raised, before the citizen opens it. |
| FR-F1-04 | MUST | The current assurance level is visible on the home surface at all times. |
| FR-F1-05 | SHOULD | Recently completed transactions are visible with their outcome and any amount paid. |
| FR-F1-06 | MUST | The interface language is visible and changeable from the home surface in one action. |

**Acceptance**

```gherkin
Given a citizen with a Smart ID credential and one pending request
When they open the home surface
Then their credentials are visible without scrolling
And the pending request states organisation, purpose and age
And their assurance level is visible
And the active language is visible and changeable in one action
```

---

### F2 — Consent and verified-attribute sharing

**Beneficiary:** a person opening a bank account, registering a SIM, or proving an attribute.
**Purpose:** replace document-carrying with a consented, minimal, auditable attribute release. This is the Singapore Myinfo pattern and the programme's likeliest sustainability model.

| ID | Priority | Requirement |
|---|---|---|
| FR-F2-01 | MUST | A consent request states **exactly which attributes** are requested, individually. Never a category ("your details"). |
| FR-F2-02 | MUST | A consent request states **explicitly what will not be shared**. Listing only inclusions is insufficient. |
| FR-F2-03 | MUST | Attributes support **selective disclosure**: where a yes/no answer satisfies the purpose, only the yes/no is released. Age is the reference case — "over 18", never date of birth. |
| FR-F2-04 | MUST | The request states purpose, duration (one-time or standing, with an end date), and the legal basis. |
| FR-F2-05 | MUST | The legal basis is stated **twice**: in plain language and as a citation. |
| FR-F2-06 | MUST | Declining is presented with equal prominence and requires no justification. |
| FR-F2-07 | MUST | On release, the citizen receives a receipt listing what was shared, to whom, when, and a reference. |
| FR-F2-08 | MUST | The release is written to the access log (F6) atomically with the release itself. A release that cannot be logged does not occur. |
| FR-F2-09 | SHOULD | Standing consents state their expiry on the consent surface, not only in settings. |

**Acceptance**

```gherkin
Given a bank requests name, over-18 status and address
When the citizen views the consent request
Then each attribute is listed individually
And the surface states what the bank will not see
And "over 18" is shown as a yes/no, not a date of birth
And purpose, duration and legal basis are stated
And declining is as prominent as accepting

Given the citizen consents
When the release completes
Then a receipt is issued with a reference
And a corresponding entry exists in the access log

Given the access log is unavailable
When the citizen consents
Then the release does not occur
And the citizen is told it could not be completed and why
```

---

### F3 — Tiered assurance and biometric fallback

**Beneficiary:** P1, P7. The single most documented harm in national digital identity.
**Purpose:** a failed biometric downgrades capability; it never ends the session.

| ID | Priority | Requirement |
|---|---|---|
| FR-F3-01 | MUST | At least **three assurance levels** exist. Each level maps to an explicit set of permitted actions. |
| FR-F3-02 | MUST | An alternative verification method is offered **before any failure occurs**, not only after. |
| FR-F3-03 | MUST | After the **second** failed biometric attempt, alternatives become the primary action and retry becomes secondary. |
| FR-F3-04 | MUST | Failure messaging attributes the failure to the system, never the person. See `BRAND.md` §10.2. |
| FR-F3-05 | MUST | Where failure is common for a group (worn fingerprints, thin skin with age), the interface says so explicitly. |
| FR-F3-06 | MUST | On stepping down, the citizen is shown **what they can do now** and **what needs a higher level**, as two distinct lists. |
| FR-F3-07 | MUST | Every restriction states its reason in plain language. A disabled control without a reason is a defect. |
| FR-F3-08 | MUST | Routes to raise the assurance level are always available and state **place, distance, opening time and expected wait**. |
| FR-F3-09 | MUST | At least **three distinct routes** to raise a level exist, of which at least one requires no travel. |
| FR-F3-10 | MUST | A pending request survives an assurance failure and completes without restarting when the level is later raised. Minimum persistence **30 days**. |
| FR-F3-11 | MUST | Assurance level is never conveyed by colour alone. A text statement of the level is always present. |
| FR-F3-12 | SHOULD | Biometric material never leaves the device, and the interface states this at the point of capture. |

**Acceptance**

```gherkin
Given a citizen whose fingerprint has failed twice
When the second failure is shown
Then alternative methods are the primary action
And retry is secondary
And the message states the failure is common and not the citizen's fault

Given a citizen verified at level 1 of 3
When they view their status
Then permitted actions and restricted actions are shown as separate lists
And each restriction states its reason
And the level is stated in text, not only by colour

Given a citizen at level 1 with a pending bank request
When they raise their level at any route within 30 days
Then the request completes without being re-initiated
```

---

### F4 — Assisted verification (counter official)

**Beneficiary:** P1, P2, P7 — anyone the digital path cannot serve.
**User:** the counter official. **This is the two-sided requirement most likely to be omitted.**

| ID | Priority | Requirement |
|---|---|---|
| FR-F4-01 | MUST | An official-facing surface exists for assisted verification. |
| FR-F4-02 | MUST | It states **why the citizen is present** and explicitly whether that reason is a fraud signal. A failed biometric is not, on its own. |
| FR-F4-03 | MUST | It presents a **mandatory ordered procedure**. Steps cannot be skipped or recorded out of order. |
| FR-F4-04 | MUST | At least one step requires an independent second party (supervisor authorisation). |
| FR-F4-05 | MUST | Every assist is logged against the **operator's identifier** and is visible to the citizen in F6. |
| FR-F4-06 | MUST | The official is told, on screen, that the assist is recorded and visible to the citizen. |
| FR-F4-07 | MUST | Citizen identifiers are masked to the minimum the procedure requires. |
| FR-F4-08 | SHOULD | The official surface functions on the connectivity available at the least-connected service point in scope. |

**Acceptance**

```gherkin
Given a citizen arrives after three biometric failures
When the official opens assisted verification
Then the reason is stated
And the surface states this is not a fraud signal on its own
And the procedure lists all required steps in order

Given the official has not completed every step
When they attempt to confirm the verification
Then confirmation is refused
And the outstanding steps are identified

Given an assist is completed
Then it is recorded against the operator identifier
And it appears in the citizen's access log
```

---

### F5 — Device loss and recovery

**Beneficiary:** P3. Directly answers the device-dependency objection raised against the draft Digital ID regulations.

| ID | Priority | Requirement |
|---|---|---|
| FR-F5-01 | MUST | Loss can be reported **without authenticating**, and the entry point is on the sign-in surface. |
| FR-F5-02 | MUST | Loss can be reported from a **channel requiring neither a smartphone nor data** (USSD or equivalent). |
| FR-F5-03 | MUST | On report, the citizen is shown **concretely what was on the device** — each credential and each standing permission — in plain language, with what someone could do with it. |
| FR-F5-04 | MUST | Suspending everything is offered as a single action, with per-item choice also available. |
| FR-F5-05 | MUST | Where suspension could affect a payment the person depends on, the interface states the effect on the next payment **before** the citizen acts. |
| FR-F5-06 | MUST | At least **four re-proofing routes**, of which at least one is available to a person holding no documents. |
| FR-F5-07 | MUST | A police case number **MUST NOT** be a precondition for recovery. |
| FR-F5-08 | MUST | On recovery, credentials are restored automatically; **standing permissions are NOT**. Re-granting is an explicit decision. |
| FR-F5-09 | MUST | Where a non-restored permission has a time-sensitive consequence, the deadline is stated with a one-action path to restore. |
| FR-F5-10 | MUST | The old device is unbound, and the unbinding is visible in the recovery timeline and the access log. |
| FR-F5-11 | MUST | A documented unbinding procedure exists and is discoverable before loss occurs. |

**Acceptance**

```gherkin
Given a citizen whose phone was stolen and who is not signed in
When they open the sign-in surface
Then reporting a lost device is available without authenticating
And a non-data channel is offered

Given they report the loss
Then each credential and standing permission is listed in plain language
And the effect on their next grant payment is stated before they act

Given they complete re-proofing
Then credentials are restored
And standing permissions remain off
And any time-sensitive consequence is stated with a one-action path to restore
```

---

### F6 — Access log (consent and audit ledger)

**Beneficiary:** P10, and everyone. Estonia's actual trust mechanism.
**Purpose:** a **control surface**, not a transparency report. Visibility alone changes nothing — see the streetlight critique.

| ID | Priority | Requirement |
|---|---|---|
| FR-F6-01 | MUST | Every access to a citizen's data by any party is recorded. |
| FR-F6-02 | MUST | The log is **append-only and tamper-evident**. No party, including the operator, can delete an entry. |
| FR-F6-03 | MUST | Entries are written as **plain-language sentences stating why**, not as structured rows. |
| FR-F6-04 | MUST | Each entry states: who, which office, which role, what was seen, when, the legal basis, and whether the citizen initiated it. |
| FR-F6-05 | MUST | The system **MUST** be able to represent and display an access with **no recorded reason**, and MUST surface it prominently. A log that cannot show something wrong is decorative. |
| FR-F6-06 | MUST | Individual officials are identified by **role plus a stable reference**, never by name. Enough to investigate, not enough to retaliate. |
| FR-F6-07 | MUST | The legal basis is stated in plain language **and** as a citation. |
| FR-F6-08 | MUST | Standing permissions are listed with their scope and expiry, and each is individually revocable from the same surface. |
| FR-F6-09 | MUST | Revocation is reachable from the entry that motivates it, not only from a settings surface. |
| FR-F6-10 | MUST NOT | A single bulk "revoke everything" action **MUST NOT** be offered where any permission carries a payment consequence. |
| FR-F6-11 | MUST | Delegated actions (F8) write to the same log, in the same form. |
| FR-F6-12 | SHOULD | The log is reachable from the receipt issued in FR-F2-07. |

**Acceptance**

```gherkin
Given accesses have been recorded for a citizen
When they open the access log
Then each entry reads as a sentence ending in why it happened
And any access with no recorded reason is visibly flagged

Given an access with no recorded reason
When the citizen opens it
Then the legal basis is shown in plain language and as a citation
And the official is identified by role and reference, not by name
And actions to dispute and to revoke are both available

Given a standing permission that pays a grant
When the citizen views their permissions
Then no single action revokes all permissions at once
```

---

### F7 — Dispute and escalation

**Purpose:** the requirement that converts F6 from a report into a control. **Without F7, F6 is a portal.**

| ID | Priority | Requirement |
|---|---|---|
| FR-F7-01 | MUST | Any logged access can be disputed by the citizen. |
| FR-F7-02 | MUST | Dispute reasons are offered as selectable options with free text also available. |
| FR-F7-03 | MUST | Before submitting, the citizen is told: **who must respond**, **by when**, **who is copied**, and **what happens if nobody responds**. |
| FR-F7-04 | MUST | A named respondent and a **stated deadline** are recorded. |
| FR-F7-05 | MUST | The independent regulator is copied **at the time of lodging**, not on escalation. |
| FR-F7-06 | MUST | If the deadline passes without response, escalation occurs **automatically**. The citizen is never required to chase. |
| FR-F7-07 | MUST | A reference is issued and the status is trackable with a visible timeline. |
| FR-F7-08 | MUST | The citizen is notified when the status changes. |
| FR-F7-09 | SHOULD | Dispute outcomes are recorded against the original log entry. |

**Acceptance**

```gherkin
Given a citizen disputes an access
When they review before submitting
Then the respondent, deadline, regulator copy and no-response consequence are all stated

Given the dispute is lodged
Then a reference is issued
And the regulator is copied the same day
And a timeline shows the response deadline

Given the deadline passes with no response
Then escalation occurs without any action by the citizen
```

---

### F8 — Delegated and guardianship access

**Beneficiary:** P2, P8. This models how grant collection **already works informally**. A system that ignores it either excludes those people or drives credential-sharing, which is worse.

| ID | Priority | Requirement |
|---|---|---|
| FR-F8-01 | MUST | Delegation is **initiated by the principal** — the person whose credential it is. A delegate can never initiate. |
| FR-F8-02 | MUST | Delegation can be established through an assisted channel for a principal with no smartphone. |
| FR-F8-03 | MUST | Delegation is **scoped**: permitted actions are enumerated, and the **prohibited list is shown in full**, not hidden behind an advanced view. |
| FR-F8-04 | MUST | Prohibited actions **MUST** include, at minimum: changing payment destination, changing contact or address details, accessing unrelated credentials, incurring credit, and re-delegating. |
| FR-F8-05 | MUST | Delegation is **non-transitive**. A delegate cannot appoint another delegate. |
| FR-F8-06 | MUST | Delegation is **time-bounded** and expires by default. Indefinite delegation MUST NOT be the default. |
| FR-F8-07 | MUST | The principal is **notified on every use**, over a channel needing no smartphone or data. |
| FR-F8-08 | MUST | Revocation is possible by replying to that notification, and is immediate. |
| FR-F8-09 | MUST | While acting as a delegate, a **persistent, non-dismissible** indicator names the principal and the expiry. |
| FR-F8-10 | MUST | Prohibited actions are **visible but disabled** in the delegate's view, not hidden. This protects the honest delegate as much as the principal. |
| FR-F8-11 | MUST | Every delegated action appears in the principal's access log with revocation available alongside. |
| FR-F8-12 | SHOULD | Court-appointed curatorship is supported as a distinct delegation type with its own scope. |

**Threat model — elder financial abuse.** FR-F8-01, -03, -04, -05, -06, -07 and -08 exist because of it. Weakening any of them requires an explicit recorded decision.

**Acceptance**

```gherkin
Given a grant recipient wants help collecting
When delegation is set up
Then it is initiated by the recipient, never the delegate
And the prohibited list is shown in full
And changing payment destination is prohibited
And an expiry date is set by default

Given a delegate acts on the principal's behalf
Then the principal is notified the same day over a non-data channel
And replying to that notification revokes the delegation immediately
And the action appears in the principal's access log

Given a delegate is acting for a principal
When they use the interface
Then a non-dismissible indicator names the principal and expiry
And prohibited actions are visible but disabled
```

---

### F9 — Low-bandwidth, offline and USSD channel

**Beneficiary:** P2, P4. Channel diversity is a stated roadmap principle, not an optimisation.

| ID | Priority | Requirement |
|---|---|---|
| FR-F9-01 | MUST | Credentials can be presented **offline**, with no network at either party. |
| FR-F9-02 | MUST | Offline presentation is verifiable by the relying party without contacting a server. |
| FR-F9-03 | MUST | A **non-smartphone channel** (USSD or equivalent) supports at minimum: reporting device loss, checking payment status, receiving delegation notifications, and revoking a delegation. |
| FR-F9-04 | MUST | Notifications that carry a safeguard function (FR-F8-07) are delivered free to the recipient. |
| FR-F9-05 | MUST | The application makes **no requests to any origin outside the zero-rated platform**. See `BRAND.md` §12. |
| FR-F9-06 | MUST | Core flows complete on the target device and network profile in `tokens.json` → `budget`. |
| FR-F9-07 | SHOULD | Interrupted journeys resume rather than restart. |
| FR-F9-08 | SHOULD | The interface states when it is operating offline and what remains available. |

**Acceptance**

```gherkin
Given no network on either device
When a citizen presents a credential to a relying party
Then the credential is presented and verified without contacting a server

Given a person with a feature phone and no data
When they use the non-smartphone channel
Then they can report a lost device, check payment status and revoke a delegation

Given the application is loaded
When network requests are inspected
Then no request is made to an origin outside the zero-rated platform
```

---

### F10 — Language and South African Sign Language

**Beneficiary:** P5, P6. South Africa has **twelve official languages**; since 2023 one is SASL.

| ID | Priority | Requirement |
|---|---|---|
| FR-F10-01 | MUST | All twelve official languages are supported for interface and content. |
| FR-F10-02 | MUST | Language is changeable in one action from the home surface and is not buried in settings. |
| FR-F10-03 | MUST | Language can be changed **mid-transaction** without losing progress. |
| FR-F10-04 | MUST | The language of the page and of each part is declared programmatically, so assistive technology pronounces each correctly. |
| FR-F10-05 | MUST | No layout uses fixed-width containers for translatable text. See `BRAND.md` §5.5. |
| FR-F10-06 | MUST | No text is baked into images. |
| FR-F10-07 | MUST | **SASL is a first-class content type.** Signed video is provided for consent surfaces, assurance explanations, and anything with legal consequence. |
| FR-F10-08 | MUST | Signed content is presented alongside text, not relegated to a separate accessibility area. |
| FR-F10-09 | MUST | Signed content degrades gracefully where bandwidth cannot carry video, and the degradation is stated. |
| FR-F10-10 | MUST | All copy is reviewed by native speakers before release. Machine or agent-generated translation **MUST NOT** ship unreviewed. |
| FR-F10-11 | SHOULD | The chosen typeface covers all diacritics in official languages and the click letters `ǀ ǁ ǂ ǃ`. |

**Acceptance**

```gherkin
Given a citizen using isiXhosa
When they part-complete a consent flow and change language
Then progress is retained
And the new language is declared programmatically

Given a consent surface with legal consequence
Then signed SASL content is available alongside the text
And where bandwidth cannot carry it, the interface says so

Given a label rendered in isiZulu at roughly twice the English length
When the layout renders
Then no text is truncated and no container overflows
```

---

### F11 — Credential conformance and interoperability

**Purpose:** structural defence against vendor lock-in. Off the critical path — suitable to be owned by an external contributor.

| ID | Priority | Requirement |
|---|---|---|
| FR-F11-01 | SHOULD | Credentials conform to published open standards for issuance and presentation, both in-person and online. |
| FR-F11-02 | SHOULD | An automated, publicly runnable conformance suite exists and covers issuance, online presentation and offline presentation. |
| FR-F11-03 | SHOULD | Conformance results are published in a stable, comparable format. |
| FR-F11-04 | SHOULD | Conformance is a **procurement gate** for any candidate wallet or issuer. |
| FR-F11-05 | COULD | Cross-border interoperability with equivalent foreign wallet schemes is demonstrated. |

> **Unresolved.** The specific standards profile is a decision for the DSU. This document deliberately does not fix it — see §9.

---

### F12 — Municipal adapter

**Purpose:** extend identity to the tier where most citizen–state friction actually happens.

| ID | Priority | Requirement |
|---|---|---|
| FR-F12-01 | COULD | A municipality can consume identity and verified attributes **without replacing existing systems**. |
| FR-F12-02 | COULD | At least one real municipal service is delivered end to end as proof. |
| FR-F12-03 | COULD | An institutional readiness assessment accompanies the technical adapter — governance, data ownership, legal agreements. |

> The binding constraint at municipal level is **institutional readiness, not software**. A technically complete adapter with no readiness path will not be adopted.

---

## 6. Cross-cutting non-functional requirements

### 6.1 Accessibility

| ID | Priority | Requirement |
|---|---|---|
| NFR-A11Y-01 | MUST | WCAG 2.1 Level AA throughout. Contrast verified by computation, not inspection. |
| NFR-A11Y-02 | MUST | No information conveyed by colour alone. |
| NFR-A11Y-03 | MUST | Interactive targets ≥ 44px; ≥ 48px where adjacent or destructive. |
| NFR-A11Y-04 | MUST | Text resizes to 200% without loss of content or function. |
| NFR-A11Y-05 | MUST | Full keyboard and switch operability with a visible focus indicator. |
| NFR-A11Y-06 | MUST | Every control has a programmatic accessible name. |
| NFR-A11Y-07 | MUST | Errors identified in text, with a stated correction. |
| NFR-A11Y-08 | MUST | `prefers-reduced-motion` honoured as a first-class state. |
| NFR-A11Y-09 | SHOULD | Verified against colour-vision deficiency simulation. **Currently outstanding.** |

### 6.2 Privacy and data protection

| ID | Priority | Requirement |
|---|---|---|
| NFR-PRIV-01 | MUST | Data minimisation: only attributes necessary for the stated purpose are released. |
| NFR-PRIV-02 | MUST | Purpose limitation: every access carries a recorded purpose and legal basis. |
| NFR-PRIV-03 | MUST | Biometric material remains on the citizen's device. |
| NFR-PRIV-04 | MUST | No personal data in URLs, query strings, or logs intended for operational monitoring. |
| NFR-PRIV-05 | MUST | Consent is revocable, and revocation takes effect immediately. |
| NFR-PRIV-06 | MUST NOT | Data collected for one service **MUST NOT** be reused for another without fresh consent or a stated legal basis recorded in F6. |
| NFR-PRIV-07 | SHOULD | Independent privacy impact assessment before any new data-sharing pathway. |

### 6.3 Legal

| ID | Priority | Requirement |
|---|---|---|
| NFR-LEG-01 | MUST | Digital credentials hold **legal parity** with their physical equivalents. A credential a relying party may lawfully refuse is a demonstration, not a service. |
| NFR-LEG-02 | MUST | Assisted and delegated actions are legally recognised and auditable. |
| NFR-LEG-03 | SHOULD | Enabling regulation is tracked as a delivery dependency, not an external assumption. |

### 6.4 Performance and reach

| ID | Priority | Requirement |
|---|---|---|
| NFR-PERF-01 | MUST | Core flows complete on the target device and network in `tokens.json` → `budget`. |
| NFR-PERF-02 | MUST | Zero external origins. |
| NFR-PERF-03 | MUST | Interaction feedback within 100ms of input. |
| NFR-PERF-04 | SHOULD | Animation holds 60fps on the target device. |

### 6.5 Operability

| ID | Priority | Requirement |
|---|---|---|
| NFR-OPS-01 | MUST | Loss of a downstream department system degrades that service only — never identity or the access log. |
| NFR-OPS-02 | MUST | Access-log writes are durable and survive partial system failure. |
| NFR-OPS-03 | SHOULD | Every failure path has an assisted equivalent that functions during an outage. |

---

## 7. Explicitly out of scope

| ID | Item | Reason |
|---|---|---|
| WONT-01 | Voting or electoral functions | Distinct legal and threat model |
| WONT-02 | Land title and deeds | Registry maturity |
| WONT-03 | Determining eligibility for identity documents | Home Affairs statutory function |
| WONT-04 | Status of undocumented residents and asylum seekers | **Deliberately unresolved.** A technical question intersecting the most politically charged debate in the country. Any serious proposal needs a stated position; this document does not invent one. |
| WONT-05 | Biometric matching algorithms | Existing registry function |

---

## 8. Traceability

| Exclusion case | Covered by |
|---|---|
| P1 worn fingerprints | FR-F3-02, -03, -04, -05, -09; F4 |
| P2 no smartphone | FR-F5-02, F8-02, F9-03 |
| P3 stolen phone | F5 entire |
| P4 no data | FR-F9-03, -04, -05 |
| P5 limited English | F10 entire |
| P6 deaf, SASL | FR-F10-07, -08, -09 |
| P7 rural | FR-F3-08, -09; FR-F5-06 |
| P8 caregiver | F8 entire |
| P9 low vision / motor | NFR-A11Y-01 … -08 |
| P10 distrust | F6, F7 entire |

| International lesson | Requirement |
|---|---|
| Aadhaar exclusion | FR-F3-01 … -09 |
| gov.br tiered assurance | FR-F3-01, -06 |
| Estonia access log | FR-F6-01 … -07 |
| Diia legal parity | NFR-LEG-01 |
| Myinfo attribute sharing | F2 entire |
| Verify coverage failure | FR-F3-09, FR-F5-06 |
| SA device-dependency objection | FR-F5-01, -02, -11 |

---

## 9. Open questions

Do not resolve these silently. Each changes what gets built.

| # | Question | Blocks |
|---|---|---|
| Q1 | Which standards profile for credential issuance and presentation? | F11 |
| Q2 | Who is the accountable respondent for a dispute — the department, the DSU, or the regulator? | FR-F7-04 |
| Q3 | What is the statutory response deadline for a data-access dispute? Assumed 14 days; unverified. | FR-F7-04 |
| Q4 | Does a digital credential currently have legal parity, or is enabling regulation still required? | NFR-LEG-01 |
| Q5 | Who operates the non-smartphone channel, and who bears its cost? | F9 |
| Q6 | What is the position on non-citizens and undocumented residents? | WONT-04 |
| Q7 | Which assurance level does each government service require? Needs a service-by-service mapping that does not yet exist. | FR-F3-01 |
| Q8 | Is the access log a new system or an extension of the data exchange layer? | F6 |

---

## 10. Status of evidence

| Claim type | Confidence |
|---|---|
| International precedents | Well documented in public sources |
| MyMzansi programme status | **Verify before relying.** Public rollout, live scope, and the outcome of the June 2026 regulations comment period were not confirmed. |
| Existing design tokens | Read directly from the live site |
| WCAG results | Computed, reproducible via `npm run validate` |
| Non-English copy | **Indicative only.** Requires native-speaker review. |
| Legal citations | Indicative. Require legal review before use in an interface. |
