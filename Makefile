build: test
	deno bundle src/main.ts dist/application.js

test: format
	deno test --coverage=coverage/ --unstable
	deno coverage --unstable coverage/

format:
	deno lint --unstable src/
	deno fmt src/

clean:
	rm -rf coverage/