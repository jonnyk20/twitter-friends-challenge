/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withTM = require('next-transpile-modules')([
  '@emotion/react',
  '@emotion/styled',
  '@mui/material', 
  '@mui/icons-material'
]); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig)
