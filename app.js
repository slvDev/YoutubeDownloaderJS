const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl');

(async () => {    
    const url = process.argv[2]
    // Get Video Info
    let videoInfo = await new Promise((resolve, reject) => {
        youtubedl.getInfo(url, (err, info) => {
            if (err) reject(err)
            let videoInfo = {
                title: info.title,
                description: info.description,
            }
            resolve(videoInfo)
        })
    })
    let filePath = path.join(__dirname, 'videos', videoInfo.title.replace(/\|/g, ''))
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })

    fs.writeFileSync(`${filePath}/info.txt`, 'Title\n' + videoInfo.title + '\n\nDescription\n' + videoInfo.description)
    console.log(`Info file created`)
    
    // Download Thumbnail
    await new Promise((resolve, reject) => {
        youtubedl.getThumbs(url, { all: false, cwd: filePath }, (err, files) => {
          if (err) console.log(err)
          console.log(`Thumbnail file downloaded`)
          resolve()
        })
    })

    // Download Video
    console.log('Download started')
    youtubedl.exec(url,['-o', `${filePath}/%(title)s.%(ext)s`], {}, (err, output) => {
        if(err) console.log(err)
        console.log(output.join('\n'))
    })

})();
