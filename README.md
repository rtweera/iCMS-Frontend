# iCMS Frontend

Angular frontend for iCMS analytics, including call, email, social media, dashboard, authentication, and app settings modules.

## Tech Stack

- Angular 17
- TypeScript
- SCSS
- PrimeNG / Angular Material
- Chart.js / ECharts
- AWS Cognito integration

## Prerequisites

- Node.js 20.x (recommended: `v20.11.0`)
- npm 10+
- Angular CLI 17 (`npm install -g @angular/cli`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-org-or-user>/iCMS-Frontend.git
   cd iCMS-Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm start
   ```
4. Open `http://localhost:4200`.

## Available Scripts

- `npm start` - Run dev server.
- `npm run build` - Production build.
- `npm run watch` - Development build in watch mode.
- `npm test` - Run unit tests with Karma.

## Application Modules

Main routes are configured in `src/app/app-routing.module.ts`.

- `auth` - Authentication flows
- `call` - Call analytics
- `email` - Email analytics
- `social-media` - Social media analytics
- `main-dashboard` - Main dashboard
- `app-settings` - App settings and management pages

## Project Structure

```text
src/
  app/
    auth/
    call-analytics/
    email-analytics/
    social-media-analytics/
    main-dashboard/
    app-settings/
    shared/
  assets/
  environment/
```

## Environment Configuration

Environment settings are in:

- `src/environment/environment.ts`

Update environment values (for example Cognito and backend API URL) per deployment target.

## Build and Deployment

### Docker (Production)

Build and run:

```bash
docker build -t icms-frontend -f Dockerfile .
docker run -p 80:80 icms-frontend
```

The production image builds the Angular app and serves static files with Nginx.

### Docker (Development)

```bash
docker build -t icms-frontend-dev -f Dockerfile.dev .
docker run -p 4200:4200 icms-frontend-dev
```

### Kubernetes

An example deployment file is provided at:

- `deployment-file.yaml`

Adjust image name, app labels, and deployment metadata before applying.

## Notes

- `npm test` currently fails in this repository due to existing test/configuration issues (for example missing `gauge-chart-facebook.component` import target and test asset/polyfill path issues).
- Production build may show budget/CommonJS warnings; review and tune if strict CI thresholds are required.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run build/tests as applicable.
4. Open a pull request with a clear summary.
