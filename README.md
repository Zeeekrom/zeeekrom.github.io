# GitHub Pages root crawler preferences

Minimal static entry for LifeOps Atlas and hostname-root robots rules.
No production code, data, credentials, DNS configuration or other project
content is included.

The robots policy blocks named AI training crawlers from the whole host, so
every project page served under `zeeekrom.github.io` is covered. AI search and
user-requested AI agents (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
Claude-User, PerplexityBot, Perplexity-User) and ordinary search engines are
allowed (owner's rule for project sites, 20 November 2026). History: only
`/lifeops-atlas-showcase/` and `/agrisentry/` from 13 November 2026; the whole
host for training and answer crawlers from 16 November 2026.
Robots is advisory, not access control.

Copyright (c) 2026 LifeOps Atlas. All rights reserved.
The entry page links bilingual terms on the showcase. GitHub Pages logs visitor
IP addresses for security. This site adds no analytics, forms or browser storage.

Publish only after the owner approves repository creation and deployment and
the showcase terms release is live. GitHub Actions below uses standard hosted
actions; their own licences remain applicable.

The owner approved the initial public deployment on 13 November 2026. Pages
uses the workflow build type and publishes only `site/`; the policy tests run
before deployment. Future public changes require their own release approval.
