.PHONY: server_frontend server_frontend_with_backend server_backend servers test clean

server_frontend:
	 ./node_modules/.bin/webpack-dev-server --mode development

server_frontend_with_backend:
	 SERVER_URL='http://localhost:9001' ./node_modules/.bin/webpack-dev-server --mode development

test:
	node_modules/.bin/jest

server_backend:
	FLASK_APP=server.py FLASK_DEBUG=1 flask run --host=0.0.0.0

server_backend_production:
	FLASK_APP=server.py python -m flask run --host=0.0.0.0

server_backend_test:
	NO_SERIAL=1 FLASK_APP=server.py FLASK_DEBUG=1 flask run --host=0.0.0.0

servers: server_frontend server_backend

servers_test: server_frontend_with_backend server_backend_test

dist/bundle.js:
	#use the same url as the client
	SERVER_URL='' ./node_modules/.bin/webpack

package.tar.gz: dist/bundle.js
	./scripts/package.sh

clean:
	rm -f dist/bundle.js
	rm -f dist/bundle.js.map
	rm -f package.tar.gz
