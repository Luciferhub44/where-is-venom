/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apple Pay domain verification file (see public/.well-known/) —
        // extensionless static files default to application/octet-stream,
        // Apple's verifier expects text/plain.
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
    ];
  },
};

module.exports = nextConfig;
