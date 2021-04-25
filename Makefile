build: test
	deno bundle src/main.ts dist/application.js

test: format
	deno test

format:
	deno lint --unstable src/
	deno fmt src/