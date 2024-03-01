const {google} = require('googleapis');
const fetch = require('node-fetch')
const fs = require('fs');
require("dotenv").config()
const ClientID=process.env.YOUTUBE_CLIENTID



const youtubeURL = async (videoId) => {
  try {
    const URL = `https://youtube.googleapis.com/youtube/v3/captions/${videoId}`;
    const accessToken = ClientID; // OAuth2를 통해 받은 액세스 토큰
    const res = await fetch(URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await res.json();
    console.log(data, 'data!!!!!!!');
  } catch (error) {
    console.log(error, 'errorurl!!!!!!!!!!!!!!!!!!!!!!!!!');
  }
};



async function downloadCaption(captionId, format='srt') {
  try {
    const response = await youtube.captions.download({
      id: captionId,
      tfmt: format,
      alt: 'media' // 실제 캡션 데이터를 받기 위해 필요합니다.
    });
    console.log(response,'response!!!!downloadCaption!!!!!!!')
    console.log(response.body,'responseData.......download!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
    return response
    // 캡션 내용을 파일로 저장하거나 다른 처리를 할 수 있습니다.
    // 예: fs.writeFileSync('caption.srt', response.data);
  } catch (error) {
    console.error('Error: ' + error);
  }
}

async function getCaptions(videoId) {
  try {
    const response = await youtube.captions.list({
      part: 'snippet',
      type:"caption",
      videoId: videoId,
    });
    console.log(response.data.items[0].id,'response!!!!!!!!!!!!!!!!!1')
   return response.data.items[0].id
  
  } catch (error) {
    console.error('Error: ' + error);
  }
}













module.exports ={getCaptions,downloadCaption,youtubeURL}