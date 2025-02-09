import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // from dockerfile
}

export default withPayload(nextConfig)
