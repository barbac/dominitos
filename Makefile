.PHONY: server_frontend test

server_frontend:
	./node_modules/.bin/webpack-dev-server --mode development

test:
	node_modules/.bin/jest
