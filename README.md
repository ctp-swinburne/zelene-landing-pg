# Zelene Platform

Zelene is an integrated community platform for smart city lighting management that enables collaboration between city managers, engineers, and residents. It combines powerful IoT capabilities with social features to create a more engaged and efficient urban lighting ecosystem.

## Features

### Community Engagement

- Discussion forums for sharing insights about city lighting
- Real-time chat for operational coordination
- Community polls and surveys for gathering resident feedback
- Knowledge sharing hub for best practices
- Event organization tools for maintenance scheduling

### IoT Integration

- Real-time monitoring of city light infrastructure
- Group-based device management and control
- Energy consumption analytics and reporting
- Automated alert system for maintenance issues
- Interactive map visualization of lighting infrastructure

### Security & Authentication

- OAuth 2.0 authentication with multiple providers:
  - Google
  - Discord
  - GitHub
  - Email/Password
- Role-based access control
- End-to-end encryption for sensitive data
- Secure API endpoints with rate limiting

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: tRPC, Prisma, PostgreSQL
- **Authentication**: NextAuth.js
- **IoT Communication**: MQTT, AWS IoT Core
- **Real-time Features**: WebSocket
- **Cloud Infrastructure**: AWS

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/ctpa-swinburne/zelene-platform.git
cd zelene-platform
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Configure your environment variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_ID="..."
GOOGLE_SECRET="..."
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# AWS Configuration
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
```

5. Run database migrations

```bash
npx prisma migrate dev
```

6. Start the development server

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

For security concerns, please contact our security team at security@zelene-platform.com. Do not create public issues for security vulnerabilities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to Viettel 5G & IoT Innovation Lab for device support
- City infrastructure management teams for their valuable feedback
- The open-source community for their continuous contributions

## Contact

For support or inquiries, reach out to:

- Email: support@zelene-platform.com
- Website: https://zelene-platform.com
- Community Forum: https://community.zelene-platform.com
