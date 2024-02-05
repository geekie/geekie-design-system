.PHONY: lint
lint:
		yarn prettier --write .
		yarn eslint . --fix --ext js,jsx,ts,tsx
		yarn tsc

.PHONY: test
test:
		yarn test

.PHONY: lint-no-fix
lint-no-fix:
		yarn prettier --check .
		yarn eslint . --ext js,jsx,ts,tsx
		yarn tsc
