# Codex Agents Documentation

This documentation provides setup instructions and code style conventions for agents managing this repository, an Eleventy static site generator integrated with Contentful as its data source.

## Setup Steps

To set up and run the project locally, follow these steps:

### 1. Install Dependencies

Ensure Node.js version 20 or higher is installed.

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment variables file and populate it with your Contentful credentials:

```bash
cp .env.example .env
```

Make sure your `.env` file includes the following:

```env
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=master
```

### 3. Build and Run the Project

To build the static site:

```bash
npm run build
```

To start the development server:

```bash
npm run start
```

## Templating

The project uses Nunjucks for templating. Ensure any template tags or logic implemented follow the Nunjucks templating standard and syntax.

## Code Style Conventions

Maintain consistency in code style by adhering to these guidelines:

- **Node Version:** 20+
- **JavaScript Modules:** Use ES Modules (`import/export` syntax).
- **Quotes:** Use single quotes (`'`) for strings.
- **Indentation:** Two spaces per indentation level.
- **Newlines:** Ensure a newline at the end of each file.

Following these conventions helps maintain readability and consistency across the project.
