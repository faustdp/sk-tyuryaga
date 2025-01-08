// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { APIError, buildConfig, type Payload, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { type Task } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  /*   hooks: {
    afterError: [async ({ error }) => {
      BugSnag report
    }]
  }, */
  admin: {
    user: 'admins',
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      afterNavLinks: [{ path: 'src/components/AnalyticsLink.tsx' }],
      afterDashboard: [{ path: 'src/components/AnalyticsLink.tsx' }],
      views: {
        Analytics: {
          Component: 'src/components/Analytics',
          path: '/analytics',
        },
      },
    },
  },
  collections: [
    {
      slug: 'admins',
      admin: { useAsTitle: 'email' },
      auth: true,
      fields: [],
    },
    {
      slug: 'users',
      admin: { useAsTitle: 'first_name', pagination: { defaultLimit: 100 } },
      fields: [
        { name: 'tg_id', type: 'number', required: true, unique: true, index: true },
        { name: 'first_name', type: 'text', required: true, unique: true, maxLength: 100 },
        { name: 'username', type: 'text', maxLength: 32 },
        { name: 'language', type: 'text', maxLength: 5 },
        { name: 'farmed_amount', type: 'number', defaultValue: 0 },
        { name: 'farmed_time', type: 'number', defaultValue: 0 },
        { name: 'created_at', type: 'date', required: true, defaultValue: new Date() },
        { name: 'last_visit', type: 'date', defaultValue: new Date() },
        {
          name: 'invited_by',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
        },
        { name: 'invites', type: 'number', required: true, defaultValue: 0 },
        { name: 'farm_cigs', type: 'number', required: true, defaultValue: 0 },
        { name: 'ref_cigs', type: 'number', required: true, defaultValue: 0 },
        {
          name: 'end_time',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        {
          name: 'claim_friends',
          type: 'date',
          required: true,
          defaultValue: new Date(Date.now() + 24 * 60 * 60 * 1000),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        { name: 'activity_days', type: 'number', required: true, defaultValue: 0 },
        { name: 'bonuses', type: 'json', defaultValue: [] },
        {
          name: 'selected_images',
          type: 'json',
          defaultValue: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        },
        { name: 'level', type: 'number', required: true, defaultValue: 0, min: 0, max: 9 },
      ],
      timestamps: false,
    },
    {
      slug: 'invites',
      fields: [
        {
          name: 'inviter',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'invitee',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
    {
      slug: 'tasks',
      fields: [
        { name: 'type', type: 'select', required: true, options: ['invite', 'code', 'subscribe'] },
        { name: 'reward', type: 'number', required: true },
        {
          name: 'icon',
          type: 'group',
          fields: [
            {
              name: 'iconType',
              type: 'radio',
              options: [
                { label: 'Predefined', value: 'predefined' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'predefined',
              required: true,
            },
            {
              name: 'icon_name',
              type: 'select',
              options: [
                { label: 'Instagram', value: 'inst' },
                { label: 'Telegram', value: 'tg' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'VK', value: 'vk' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Discord', value: 'discord' },
              ],
              required: true,
              admin: { condition: (_, siblingData) => siblingData?.iconType === 'predefined' },
            },
            {
              name: 'icon_url',
              type: 'text',
              maxLength: 1024,
              required: true,
              admin: { condition: (_, siblingData) => siblingData?.iconType === 'custom' },
            },
          ],
          admin: { description: 'Select an icon or enter a custom URL' },
        },
        { name: 'name', type: 'text', required: true },
        { name: 'link', type: 'text', maxLength: 1024 },
        { name: 'language', type: 'text', maxLength: 5 },
        { name: 'activity', type: 'number' },
        { name: 'active', type: 'checkbox', defaultValue: true },
        { name: 'position', type: 'number', defaultValue: 1 },
        {
          name: 'delay',
          type: 'number',
          admin: { condition: (data) => data.type === 'subscribe' },
        },
        { name: 'invites', type: 'number', admin: { condition: (data) => data.type === 'invite' } },
        { name: 'codes', type: 'json', admin: { condition: (data) => data.type === 'code' } },
      ],
      hooks: {
        afterChange: [
          async ({ doc, req, operation }) => {
            if (operation !== 'create') return
            createUserTasks(req.payload, doc, req)
            return
          },
        ],
        beforeChange: [
          ({ data }) => {
            if (data.type === 'invite' && !data.invites) {
              return Promise.reject(new APIError('Invites required for invite type tasks', 400))
            }
            if (data.type === 'code' && !data.codes) {
              return Promise.reject(new APIError('Codes required for code type tasks', 400))
            }
            if ((data.type === 'code' || data.type === 'subscribe') && !isValidUrl(data.link)) {
              return Promise.reject(new APIError('Provide valid Link for this type of task', 400))
            }
            return Promise.resolve(data)
          },
        ],
        beforeDelete: [
          async ({ req, id }) => {
            const payload = req.payload
            const relatedDocs = await payload.find({
              collection: 'user_tasks',
              where: {
                task_id: {
                  equals: id,
                },
              },
            })
            const deletePromises = relatedDocs.docs.map((doc) =>
              payload.delete({
                collection: 'user_tasks',
                id: doc.id,
              }),
            )
            await Promise.all(deletePromises)
          },
        ],
      },
    },
    {
      slug: 'user_tasks',
      fields: [
        {
          name: 'user_id',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'task_id',
          type: 'relationship',
          relationTo: 'tasks',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: ['start', 'check', 'claim', 'done'],
          defaultValue: 'start',
        },
        {
          name: 'codes',
          type: 'json',
          defaultValue: [],
        },
        { name: 'codes_amount', type: 'number' },
      ],
    },
    {
      slug: 'wallets',
      fields: [
        {
          name: 'user_id',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        { name: 'address', type: 'text', required: true, unique: true, maxLength: 80 },
        { name: 'created_at', type: 'date', defaultValue: new Date() },
        {
          name: 'last_connect',
          type: 'date',
          required: true,
          defaultValue: new Date(),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
      ],
    },
    {
      slug: 'messages',
      fields: [
        { name: 'text', type: 'textarea', required: true },
        { name: 'photo_url', type: 'text', maxLength: 1024 },
        { name: 'buttons', type: 'json' },
        { name: 'created_at', type: 'date', defaultValue: new Date() },
      ],
    },
    {
      slug: 'media',
      access: { read: () => true },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
      upload: true,
      admin: { hidden: true },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  graphQL: { disable: true },
  sharp,
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'en',
    translations: { ru },
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})

async function createUserTasks(payload: Payload, doc: Task, req: PayloadRequest) {
  let page = 1
  let hasMoreUsers = true
  const limit = 100
  await new Promise((resolve) => setTimeout(resolve, 2000))
  try {
    while (hasMoreUsers) {
      const users = await payload.find({
        collection: 'users',
        limit,
        page,
        where: {
          and: [
            ...(doc.language ? [{ language: { equals: doc.language } }] : []),
            ...(doc.activity
              ? [
                  {
                    last_visit: {
                      [doc.activity > 0 ? 'greater_than' : 'less_than']: new Date(
                        Date.now() - Math.abs(doc.activity) * 24 * 60 * 60 * 1000,
                      ).toISOString(),
                    },
                  },
                ]
              : []),
          ],
        },
      })
      const userTaskPromises = users.docs.map((user) => {
        return payload.create({
          collection: 'user_tasks',
          data: {
            user_id: user.id,
            task_id: doc.id,
            status: 'start',
            ...(doc.type === 'code' && { codes: [] }),
            ...(doc.type === 'code' &&
              doc.codes && { codes_amount: (doc.codes as string[]).length }),
          },
          req,
        })
      })
      await Promise.all(userTaskPromises)
      hasMoreUsers = users.hasNextPage
      page++
    }
  } catch (error) {
    console.log('payload.config53', error)
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
