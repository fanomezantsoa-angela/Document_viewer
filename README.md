 ## Requirements
 Before cloning the application, make sure you have installed:
 - NodeJs
 (Here is the link for the installation: [Node.js](https://nodejs.org/en))
 - Npm
  (Here is the link for the installation: [npm](https://www.npmjs.com/))
 - Git
  (Here is the link for the installation: [Git](https://git-scm.com/))


 ## Application cloning

```bash
git clone https://github.com/fanomezantsoa-angela/Document_viewer.git
```
# DocViewer

DocViewer is a document intelligence workspace made of three connected applications:

- a backend API that accepts uploads and tracks document processing
- a Next.js document viewer that opens files, extracts text, highlights entities, and supports privacy modes
- a Vite-based dashboard that shows processing metrics and activity using mock data

The goal of the project is to help users inspect documents faster, detect sensitive information, and visualize document-processing activity in one place.

## What the project does

DocViewer is designed to:

- upload and process documents from the backend
- extract text from supported document types
- detect useful entities such as names, dates, amounts, and medical terms
- display document content in multiple modes, including full, redacted, and summary views
- preview PDF, text, markdown, and image-based documents
- show dashboard charts and activity panels for document-processing analytics(mock data for now)

## Problem it solves

Manually reviewing documents is slow and error-prone. DocViewer reduces that work by:

- centralizing document upload, viewing, and analysis
- highlighting relevant information automatically
- helping users redact sensitive content quickly
- providing structured output that can be inspected or reused downstream
- giving teams a lightweight dashboard for tracking processing behavior

## Architecture

The repository is organized as a small monorepo with three apps.

### 1. Backend API

Path: [backend/](backend)

Technology:

- Express
- TypeScript
- Multer for multipart file uploads
- CORS

Responsibilities:

- receives file uploads at `/api/upload`
- stores upload state in memory
- simulates asynchronous processing and progress updates
- exposes processing status at `/api/status/:id`
- exposes final extraction results at `/api/results/:id`

Notes:

- the current backend uses an in-memory `Map`, so data is lost when the server restarts
- the processing flow is simulated in the current codebase and is meant to be replaced by real extraction logic later

### 2. Document Viewer

Path: [Doc_viewer/Document_Viewer/](Doc_viewer/Document_Viewer)

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS
- PDF.js
- Tesseract.js
- React Markdown
- Zustand
- MUI

Responsibilities:

- loads demo documents and viewer pages
- renders PDFs, images, markdown, and plain text
- extracts and highlights entities from document text
- supports privacy controls such as full, redacted, and summary views
- uses local state to control document selection and viewer behavior

### 3. Dashboard

Path: [Doc_viewer/app-Dashboard/](Doc_viewer/app-Dashboard)

Technology:

- Vite
- React
- TypeScript
- MUI
- Recharts
- Tailwind CSS

Responsibilities:

- shows processing statistics
- shows model performance panels
- shows activity tracking
- currently reads mock data from `public/MockData/`

## Data flow

1. A user uploads a file to the backend.
2. The backend creates an upload record and simulates processing.
3. The status endpoint returns progress and entity counts.
4. The results endpoint returns extracted text and entities when processing is complete.
5. The document viewer renders the content and applies highlighting or redaction.
6. The dashboard visualizes related metrics and activity.

## Dependencies

### Backend dependencies

- `express` - HTTP server and routing
- `cors` - cross-origin requests from the frontends
- `multer` - multipart file upload handling
- `uuid` - upload record IDs

Development dependencies include TypeScript, `ts-node-dev`, and the matching type packages.

### Document Viewer dependencies

- `next` - application framework
- `react` and `react-dom` - UI runtime
- `pdfjs-dist` - PDF text extraction and rendering support
- `react-pdf` - PDF viewer integration
- `tesseract.js` - OCR for image-based documents
- `react-markdown` and `remark-gfm` - markdown rendering
- `zustand` - lightweight state management
- `@mui/material` and `@mui/icons-material` - UI components and icons
- `framer-motion` - motion effects
- `pdf-lib` and `@react-pdf/renderer` - PDF handling and generation support
- `tailwindcss` and `@tailwindcss/postcss` - styling

### Dashboard dependencies

- `react` and `react-dom` - UI runtime
- `vite` - development server and build tool
- `@mui/material` and `@mui/icons-material` - UI components and icons
- `recharts` - charts and graphs
- `tailwindcss` - styling

## Requirements

- Node.js 18 or newer is recommended
- npm

## Installation

Install dependencies for each app separately.

### Backend

```bash
cd backend
npm install
```

### Document Viewer

```bash
cd Doc_viewer/Document_Viewer
npm install
```

### Dashboard

```bash
cd Doc_viewer/app-Dashboard
npm install
```

## How to start the project

Open three terminals, one for each app.

### 1. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:4000` by default.

### 2. Start the Document Viewer

```bash
cd Doc_viewer/Document_Viewer
npm run dev
```

The Next.js app runs on `http://localhost:3000` by default.

### 3. Start the Dashboard

```bash
cd Doc_viewer/app-Dashboard
npm run dev
```

Inside the Document_Viewer project as a frame.




## Notes

- The backend currently stores uploads in memory, so restarting it clears data.
- The dashboard currently uses mock JSON files, not live backend data.
- Some document-processing behavior in the viewer is implemented client-side for local previews and demos.
