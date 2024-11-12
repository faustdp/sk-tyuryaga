import cors from 'cors'
import express, { Router } from 'express'

import { apiPath, checkPath, mePath, sitePort, siteUrl } from './server/config'
// import { handler } from './build/handler.js'
// import path from 'path'
// import { fileURLToPath } from 'url'
import meHandler from './server/me'

// const dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === 'production'
//         ? process.env.PUBLIC_SITE_URL
//         : `http://localhost:${process.env.PUBLIC_SITE_PORT}`,
//   }),
// )

app.use(
  cors({
    origin: siteUrl,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// if (process.env.NODE_ENV === 'production') {
//   app.get(['*.js', '*.css', '*.html', '*.svg'], (req, res, next) => {
//     const ext = req.url.split('.').pop()
//     if (req.header('Accept-Encoding')?.includes('br') && ext && mimeTypes[ext]) {
//       req.url = req.url + '.br'
//       res.set('Content-Encoding', 'br')
//       res.set('Content-Type', mimeTypes[ext])
//     }
//     next()
//   })
//   app.use(express.static(path.resolve(dirname, 'build')))
//   app.get('/*splat', (req, res) => {
//     res.sendFile(path.resolve(dirname, 'dist', 'index.html'))
//   })
// }

app.enable('trust proxy')
const router = Router()

router.post(mePath, (req, res) => {
  meHandler(req, res)
})

router.get(checkPath, (req, res) => {
  res.status(200).send('OK')
})

router.post('/test', (req) => {
  console.log('fromFront:', req.body)
})

app.use(apiPath, router)

// app.use(handler)

async function shutdown() {
  try {
    console.log('Shutdown complete.')
    process.exit(0)
  } catch (err) {
    console.error('Error during shutdown:', err)
    process.exit(1)
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

app.listen(sitePort, '0.0.0.0', () => {
  console.log(`Express server is running`)
})
