# SinemaAgain

SinemaAgain is a Next.js application built with modern best practices and continuous integration setup using GitHub Actions. This project integrates with The Movie Database (TMDB) API.

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Continuous Integration](#continuous-integration)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Learn More](#learn-more)

## Getting Started

To get started with the project, clone the repository:

```bash
git clone https://github.com/Phani2603/SinemaAgain.git
cd SinemaAgain
```

Install dependencies using your package manager:

```bash
npm ci
# or
yarn install
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) to view the app. The page will reload when you make changes.

## Environment Variables

Create a `.env.local` file in the root of the project and add the following variables:

```dotenv
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_v3_api_key_here
NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN=your_tmdb_v4_read_access_token_here
```

> **Note:** If you are using GitHub Actions for CI, make sure the corresponding secrets are set in your repository settings with the correct names.

## Continuous Integration

This project uses GitHub Actions for CI. The workflow is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and performs the following tasks:
- Checks out the code
- Sets up Node.js (v20)
- Installs dependencies using `npm ci`
- Lints the code
- Builds the application

The workflow triggers on pushes and pull requests to the `master` and `APlintegrated` branches.

## Building for Production

To create an optimized production build, run:

```bash
npm run build
```

You can then start your production server with:

```bash
npm start
```

## Deployment

The recommended deployment platform is [Vercel](https://vercel.com). For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

For more information about Next.js, take a look at these resources:

- [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) – an interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) – contributions and feedback are welcome!

---

For any questions, feel free to open an issue or reach out.

Happy coding!
