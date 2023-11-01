/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['three'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
