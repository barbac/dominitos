#!/usr/bin/zsh

OUTPUT_FILE="$PWD/package.tar.gz"
DIST_DIR="$PWD/dist"

tar cfv $OUTPUT_FILE server.py dist

cd ~/.local/lib/python3.5/site-packages

tar --append --verbose --file=$OUTPUT_FILE serial/**/*py flask/**/*py werkzeug/**/*py
