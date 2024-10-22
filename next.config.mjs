/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'static.vecteezy.com',
        protocol: 'https',
        port: '',
        pathname:
          '/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'i.pinimg.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'firebasestorage.googleapis.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'encrypted-tbn0.gstatic.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
