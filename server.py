from flask import Flask, request, Response
from os import environ
import serial


NO_SERIAL = environ.get('NO_SERIAL')
serial_port = None if NO_SERIAL else serial.Serial('/dev/ttyACM0')

app = Flask(__name__)

@app.route('/')
def root():
    joint = int(request.args.get('joint'))
    degree = int(request.args.get('degree'))

    message = bytes([joint, degree])
    print('out', message, end='--')
    if serial_port:
        serial_port.write(message)
        print('in', serial_port.readline(), end='')
    print()

    return Response('{} {}\n'.format(joint, degree),
                    headers={'Access-Control-Allow-Origin': '*'},
                    mimetype='text/plain')
