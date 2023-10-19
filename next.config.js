const IS_DEV = process.env.NODE_ENV === "development"

const API_URL = IS_DEV ? "http://localhost:4242/api/v1" : "https://raveapi.foxovh.me/api/v1"
const WS_URL  = IS_DEV ? "ws://localhost:4040" : "wss://ravews.foxovh.me"

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ['@vime/react'],
    env: {
        API_URL,
        WS_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4242',
                pathname: '/api/**',
            },
            {

                protocol: 'https',
                hostname: 'raveapi.getnitro.store',
                port: '',
                pathname: '/api/**'
            }
        ],
    }
}

module.exports = nextConfig