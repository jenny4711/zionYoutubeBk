const{ translateResult ,createChatWithGoogle } =require('../utils/ai') ;
const History = require('../model/history')
const historyController={};
const{ YoutubeTranscript} = require('youtube-transcript') ;
const User = require('../model/user')
const { Client, MusicClient } = require("youtubei");
const youtube = new Client();
 async function saveSummary({videoId,summaryORG,lang,ask,summary}){
  try{
    const video=await History.findOne({videoId,lang,ask});
  
 
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

    const textes=[]
    const user = await User.findOne({ email });
if(user.credit <= 0)throw new Error("your credit is 0 ")
  let findVideo = await History.findOne({videoId,lang,ask});
   
    if(!videoId){
      return res.status(400).json({message:'VideoId is required'})
    }
if(!findVideo && typeof videoId === 'string'){
console.log(videoId,'videoId!!!!!!!!!!!!!!!!!!!!!')
    //let transcript =  await YoutubeTranscript.fetchTranscript(videoId)
   const transcript=await youtube.getVideoTranscript(videoId)
   console.log(transcript,'trans')

  if (!transcript || !Array.isArray(textes)){
console.log(transcript,'transcriptError!!!!')
  

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
    console.log(error.message,'errorMsg!!!')
    if (error.message.includes('[YoutubeTranscript]')) {
      return res.status(404).json({ message: "Could not find the video by the provided VideoId. Please check the VideoId and try again.", error: error.message });
    } else if (error.message.includes('credit is 0')) {
     
      return res.status(403).json({ message: "Your credit is 0. Please recharge your credit to use this service.", error: error.message });
    } else if (error.message.includes('Google')) {
  
      return res.status(500).json({ message: "AI couldn't generate a summary. Please try again later!", error: error.message });
    } else {
   
      return res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error: error.message });
    }
    

  }
}


module.exports=historyController