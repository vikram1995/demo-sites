/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // better-sqlite3 is a native module and must not be bundled by webpack;
    // keep it external so Node loads the compiled binary at runtime.
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
