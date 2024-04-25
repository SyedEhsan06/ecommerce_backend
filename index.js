const express = require('express')
const app = express()
const port = 5000
const connectToMongo = require('./db')
const router = express.Router()
const cors = require("cors")
app.use(express.json())
connectToMongo();

app.use(cors({
  origin:"*",
}))
app.use('/api/auth',require('./routes/auth'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})