import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withRequiredChecks } from '../evals/scripts/browser-checks.mjs';

test('an omitted declared acceptance check fails the report', () => {
  const checks = [{name: 'pageErrors', passed: true}];
  assert.deepEqual(withRequiredChecks(checks, ['pageErrors', 'deckNavigation']), [
    ...checks,
    {name: 'requiredCheck:deckNavigation', passed: false, reason: 'Required check was not executed'},
  ]);
});

test('declared checks keep their observed results and do not mutate the input', () => {
  const checks = [{name: 'nonBlankCanvas', passed: false}];
  const result = withRequiredChecks(checks, ['nonBlankCanvas']);
  assert.deepEqual(result, checks);
  assert.notEqual(result, checks);
});

test('existing model cases without a required-check list retain their checks', () => {
  assert.deepEqual(withRequiredChecks([{name: 'pageErrors', passed: true}]), [
    {name: 'pageErrors', passed: true},
  ]);
});
