import cors from 'cors'
import express, { Router } from 'express'

// import { handler } from './build/handler.js'
// import path from 'path'
// import { fileURLToPath } from 'url'
import botHandler from './server/bot'
import { apiPaths, serverId, setupBot, sitePort, siteUrl } from './server/config'
import * as DB from './server/db'
import {
  handleCheckCode,
  handleCheckSubscription,
  handleGetFriends,
  handleSetAddress,
  handleTaskStatus,
  setAddBonus,
  setClaimFriends,
  setEndTime,
  setFarmCigs,
  setSelectImage,
} from './server/handlers'
import { meHandler } from './server/me'

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
app.enable('trust proxy')

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

const router = Router()

router.get(apiPaths.healthPath, (req, res) => {
  res.status(200).send('OK')
})

router.post(apiPaths.mePath, (req, res) => {
  meHandler(req, res)
})

router.post(apiPaths.botPath, (req, res) => {
  botHandler(req, res)
})

router.post(apiPaths.endTimePath, (req, res) => {
  setEndTime(req, res)
})

router.post(apiPaths.farmCigsPath, (req, res) => {
  setFarmCigs(req, res)
})

router.post(apiPaths.addBonusPath, (req, res) => {
  setAddBonus(req, res)
})

router.post(apiPaths.claimFriendsPath, (req, res) => {
  setClaimFriends(req, res)
})

router.post(apiPaths.selectImagePath, (req, res) => {
  setSelectImage(req, res)
})

router.post(apiPaths.setAddressPath, (req, res) => {
  handleSetAddress(req, res)
})

router.post(apiPaths.checkSubscriptionPath, (req, res) => {
  handleCheckSubscription(req, res)
})

router.post(apiPaths.checkCodePath, (req, res) => {
  handleCheckCode(req, res)
})

router.post(apiPaths.taskStatusPath, (req, res) => {
  handleTaskStatus(req, res)
})

router.post(apiPaths.getFriendsPath, (req, res) => {
  handleGetFriends(req, res)
})

router.post('/test', (req) => {
  console.log('fromFront:', req.body)
})

app.use(apiPaths.apiPath, router)

setupBot()

// app.use(webhookCallback(bot, "express")) webhookcb from grammy
// app.use(handler)

let isClosing = false

async function shutdown() {
  if (isClosing) return
  isClosing = true
  try {
    await DB.pool.end()
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
  console.log(`Express server ${serverId} is running on port ${sitePort}`)
})
