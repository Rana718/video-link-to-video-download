import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;
const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.use(cors());
app.use(express.json());

app.post('/formats', async (req, res) => {
  const { url } = req.body;
  console.log('Received request to /formats with URL:', url);
  if (!ytdl.validateURL(url)) {
    console.log('Invalid URL');
    return res.status(400).send({ error: 'Invalid URL' });
  }
  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    res.send({ formats });
  } catch (error) {
    console.error('Error fetching formats:', error);
    res.status(500).json({ error: 'Failed to fetch formats' });
  }
});

app.post('/download', async (req, res) => {
  const { url, format } = req.body;
  console.log('Received request to /download with:', { url, format });
  if (!ytdl.validateURL(url)) {
    console.log('Invalid URL');
    return res.status(400).send({ error: 'Invalid URL' });
  }
  try {
    const info = await ytdl.getInfo(url);
    const selectedFormat = info.formats.find(f => f.itag == format);
    if (!selectedFormat) {
      console.log('Invalid format selected');
      return res.status(400).send({ error: 'Invalid format selected' });
    }

    const videoTitle = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
    const tempVideoPath = path.join(tempDir, `temp_${videoTitle}.mp4`);
    const outputVideoPath = path.join(tempDir, "video.mp4");

    const videoStream = ytdl(url, { format: selectedFormat });

    videoStream.pipe(fs.createWriteStream(tempVideoPath)).on('finish', () => {
      console.log('Downloaded video, converting...');
      exec(`python Convet.py "${tempVideoPath}" "${outputVideoPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error converting video:', error);
          return res.status(500).json({ error: 'Failed to convert video' });
        }
        
        console.log('Conversion complete, sending file...');
        fs.unlink(tempVideoPath, (err) => {
          if (err) console.error('Error removing temp video file:', err);
        });
        
        res.download(outputVideoPath, "video.mp4", (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Failed to send file' });
          }

          fs.unlink(outputVideoPath, (err) => {
            if (err) console.error('Error removing output video file:', err);
          });
        });
      });
    }).on('error', (err) => {
      console.error('Error downloading video:', err);
      res.status(500).json({ error: 'Failed to download video' });
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download video' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
