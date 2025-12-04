# fragments-ui

A web-based testing interface for the Fragments microservice API. This single-page application (SPA) allows authenticated users to create, view, and manage text and JSON fragments.

## Features

- **User Authentication**: Integration with AWS Cognito for secure user authentication via OAuth 2.0
- **Create Fragments**: Support for creating multiple fragment types:
  - `text/plain` - Plain text
  - `text/markdown` - Markdown content
  - `text/html` - HTML content
  - `text/csv` - CSV data
  - `application/json` - JSON data
- **View Fragments**: Display all user fragments with complete metadata including:
  - Fragment ID
  - Content type
  - Size in bytes
  - Creation timestamp
  - Last updated timestamp
  - Owner ID
- **Real-time Updates**: Automatically refreshes fragment list after creation
- **Response Display**: Shows complete API responses including HTTP status codes and Location headers

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: Parcel bundler
- **Authentication**: oidc-client-ts library
- **Styling**: Bamboo.css (minimal CSS framework)
- **Production Server**: nginx (Alpine Linux)
- **Containerization**: Docker with multi-stage builds

## Project Structure

```
fragments-ui/
├── src/
│   ├── index.html       # Main HTML page
│   ├── app.js          # Application logic
│   ├── auth.js         # Authentication handling
│   └── api.js          # API calls to fragments service
├── Dockerfile          # Multi-stage Docker build
├── .dockerignore       # Docker ignore rules
├── nginx.conf          # nginx configuration
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker (for containerization)
- AWS Cognito User Pool configured
- Fragments API server running

## Environment Configuration

The application uses the following environment variables (with fallback defaults):

```bash
# AWS Cognito Configuration
AWS_COGNITO_POOL_ID=us-east-1_09DPjH0Gn
AWS_COGNITO_CLIENT_ID=2gr73fhi7aogfoobcb8cjkrsgm
OAUTH_SIGN_IN_REDIRECT_URL=http://localhost:1234

# API Server URL
API_URL=http://ec2-52-90-0-163.compute-1.amazonaws.com:8080
```

## Local Development

### Installation

```bash
# Clone the repository
git clone https://github.com/AshtonSeneca/fragments-ui.git
cd fragments-ui

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server (uses Parcel)
npm start
```

The application will be available at `http://localhost:1234`

### Building for Production

```bash
# Build static files
npm run build
```

The production files will be output to the `dist/` directory.

## Docker Deployment

### Building the Docker Image

The Dockerfile uses a multi-stage build:
1. **Stage 1**: Builds the static site using Node.js and Parcel
2. **Stage 2**: Serves the static files using nginx (Alpine Linux)

```bash
# Build the Docker image
docker build -t fragments-ui:latest .

# Or tag for Docker Hub
docker build -t <your-dockerhub-username>/fragments-ui:latest .
```

### Running the Docker Container

```bash
# Run locally
docker run -d -p 8080:80 --name fragments-ui fragments-ui:latest

# Run with environment variables
docker run -d -p 8080:80 \
  -e API_URL=http://your-api-server:8080 \
  --name fragments-ui \
  fragments-ui:latest
```

Access the application at `http://localhost:8080`

### Pushing to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag fragments-ui:latest <your-username>/fragments-ui:latest

# Push to Docker Hub
docker push <your-username>/fragments-ui:latest
```

## Usage

### 1. Login

Click the "Login" button to authenticate via AWS Cognito. You'll be redirected to the Cognito Hosted UI for authentication.

### 2. View Existing Fragments

After login, click "Get All Fragments" to retrieve and display all your fragments with complete metadata.

### 3. Create New Fragments

1. Select the fragment type from the dropdown
2. Enter your content in the textarea
3. Click "Create Fragment"
4. The result will show:
   - HTTP status code (201 Created)
   - Location header with fragment URL
   - Complete fragment metadata
5. The fragments list will automatically refresh

### Example: Creating a JSON Fragment

```json
{
  "title": "Test Fragment",
  "description": "This is a test JSON fragment",
  "timestamp": "2025-12-01T00:00:00Z"
}
```

### Example: Creating a Markdown Fragment

```markdown
# My Markdown Fragment

This is a **test** markdown fragment with:
- Item 1
- Item 2
- Item 3
```

## API Integration

The application interacts with the following Fragments API endpoints:

- `GET /v1/fragments?expand=1` - Get all fragments with metadata
- `POST /v1/fragments` - Create a new fragment
- `GET /v1/fragments/:id/info` - Get fragment metadata
- `GET /v1/fragments/:id` - Get fragment data

All requests include the Bearer token from Cognito in the Authorization header.

## Docker Best Practices Implemented

- ✅ Multi-stage build to minimize final image size
- ✅ Alpine Linux base images for smaller footprint
- ✅ `.dockerignore` to exclude unnecessary files
- ✅ Layer caching optimization (dependencies before source)
- ✅ Non-root user execution (nginx default)
- ✅ Health check endpoint
- ✅ Production-optimized nginx configuration
- ✅ Gzip compression enabled
- ✅ Static asset caching

## Troubleshooting

### Login Issues

- Verify AWS Cognito configuration in `src/auth.js`
- Check that redirect URL matches Cognito app client settings
- Ensure browser allows third-party cookies

### API Connection Issues

- Verify `API_URL` points to the correct Fragments API server
- Check that the API server is running and accessible
- Review browser console for CORS or network errors
- Ensure API server has CORS configured to allow your domain

### Docker Build Issues

- Ensure you have enough disk space
- Try clearing Docker cache: `docker system prune -a`
- Verify Node.js version compatibility

## Security Considerations

- Authentication tokens are stored in browser localStorage
- All API requests use HTTPS in production (HTTP in development)
- CORS is configured on the API server
- Sensitive configuration should use environment variables

## Assignment Compliance

This project meets the requirements for Assignment 2:

- ✅ Dockerfile with multi-stage build
- ✅ `.dockerignore` file present
- ✅ Final stage uses nginx (not Node.js)
- ✅ Docker image can be built and pushed to Docker Hub
- ✅ Support for creating text/* and application/json fragments
- ✅ Fragment type selection (dropdown)
- ✅ Display all fragments with complete metadata after login
- ✅ Shows Location header in response
- ✅ Functional testing interface (not production-polished)

## Author

Ashton Miguelle Mendoza

## License

UNLICENSED - Educational purposes only
