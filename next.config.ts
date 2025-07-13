import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_DOMAIN = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: SUPABASE_DOMAIN
      ? [
          {
            protocol: 'https',
            hostname: SUPABASE_DOMAIN,
            // pathname: '/**', // 필요시 전체 경로 허용
          },
        ]
      : [],
  },
};

export default nextConfig;
