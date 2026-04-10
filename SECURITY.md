# Security policy

## Supported versions

Security updates are applied to the **latest minor release** of the current major version. Exact tagging will be documented once stable releases exist.

## Reporting a vulnerability

**Please do not** open a public GitHub issue for security reports.

Instead:

1. Open a **[GitHub Security Advisory](https://github.com/OWNER/InariWrite/security/advisories/new)** for this repository, **or**
2. Email maintainers at **[INSERT SECURITY EMAIL]** with a clear description and steps to reproduce.

Replace `OWNER` and the email placeholder when the project is published.

We will acknowledge receipt when possible and coordinate a fix and disclosure timeline with you.

## Scope

In scope: the InariWrite repositories, official release artifacts, and documented extension points. Out of scope: third-party plugins unless they ship in this monorepo by default.

**Optional cloud:** The default editor and CLI do not include sync, auth, or AI backends. If you deploy or use **separate** services alongside InariWrite, report vulnerabilities for those deployments to the **operator** of that service unless the issue is in our published client code. Design notes: [docs/optional-cloud.md](docs/optional-cloud.md).
