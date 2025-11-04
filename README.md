# 🎬 Video Streaming Backend

A robust, production-ready backend service for video upload and HLS (HTTP Live Streaming) processing. This service automatically transcodes uploaded videos into multiple resolutions and generates adaptive streaming playlists for optimal playback across different devices and network conditions.

## ✨ Features

- 📤 **Video Upload** - Upload video files with multipart/form-data support
- 🎥 **Multi-Resolution Transcoding** - Automatically generates 6 different quality levels:
  - 1080p (Full HD)
  - 720p (HD)
  - 480p (SD)
  - 360p (Mobile)
  - 240p (Low bandwidth)
  - 144p (Ultra-low bandwidth)
- 📺 **HLS Streaming** - Generates master and variant playlists for adaptive streaming
- 🔍 **Request Correlation** - Track requests across the system with correlation IDs
- 📝 **Structured Logging** - Comprehensive logging with Winston and daily log rotation
- ✅ **Request Validation** - Zod-based schema validation for type-safe requests
- 🛡️ **Error Handling** - Centralized error handling with proper HTTP status codes
- 🚀 **TypeScript** - Fully typed codebase for better developer experience
- 🔄 **CORS Support** - Cross-origin resource sharing enabled

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Video Processing**: FFmpeg (fluent-ffmpeg)
- **File Upload**: Multer
- **Validation**: Zod
- **Logging**: Winston with daily-rotate-file
- **HTTP Status**: http-status-codes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **FFmpeg** - Required for video processing
  - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `choco install ffmpeg`
  - **macOS**: `brew install ffmpeg`
  - **Linux**: `sudo apt-get install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (CentOS/RHEL)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd video-streaming-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:

   ```env
   PORT=3001
   ENV=development
   APP_URL=http://localhost:3001
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the server**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## 📖 API Documentation

### Base URL

```
http://localhost:3001/api/v1
```

### Endpoints

#### 1. Upload Video

Upload a video file for processing and HLS generation.

**Endpoint**: `POST /api/v1/video/upload`

**Content-Type**: `multipart/form-data`

**Request Body**:

- `video` (file, required): The video file to upload

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Video Uploaded Successfully",
  "data": "http://localhost:3001/output/1762280092591/master.m3u8"
}
```

**Error Responses**:

- `400 Bad Request`: Video file is required or processing error
- `500 Internal Server Error`: Server error during processing

**Example using cURL**:

```bash
curl -X POST http://localhost:3001/api/v1/video/upload \
  -F "video=@/path/to/your/video.mp4"
```

**Example using JavaScript (Fetch)**:

```javascript
const formData = new FormData();
formData.append("video", fileInput.files[0]);

const response = await fetch("http://localhost:3001/api/v1/video/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.data); // Master playlist URL
```

#### 2. Health Check

Check if the server is running.

**Endpoint**: `GET /api/v1/ping`

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Pong",
  "data": null
}
```

### Static File Serving

Processed HLS files are served statically at:

```
http://localhost:3001/output/{timestamp}/master.m3u8
```

## 📁 Project Structure

```
video-streaming-backend/
├── src/                    # TypeScript source files
│   ├── config/            # Configuration files
│   │   ├── index.ts       # Server configuration
│   │   └── logger.config.ts # Winston logger setup
│   ├── controllers/       # Route controllers
│   │   ├── ping.controller.ts
│   │   └── video.controller.ts
│   ├── middlewares/       # Express middlewares
│   │   ├── correlation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── multer.middleware.ts
│   ├── routes/           # API routes
│   │   └── v1/
│   │       ├── index.routes.ts
│   │       ├── ping.routes.ts
│   │       └── video.routes.ts
│   ├── services/         # Business logic
│   │   └── video.service.ts
│   ├── utils/            # Utility functions
│   │   ├── api-error.ts
│   │   ├── api-response.ts
│   │   └── helpers/
│   └── validators/       # Zod validation schemas
│       └── index.ts
├── dist/                 # Compiled JavaScript (generated)
├── uploads/              # Temporary uploaded files
├── output/               # Processed HLS files
├── logs/                 # Application logs
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable  | Description                          | Default       |
| --------- | ------------------------------------ | ------------- |
| `PORT`    | Server port number                   | `3001`        |
| `ENV`     | Environment (development/production) | `development` |
| `APP_URL` | Base URL for generated video URLs    | -             |

### Video Processing Settings

The service processes videos into the following resolutions:

| Resolution | Dimensions | Bitrate  | Use Case               |
| ---------- | ---------- | -------- | ---------------------- |
| 1080p      | 1920×1080  | 5 Mbps   | High-quality streaming |
| 720p       | 1280×720   | 2.5 Mbps | Standard HD streaming  |
| 480p       | 854×480    | 1 Mbps   | Standard definition    |
| 360p       | 640×360    | 750 Kbps | Mobile devices         |
| 240p       | 426×240    | 400 Kbps | Low bandwidth          |
| 144p       | 256×144    | 150 Kbps | Ultra-low bandwidth    |

**Note**: These settings can be modified in `src/services/video.service.ts`.

## 📝 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload (nodemon)

## 🧪 Testing

After uploading a video, you can test the HLS playback using:

1. **VLC Media Player**: Open network stream and paste the master playlist URL
2. **HLS.js**: Use in a web player
3. **Video.js with HLS plugin**: For web integration

Example HLS player HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>HLS Player</title>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  </head>
  <body>
    <video id="video" controls></video>
    <script>
      const video = document.getElementById("video");
      const videoSrc =
        "http://localhost:3001/output/YOUR_TIMESTAMP/master.m3u8";

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      }
    </script>
  </body>
</html>
```

## 🔍 Logging

Logs are stored in the `logs/` directory with daily rotation:

- Format: `YYYY-MM-DD-app.log`
- Log levels: `error`, `warn`, `info`
- Includes correlation IDs for request tracking

## 🚨 Error Handling

The application uses a centralized error handling middleware that:

- Catches and formats Zod validation errors
- Handles custom API errors with appropriate status codes
- Provides structured error responses
- Logs all errors for debugging

Error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🔒 Security Considerations

- **File Upload Limits**: Configure in `multer.middleware.ts`
- **CORS**: Currently enabled for all origins (configure for production)
- **Input Validation**: All requests validated with Zod schemas
- **File Cleanup**: Original uploaded files are deleted after processing

## 📦 Dependencies

### Production Dependencies

- `express` - Web framework
- `fluent-ffmpeg` - FFmpeg wrapper for video processing
- `multer` - File upload handling
- `winston` - Logging library
- `zod` - Schema validation
- `cors` - CORS middleware
- `http-status-codes` - HTTP status code constants

### Development Dependencies

- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `nodemon` - Development auto-reload
- Type definitions for all dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 🙏 Acknowledgments

- [FFmpeg](https://ffmpeg.org/) - Powerful multimedia framework
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [HLS.js](https://github.com/video-dev/hls.js/) - JavaScript HLS client

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ for scalable video streaming**
