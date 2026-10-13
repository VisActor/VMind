export function withRequiredChecks(checks, required = []) {
  const executed = new Set(checks.map(check => check.name));
  return [...checks, ...required.filter(name => !executed.has(name)).map(name => ({
    name: `requiredCheck:${name}`,
    passed: false,
    reason: 'Required check was not executed',
  }))];
}
