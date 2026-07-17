# WebToCorpus

WebToCorpus is a web application that converts static web pages into plain text, Markdown, or JSON formats. The project is structured as a monorepo containing a React/Vite frontend and a Go backend configured for deployment as serverless functions.

---

## Features

- **Format Conversion:** Parses static HTML web pages and outputs the extracted text into Markdown, JSON, or Plain Text formats.
- **SSRF Protection:** The Go backend validates all user-submitted URLs prior to data retrieval. It restricts inputs to HTTP/HTTPS schemes and blocks requests targeting loopback addresses (`localhost`, `127.0.0.1`) or internal private networks.
- **Content Sanitization:** The HTML parser (`goquery`) automatically strips scripts, stylesheets, and iframe tags (`<script>`, `<iframe>`, `<style>`, `<object>`, `<svg>`, and `<noscript>`) during DOM extraction to prevent script injection.
- **CORS Configuration:** The backend applies specific Cross-Origin Resource Sharing (CORS) headers to restrict API access to authorized domains.

---

## Technical Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Go (Golang), `goquery`, `html-to-markdown`

---

## Getting Started

### Prerequisites

- Node.js
- Go

### Local Frontend Development

To install dependencies and start the local development server:

```bash
cd frontend
npm install
npm run dev
```

### Building the Frontend

To compile the frontend assets for production:

```bash
cd frontend
npm run build
```

### Running Backend Tests

To execute the Go backend unit tests:

```bash
cd api
go test ./...
```
