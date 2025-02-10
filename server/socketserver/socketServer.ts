import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

import { initializeProposalNamespace } from '../websockets/proposalHandler'
import { initializeChatNamespace } from '../websockets/chatHandler'

const app = express()
const server = http.createServer(app)

const corsObj = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}

app.use(cors(corsObj))

app.get('/', (req, res) => {
  res.send('WebSocket server is running')
})

const io = new Server(server, { cors: corsObj })

initializeChatNamespace(io)
initializeProposalNamespace(io)

server.listen(4000, () =>
  console.log('Server running on port 4000')
)
