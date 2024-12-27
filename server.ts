import './server/db'

import cors from 'cors'
import express, { Router } from 'express'

// import { handler } from './build/handler.js'
// import path from 'path'
// import { fileURLToPath } from 'url'
import botHandler from './server/bot'
import {
  addBonusPath,
  apiPath,
  botPath,
  checkCodePath,
  checkSubscriptionPath,
  claimFriendsPath,
  endTimePath,
  farmCigsPath,
  getFriendsPath,
  healthPath,
  mePath,
  selectImagePath,
  setAddressPath,
  setupBot,
  sitePort,
  siteUrl,
  taskStatusPath,
} from './server/config'
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

router.get(healthPath, (req, res) => {
  res.status(200).send('OK')
})

router.post(mePath, (req, res) => {
  meHandler(req, res)
})

router.post(botPath, (req, res) => {
  botHandler(req, res)
})

router.post(endTimePath, (req, res) => {
  setEndTime(req, res)
})

router.post(farmCigsPath, (req, res) => {
  setFarmCigs(req, res)
})

router.post(addBonusPath, (req, res) => {
  setAddBonus(req, res)
})

router.post(claimFriendsPath, (req, res) => {
  setClaimFriends(req, res)
})

router.post(selectImagePath, (req, res) => {
  setSelectImage(req, res)
})

router.post(setAddressPath, (req, res) => {
  handleSetAddress(req, res)
})

router.post(checkSubscriptionPath, (req, res) => {
  handleCheckSubscription(req, res)
})

router.post(checkCodePath, (req, res) => {
  handleCheckCode(req, res)
})

router.post(taskStatusPath, (req, res) => {
  handleTaskStatus(req, res)
})

router.post(getFriendsPath, (req, res) => {
  handleGetFriends(req, res)
})

router.post('/test', (req) => {
  console.log('fromFront:', req.body)
})

app.use(apiPath, router)

setupBot()

// app.use(webhookCallback(bot, "express")) webhookcb from grammy
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
