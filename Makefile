.PHONY: lint
lint:
		yarn prettier --write .
		yarn eslint . --fix --ext js,jsx,ts,tsx
		yarn tsc

.PHONY: lint-no-fix
lint:
		yarn prettier --check .
		yarn eslint . --ext js,jsx,ts,tsx
		yarn tsc
