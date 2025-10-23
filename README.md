# SinemaAgain

SinemaAgain is a modern Next.js application that integrates with The Movie Database (TMDB) API to deliver a seamless movie browsing experience. This project follows best practices in development and continuous integration using GitHub Actions.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Continuous Integration](#continuous-integration)
- [Building & Deployment](#building--deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Learn More](#learn-more)

## Features

- **Next.js Framework:** Server-side rendering and static site generation for performance.
- **TMDB API Integration:** Fetch movie data using TMDB’s API.
- **CI/CD Pipeline:** Automated testing and deployment via GitHub Actions.
- **Responsive UI:** Modern, adaptive design for a seamless user experience.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Phani2603/SinemaAgain.git
cd SinemaAgain
npm ci
```

## Development

Run the development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000). The application will automatically reload if you make any edits.

## Environment Variables

Create a `.env.local` file in the project root to configure your TMDB API keys. For example:

```dotenv
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_v3_api_key_here
NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN=your_tmdb_v4_read_access_token_here
```

**Note:**  
- The `NEXT_PUBLIC_TMDB_API_KEY` is intended for client-side use.
- The `NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN` is meant to be used as a bearer token if needed.
- If you are using GitHub Actions, ensure the corresponding secrets are added in your repository settings with the exact names.

## Continuous Integration

SinemaAgain uses GitHub Actions for continuous integration. The CI workflow is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and includes these steps:

- **Checkout:** Retrieves your repository.
- **Node.js Setup:** Configures the correct Node.js version (v20).
- **Dependencies:** Installs dependencies with `npm ci`.
- **Linting:** Validates code quality using ESLint.
- **Build:** Creates a production-ready build.

The workflow triggers on push or pull requests for the `master` and `APlintegrated` branches. Make sure your commits are on one of these branches to initiate CI.

## Building & Deployment

To create an optimized production build:

```bash
npm run build
```

Start the production server with:

```bash
npm start
```

The recommended deployment platform is [Vercel](https://vercel.com) for its seamless integration with Next.js. For more deployment details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Project Structure

A brief overview of the project structure:

```
SinemaAgain/
├── .github/
│   └── workflows/
│       └── ci.yml         # Continuous Integration configuration
├── public/                # Static files, images, etc.
├── src/
│   ├── components/        # React components and UI elements
│   ├── lib/               # API utilities (e.g., TMDB integration)
│   └── pages/             # Next.js pages and routes
├── .env.local             # Local environment variables (ignored by Git)
├── package.json           # Project configuration and scripts
└── README.md              # This file
```

## Contributing

Contributions are welcome! If you find an issue or want to add a feature, please open an issue or submit a pull request. Follow the standard GitHub flow:

1. Fork the repository.
2. Create a new branch (`feature/my-feature`).
3. Commit your changes.
4. Open a pull request against the main branch.

## License

This project is licensed under the [MIT License](LICENSE).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – Explore Next.js features.
- [TMDB API Documentation](https://developers.themoviedb.org/3) – Learn about the TMDB API.
- [GitHub Actions Documentation](https://docs.github.com/en/actions) – Configure CI/CD with GitHub Actions.

---

For questions or support, please open an issue on GitHub.

Happy coding!
