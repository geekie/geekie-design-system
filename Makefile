.PHONY: lint
lint:
		yarn prettier --write .
		yarn eslint . --fix --ext js,jsx,ts,tsx
		yarn tsc
