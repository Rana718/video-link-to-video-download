# YouTube Video Downloader

A web application to download YouTube videos by entering the URL and selecting the desired video quality. The frontend is built with React, Vite, and Tailwind CSS, while the backend is built with Node.js and Express.

## Features

- Fetch available video formats for a given YouTube URL
- Select video quality before downloading
- Download videos in the selected format
- Convert downloaded video files to different formats using MoviePy

## Technologies Used

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Video Processing: ytdl-core
- Video Conversion: MoviePy

## Prerequisites

- Node.js and npm installed
- Python installed
- Internet connection

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/youtube-video-downloader.git
    cd youtube-video-downloader
    ```

2. Install dependencies for both frontend and backend:

    ```sh
    # Install frontend dependencies
    npm install

    # Install backend dependencies
    cd backend
    npm install
    ```

3. Install Python dependencies for video conversion:

    ```sh
    pip install moviepy
    ```

## Usage

1. Start the backend server:

    ```sh
    cd backend
    node server.js
    ```

    The backend server will start at `http://localhost:5000`.

2. Start the frontend development server:

    ```sh
    cd ..
    npm run dev
    ```

    The frontend development server will start at `http://localhost:3000`.

3. Open your browser and go to `http://localhost:3000` to use the application.

4. Convert downloaded video files using the Python script:

    ```sh
    python File_Convetr.py <input_file> <output_file>
    ```

    For example:

    ```sh
    python File_Convetr.py downloaded_video.mp4 converted_video.mp4
    ```

    The script will convert the input video file to the specified output file format using the `libx264` codec.

## Project Structure

```plaintext
youtube-video-downloader/
├── backend/
│   └── server.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── postcss.config.js
├── tailwind.config.js
├── package.json
├── File_Convetr.py
└── README.md
```

- `backend/server.js`: Node.js server for handling video format fetching and downloading.
- `src/`: React components and main entry point.
- `index.html`: Main HTML file.
- `postcss.config.js`: PostCSS configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `package.json`: Project dependencies and scripts.
- `File_Convetr.py`: Python script for converting video files using MoviePy.

## API Endpoints

- `POST /formats`: Fetch available formats for a given YouTube URL.

    - Request Body: `{ "url": "YouTube video URL" }`
    - Response: `{ "formats": [ ... ] }`

- `POST /download`: Download the video in the selected format.

    - Request Body: `{ "url": "YouTube video URL", "format": "selected format itag" }`
    - Response: Video file download

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.