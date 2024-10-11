import express from 'express'
// import { handler } from './build/handler.js'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use((req, res, next) => {
//   console.log('server122', req.url, req.query, req.originalUrl)
//   next()
// })

app.use(express.static(path.resolve(dirname, 'build')))
app.get('/*splat', (req, res) => {
  res.sendFile(path.resolve(dirname, 'dist', 'index.html'))
})

// app.use(handler)
app.enable('trust proxy')

app.listen(5773, '0.0.0.0', () => {
  console.log(`Express server is running`)
})
