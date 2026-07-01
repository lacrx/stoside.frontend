## Workflow
After completing a code change, commit and push without asking. Deployment pipeline is attached to this repo.

## Knowledge Base
For engineering tasks, fetch from agent-knowledge-docs:
`gh api repos/lacrx/agent-knowledge-docs/contents/{path}?ref=main -H "Accept: application/vnd.github.raw+json"`

Discovery: fetch `QUICK-REF.md` first, find matching row, fetch that path. Fallback to `TOPIC-INDEX.md`.