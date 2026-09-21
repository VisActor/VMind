# VisActor Skills maintenance

- Runtime skills live in `skills/` and must work when copied independently.
- Keep tests, fixed evaluation tasks and generated reports outside skill directories.
- Preserve user changes. Do not commit or publish unless requested.
- Use `uv run pytest` for Python tests and `uv run ruff check` for maintained Python tooling.
- Test stable behavior; do not snapshot large instruction documents.
- For evaluation, expose only the selected skill and task inputs to the agent, never expected answers.
- Keep observable execution evidence locally, redact credentials and distinguish automated checks from human visual review.
- Do not restore the historical VMind SDK or depend on leftover local packages. Earlier versions remain in Git history and releases.
