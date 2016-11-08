'use strict';

function createResult(errors, warnings) {
  errors = errors || [];
  warnings = warnings || [];

  return {
    errors,
    warnings,
    concat,
    build
  };
}

function concat(other) {
  return createResult(
    this.errors.concat(other.errors),
    this.warnings.concat(other.warnings)
  );
}

function build() {
  return { errors: this.errors, warnings: this.warnings };
}

function empty() {
  return createResult();
}

function withError(message, line) {
  return createResult([{ message, line }]);
}

function withWarning(message, line) {
  return createResult([], [{ message, line }]);
}

function reducer(acc, res) {
  return acc.concat(res);
}

module.exports = {
  empty,
  withError,
  withWarning,
  reducer
};
