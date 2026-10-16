# Serial Skill regression catalog

The adjacent skill-regression.json is adapted from internal e6dacaa5. It contains synthetic requests, inputs and acceptance criteria for generation, follow-up edits and the standalone editor. It is a manual multi-turn catalog, not an additional tasks.json runner input.

Expose only the Skill and task inputs to the model. Run one turn at a time, retain prior artifacts for follow-ups, and inspect unmodified outputs in the browser. Keep actual model logs and screenshots in ignored local output. Known library defects and deferred responsive configuration are not passing criteria hidden by workarounds.
