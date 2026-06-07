# Continuous Improvements Log

Use this document as a living backlog for what to build next and how to improve DevTrack over time.

---

## How To Use This File

1. Add one idea per row in the backlog table.
2. Move selected items into the "Planned This Cycle" section.
3. Record what was shipped in "Completed".
4. Keep priorities updated (`P0`, `P1`, `P2`).

Priority guide:
- `P0`: urgent, high impact, should be done soon
- `P1`: important, medium-term
- `P2`: nice to have, long-term

---

## Product Vision Additions

Write high-level opportunities you want to unlock:
- Example: "Turn project tracking into a complete developer operating system"
- Example: "Build portfolio-ready project storytelling from tracked data"

---

## Improvement Backlog

| ID | Area | Idea | Problem It Solves | Priority | Effort (S/M/L) | Status | Notes |
|----|------|------|-------------------|----------|----------------|--------|-------|
| IMP-001 | MCP | Add page/article MCP tools (`add_page`, `edit_page`, `list_pages`) | Lets AI agents maintain docs while coding | P1 | M | backlog | Depends on Pages module |
| IMP-002 | UX | Add global search for projects/accounts/stacks/pages | Faster retrieval in larger datasets | P1 | M | backlog | Use Postgres FTS |
| IMP-003 | Export | Add Markdown and JSON export formats | Better reuse for portfolios and docs | P1 | S | backlog | CSV already exists |
| IMP-004 | Reliability | Add audit trail for critical changes | Better debugging and trust | P1 | M | backlog | Start with projects and MCP key events |
| IMP-005 | Portfolio | Public portfolio profile with selected projects | No easy way to showcase work publicly from DevTrack | P0 | M | documented | See `public-portfolio-profile-spec.md` for full spec |
| IMP-006 | Project Quality | Project health status (Red/Amber/Green + blockers) | Hard to quickly identify at-risk projects | P1 | S | backlog | Add dashboard health summary |
| IMP-007 | Automation | Resume bullet generator from project data | Manual rewriting for resume takes time | P0 | M | backlog | AI-assisted drafts + one-click copy |
| IMP-008 | Knowledge | Notion-style project pages with templates | Project context is scattered across tools | P0 | L | backlog | Use phased roadmap in `future-work-pages-feature.md` |
| IMP-009 | Security | API key rotation and usage history UI | Users cannot easily rotate or inspect key usage | P0 | M | backlog | Include revoke-all and last 30-day stats |
| IMP-010 | Insights | Analytics dashboard (worked/pending trend, stack usage, role mix) | Users cannot measure growth and portfolio gaps | P1 | M | backlog | Monthly and quarterly views |

---

## Planned This Cycle

### Cycle Goal
Improve portfolio readiness and day-to-day productivity while strengthening MCP security.

### Selected Items
- [ ] IMP-007
- [ ] IMP-009
- [ ] IMP-003

### Success Metrics
- 70% of projects can generate resume-ready bullets in one click.
- 100% of active users can rotate MCP keys without support help.
- At least 50% of exports use Markdown or JSON (not only CSV).

---

## Completed

| Date | Item ID | What Was Delivered | Impact |
|------|---------|--------------------|--------|
| YYYY-MM-DD | IMP-XXX | Description | Result |

---

## Architecture & Technical Debt

Capture cleanup tasks that improve maintainability:
- Refactors
- Type safety improvements
- Query optimization
- Test coverage gaps
- Security hardening

Template:

| Area | Debt Description | Risk | Suggested Fix | Priority |
|------|------------------|------|---------------|----------|
| Example | API route has duplicated validation | Medium | Extract shared schema | P1 |

---

## UI/UX Improvements

Track quality upgrades for the product experience:
- Navigation clarity
- Information hierarchy
- Empty/loading/error states
- Mobile responsiveness
- Accessibility (contrast, keyboard, screen reader)

Template:

| Screen | Issue | Proposed Improvement | Priority | Status |
|--------|-------|----------------------|----------|--------|
| Projects | Filters are not obvious | Sticky filter bar with quick chips | P1 | backlog |

---

## Performance Improvements

Template:

| Area | Current Bottleneck | Proposed Fix | Expected Gain | Priority |
|------|--------------------|--------------|---------------|----------|
| Dashboard | Multiple sequential fetches | Parallelize + cache | Faster first load | P1 |

---

## Security & Compliance Improvements

Template:

| Area | Risk | Improvement | Priority | Status |
|------|------|-------------|----------|--------|
| API Keys | Key leakage risk | Key rotation UX + revoke all | P0 | backlog |

---

## Open Questions

Keep unresolved decisions here until finalized:
- Should Pages content be markdown or jsonb blocks in v1?
- Should public pages be on separate subdomain?
- Should export support PDF in-app or server-side queue?

---

## Notes

Use this section for quick ideas before converting them into backlog rows.
