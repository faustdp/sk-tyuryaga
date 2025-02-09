import cors from 'cors'
import { config } from 'dotenv'
import express, { Router } from 'express'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

import botHandler from './server/bot'
import { apiPaths, bugSnagMiddleware, serverId, setupBot, sitePort, siteUrl } from './server/config'
import * as DB from './server/db'
import {
  handleCheckCode,
  handleCheckSubscription,
  handleGetFriends,
  handleSetAddress,
  handleSSE,
  handleTaskStatus,
  setAddBonus,
  setClaimFriends,
  setEndTime,
  setFarmCigs,
  setSelectImage,
} from './server/handlers'
import { meHandler } from './server/me'

config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' })

const dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({ origin: siteUrl }))

if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.enable('trust proxy')

if (process.env.NODE_ENV === 'production') {
  app.use(bugSnagMiddleware.requestHandler)
}

const router = Router()

router.get(apiPaths.healthPath, (_req, res) => {
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

router.get(apiPaths.ssePath, (req, res) => {
  handleSSE(req, res)
})

if (process.env.NODE_ENV !== 'production') {
  router.post('/test', (req) => {
    console.log('fromFront:', req.body)
  })
}

app.use(apiPaths.apiPath, router)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(dirname, 'build')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(dirname, 'build', 'index.html'))
  })
  app.use(bugSnagMiddleware.errorHandler)
}

setupBot()

// app.use(webhookCallback(bot, "express")) webhookcb from grammy

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
