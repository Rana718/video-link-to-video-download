import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.post('/formats', async (req, res) => {
  const { url } = req.body;
  console.log('Received request to /formats with URL:', url); // Log the request body
  if (!ytdl.validateURL(url)) {
    console.log('Invalid URL'); // Log invalid URL case
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
  console.log('Received request to /download with:', { url, format }); // Log the request body
  if (!ytdl.validateURL(url)) {
    console.log('Invalid URL'); // Log invalid URL case
    return res.status(400).send({ error: 'Invalid URL' });
  }
  try {
    const info = await ytdl.getInfo(url);
    const selectedFormat = info.formats.find(f => f.itag == format);
    if (!selectedFormat) {
      console.log('Invalid format selected'); // Log invalid format case
      return res.status(400).send({ error: 'Invalid format selected' });
    }

    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${selectedFormat.container}"`);
    ytdl(url, { format: selectedFormat }).pipe(res).on('error', (err) => {
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
