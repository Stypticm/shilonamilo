const express = require('express')
const cors = require('cors')
const lotRoutes = require('./routes/lotRoutes')

const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/lots', lotRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
