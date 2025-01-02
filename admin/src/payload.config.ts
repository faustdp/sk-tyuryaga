// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// async function isTaskCode(taskId: number) {
//   const task = await payload.findByID({
//     collection: 'tasks',
//     id: taskId,
//   })
//   return task?.type === 'code'
// }

// async function getTaskCodesLength(taskId: number): Promise<number> {
//   const task = await payload.findByID({
//     collection: 'tasks',
//     id: taskId,
//   })
//   console.log('payload.config28', task)
//   const codes = typeof task?.codes === 'string' ? JSON.parse(task.codes) : task?.code
//   if (Array.isArray(codes)) {
//     return codes.length
//   }
//   if (typeof codes === 'object' && codes !== null) {
//     return Object.keys(codes).length
//   }
//   return 0
// }

export default buildConfig({
  admin: {
    user: 'admins',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'admins',
      admin: {
        useAsTitle: 'email',
      },
      auth: true,
      fields: [],
    },
    {
      slug: 'users',
      admin: {
        useAsTitle: 'first_name',
      },
      fields: [
        { name: 'tg_id', type: 'number', required: true, unique: true, index: true },
        { name: 'first_name', type: 'text', required: true, unique: true, maxLength: 100 },
        { name: 'username', type: 'text', maxLength: 32 },
        { name: 'language', type: 'text', maxLength: 5 },
        { name: 'farmed_amount', type: 'number', defaultValue: 0 },
        { name: 'farmed_time', type: 'number', defaultValue: 0 },
        { name: 'created_at', type: 'date', required: true },
        { name: 'last_visit', type: 'date', defaultValue: new Date() },
        {
          name: 'invited_by',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
          filterOptions: {
            tg_id: { exists: true },
          },
        },
        { name: 'invites', type: 'number', required: true, defaultValue: 0 },
        { name: 'farm_cigs', type: 'number', required: true, defaultValue: 0 },
        { name: 'ref_cigs', type: 'number', required: true, defaultValue: 0 },
        { name: 'end_time', type: 'date' },
        {
          name: 'claim_friends',
          type: 'date',
          required: true,
          defaultValue: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        { name: 'activity_days', type: 'number', required: true, defaultValue: 0 },
        {
          name: 'bonuses',
          type: 'json',
          // fields: [
          //   {
          //     name: 'value',
          //     type: 'number',
          //   },
          // ],
          defaultValue: [],
        },
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
      // hooks: {
      //   beforeValidate: [
      //     async ({ data, operation }) => {
      //       if (operation === 'create' && data) {
      //         if (!data.invitee) {
      //           throw new Error('invitee cannot be NULL')
      //         }
      //         if (!data.inviter) {
      //           throw new Error('inviter cannot be NULL')
      //         }
      //       }
      //       return data
      //     },
      //   ],
      // },
    },
    {
      slug: 'tasks',
      fields: [
        { name: 'type', type: 'select', required: true, options: ['invite', 'code', 'subscribe'] },
        { name: 'position', type: 'number' },
        { name: 'reward', type: 'number', required: true },
        { name: 'icon', type: 'text', required: true, maxLength: 1024 },
        { name: 'link', type: 'text', maxLength: 1024 },
        { name: 'active', type: 'checkbox', defaultValue: true },
        { name: 'language', type: 'text', maxLength: 5 },
        {
          name: 'delay',
          type: 'number',
          admin: {
            condition: (data) => data.type === 'subscribe',
          },
        },
        {
          name: 'invites',
          type: 'number',
          admin: {
            condition: (data) => data.type === 'invite',
          },
        },
        {
          name: 'codes',
          type: 'json',
          admin: {
            condition: (data) => data.type === 'code',
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.type === 'invite' && !data.invites) {
              throw new Error('Invites required for invite type tasks')
            }
            if (data.type === 'code' && !data.codes) {
              throw new Error('Codes required for code type tasks')
            }
            if (data.type === 'subscribe' && !data.delay) {
              throw new Error('Delay required for subscribe type tasks')
            }
            return data
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
        {
          name: 'codes_amount',
          type: 'number',
          // admin: {
          //   readOnly: true,
          // },
          // hooks: {
          //   beforeChange: [
          //     async ({ data }) => {
          //       if (data && data.task_id) {
          //         const codesLength = await getTaskCodesLength(data.task_id)
          //         return codesLength
          //       }
          //       return 0
          //     },
          //   ],
          // },
        },
      ],
      // hooks: {
      //   beforeChange: [
      //     async ({ data }) => {
      //       const isCodeTask = await isTaskCode(data.task)
      //       if (isCodeTask && !data.codes) {
      //         data.codes = []
      //       }
      //     },
      //   ],
      // },
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
        { name: 'last_connect', type: 'date', required: true, defaultValue: new Date() },
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
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
      upload: true,
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'en',
    translations: {
      ru,
    },
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
