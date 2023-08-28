const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Missing video URL' });
    }

    try {
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid video URL' });
        }

        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);
        ytdl(videoUrl, { format: format }).pipe(res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
