const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['localhost', 'mintyourpfp.xyz'],
  },
})
