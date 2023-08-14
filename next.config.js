/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	redirects: async () => {
		return [
			{
				source: "/",
				destination: "/login",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
