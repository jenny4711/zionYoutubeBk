const{ translateResult ,createChatWithGoogle } =require('../utils/ai') ;
const History = require('../model/history')
const historyController={};
const{ YoutubeTranscript} = require('youtube-transcript') ;
// const { getSubtitles } = require('youtube-captions-scraper')
const {fetchSubtitles} =require('../utils/api')
const User = require('../model/user')

 async function saveSummary({videoId,summaryORG,lang,ask,summary}){
  try{
    const video=await History.findOne({videoId,lang,ask});
    console.log(ask,'ask-saveSummary!!!!!!!')
    if(!video){
      const newHistory = new History({
        videoId,
        summaryORG,
        lang,
        ask,
         summary,
      })

      await newHistory.save()
      console.log('save!')
    }else{
      
      console.log('already have it','video!!')
    }
  
  }catch(error){
    console.log(error,'error-saveSummary')
  }
}


historyController.makeSummary=async (req,res)=>{
  try{
  const {videoId,lang,ask,email}=req.body;
  console.log(ask,'ask-makeSummary!!!!!!!!!')

    const textes=[]
    const user = await User.findOne({ email });
if(user.credit <= 0)throw new Error("your credit is 0 ")
  let findVideo = await History.findOne({videoId,lang,ask});
   
    if(!videoId){
      return res.status(400).json({message:'VideoId is required'})
    }
if(!findVideo){

   let transcript = await YoutubeTranscript.fetchTranscript(videoId)
  // const textes = await fetchSubtitles(videoId);
  // // console.log(subtitles,'subtitle!!!!!!!!!!!!!');

 console.log(!transcript,'true or false!!!!!')
  if (!transcript || !Array.isArray(textes)){
console.log('error-fetchSubtitles!')
  

  }
  transcript.map(element => {
    textes.push(element.text)
  })
console.log(textes,'textes!')
 let summaryORG = await createChatWithGoogle(textes,ask)
 let summary = await translateResult(summaryORG,lang)

 if(summaryORG == "" || summary == ""){
throw new Error("Ai couldn't read summary. Please try again later!")

 }
 await saveSummary({videoId,summaryORG,lang,ask,summary})
 console.log(summaryORG ,'summaryORG!')
 console.log(summary,'summary')
 res.status(200).json({data:summary,videoId:videoId})


}else{
  let summary=findVideo.summary
  let videoId=findVideo.videoId
  console.log(summary,'summary-makeSummary!already have it')
  return res.status(200).json({data:summary,videoId:videoId})
}

  }catch(error){
    if (error.message.includes('Youtube Transcript')) {
      return res.status(404).json({ message: "Could not find the video by the provided VideoId. Please check the VideoId and try again.", error: error.message });
    } else if (error.message.includes('your credit is 0')) {
      // 사용자 크레딧이 0인 경우의 오류 처리
      return res.status(403).json({ message: "Your credit is 0. Please recharge your credit to use this service.", error: error.message });
    } else if (error.message.includes('Ai couldn\'t read summary')) {
      // AI 요약 생성 실패에 대한 오류 처리
      return res.status(500).json({ message: "AI couldn't generate a summary. Please try again later!", error: error.message });
    } else {
      // 그 외의 모든 오류에 대한 일반적인 처리
      return res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error: error.message });
    }
    

  }
}


module.exports=historyController