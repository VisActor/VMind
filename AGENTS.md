# VisActor Skills maintenance

- Runtime skills live in `skills/` and must work when copied independently.
- Keep tests, fixed evaluation tasks and generated reports outside skill directories.
- Preserve user changes. Do not commit or publish unless requested.
- Use `uv run pytest` for Python tests and `uv run ruff check` for maintained Python tooling.
- Test stable behavior; do not snapshot large instruction documents.
- For evaluation, expose only the selected skill and task inputs to the agent, never expected answers.
- Keep observable execution evidence locally, redact credentials and distinguish automated checks from human visual review.
- Do not restore the historical VMind SDK or depend on leftover local packages. Earlier versions remain in Git history and releases.

## Versioning

- Version the Skills together at repository level. Do not maintain separate version numbers for `vchart-skill` and `vtable-skill`.
- Mark each formal Skills release with a Git tag that identifies the complete repository snapshot, including Skill instructions, references, templates and scripts. Preserve published tags and historical VMind SDK tags; do not move or reuse them.
- Use a release tag or commit SHA to identify the Skill version when reporting or reproducing results. A branch name alone can change over time.
- Keep Skill release versions distinct from dependency versions such as VChart and VTable. Updating a library does not assign its version number to the Skill.
