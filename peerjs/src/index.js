const { PeerServer } = require('peer')

PeerServer({ port: 9001, path: '/myapp', debug: true })
