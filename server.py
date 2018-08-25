from flask import Flask, request, Response, send_from_directory
import sys
from os import environ
import serial
from serial.tools import list_ports


devices = []
device = None
for port in list_ports.comports():
    if port.manufacturer and 'arduino' in port.manufacturer.lower():
        print('arduino found:', port.device)
        devices.append(port.device)

if len(devices) == 1:
    device = devices[0]
elif not len(devices):
    print('no arduino found')
else:
    print('more than 1 arduino found')

NO_SERIAL = environ.get('NO_SERIAL')
serial_port = None if NO_SERIAL else serial.Serial(device)

app = Flask(__name__)

@app.route('/joint')
def joint():
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


@app.route('/values', methods=['POST', 'OPTIONS'])
def values():
    body = ''

    if request.method == 'POST':
        print('serial port', serial_port)
        for value in request.json:
            # message = value.to_bytes(2, 'little')
            message = bytes([int(value)])
            print('out', value, message, end='--')
            if serial_port:
                serial_port.write(message)
        print()
        if serial_port:
            pass
            #TODO: read everything.
            # print('in', serial_port.readline())
        body = 'ok'
    else:
        print('wtf')

    return Response(body,
                    headers={
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                    mimetype='text/plain')


@app.route('/<static_file>')
def section(static_file):
    return send_from_directory('dist', static_file)
