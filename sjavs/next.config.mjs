/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/sjavs/app', 
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;
  