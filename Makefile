.PHONY: server_frontend server_backend test

server_frontend:
	./node_modules/.bin/webpack-dev-server --mode development

test:
	node_modules/.bin/jest

server_backend:
	FLASK_APP=server.py FLASK_DEBUG=1 flask run --host=0.0.0.0

server_backend_test:
	NO_SERIAL=1 FLASK_APP=server.py FLASK_DEBUG=1 flask run --host=0.0.0.0

servers: server_frontend server_backend

servers_test: server_frontend server_backend_test
