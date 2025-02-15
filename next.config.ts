import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "i.ibb.co.com",
			},
			{
				protocol: "https",
				hostname: "ibb.co.com",
			},
		],
	},
};

export default nextConfig;
