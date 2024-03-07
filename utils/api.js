// const {google} = require('googleapis');
// const fetch = require('node-fetch')
// const path = require('path');
// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// require("dotenv").config()
const ClientID=process.env.YOUTUBE_CLIENTID
const SECRET_KEY=process.env.YOUTUBE_SECRET


// const keyPath = path.join(__dirname, 'oauth2.keys.json');
// let keys = {redirect_uris: ['']};
// if (fs.existsSync(keyPath)) {
//   keys = require(keyPath).web;
// }

// const oauth2Client=new google.auth.OAuth2(
//   ClientID,
//   SECRET_KEY,keys.redirect_uris[0]

// )
// google.options({auth: oauth2Client});

// oauth2Client.on('tokens', (tokens) => {
//   if (tokens.refresh_token) {
//     // store the refresh_token in my database!
//     console.log(tokens.refresh_token,'token');
//   }
//   console.log(tokens.access_token,'eewww');
// });





// const youtubeURL = async (videoId) => {
//   try {
//     const data = {
//       context: {
//         client: {
//           clientName: 'WEB',
//           clientVersion: '2.9999099',
//         },
//       },
//       params: Buffer.from(`\n\x0b${videoId}`).toString('base64'),
//     };
//     const response = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const transcriptData = await response.json();
//     console.log(transcriptData.responseContext,'transcriptData!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); // 여기에서 트랜스크립트 데이터를 처리하세요
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };



// async function downloadCaption(captionId, format='srt') {
//   try {
//     const response = await youtube.captions.download({
//       id: captionId,
//       tfmt: format,
//       alt: 'media' // 실제 캡션 데이터를 받기 위해 필요합니다.
//     });
//     console.log(response,'response!!!!downloadCaption!!!!!!!')
//     console.log(response.body,'responseData.......download!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
//     return response
//     // 캡션 내용을 파일로 저장하거나 다른 처리를 할 수 있습니다.
//     // 예: fs.writeFileSync('caption.srt', response.data);
//   } catch (error) {
//     console.error('Error: ' + error);
//   }
// }

// async function getCaptions(videoId) {
//   try {
//     const response = await youtube.captions.list({
//       part: 'snippet',
//       type:"caption",
//       videoId: videoId,
//     });
//     console.log(response.data.items[0].id,'response!!!!!!!!!!!!!!!!!1')
//    return response.data.items[0].id
  
//   } catch (error) {
//     console.error('Error: ' + error);
//   }
// }










require('dotenv').config();
const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = process.env.YOUTUBE_CLIENTID;
const CLIENT_SECRET = process.env.YOUTUBE_SECRET;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;
const apiKey="AIzaSyAynwGKWgtTw1mHLEGrXbGyqk1JZRr42j8"

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl','https://www.googleapis.com/auth/youtube.download'];
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 리프레시 토큰을 받기 위해 필요
  scope: scopes
});
console.log(url,'url!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
async function getAndSetUserTokens(code) {
  try {
    console.log(code,'code!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    const { tokens } = await oauth2Client.getToken(code); // code를 사용하여 토큰 받기
    oauth2Client.setCredentials(tokens); // 토큰을 OAuth2 클라이언트에 설정
  } catch (error) {
    console.log(code,'code')
    console.error(`Error getting tokens: ${error}`);
  }
}



async function downloadCaption(videoId, format = 'srt') {
  const youtube = google.youtube({version: 'v3', auth: oauth2Client});
  try {
    const response = await youtube.captions.download({
      id: videoId,
      tfmt: format,
      alt: 'media'
    });
    console.log(response.data, 'response');
    // 캡션 내용을 파일로 저장할 수 있습니다.
  } catch (error) {
    console.error(`Error downloading caption: ${error}`);
  }
}

module.exports = { downloadCaption,getAndSetUserTokens};