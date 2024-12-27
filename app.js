const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl-exec');

(async () => {
    try {
        const url = process.argv[2];
        if (!url) throw new Error('Please provide a YouTube URL');

        // Get Video Info
        console.log('Fetching video info...');
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });

        // Create directory
        const filePath = path.join(__dirname, 'videos', videoInfo.title.replace(/[/\\?%*:|"<>]/g, '-'));
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

        // Save info file
        fs.writeFileSync(
            `${filePath}/info.txt`,
            'Title\n' + videoInfo.title + '\n\nDescription\n' + videoInfo.description
        );
        console.log(`Info file created`);

        // Download Thumbnail
        console.log('Downloading thumbnail...');
        await youtubedl(url, {
            skipDownload: true,
            writeThumbnail: true,
            output: `${filePath}/thumbnail.jpg`,
            noCheckCertificates: true,
            noWarnings: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });
        console.log(`Thumbnail downloaded`);

        // Download Video
        console.log('Downloading video...');
        await youtubedl(url, {
            output: `${filePath}/%(title)s.%(ext)s`,
            format: 'best',
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });
        console.log('Download completed');

    } catch (error) {
        console.error('Error:', error);
    }
})();
