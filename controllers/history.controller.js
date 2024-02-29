const{ translateResult ,createChatWithGoogle } =require('../utils/ai') ;
const History = require('../model/history')
const historyController={};
const{ YoutubeTranscript} = require('youtube-transcript') ;
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
  console.log(typeof videoId === "string",'ask-makeSummary!!!!!!!!!')

    const textes=[]
    const user = await User.findOne({ email });
if(user.credit <= 0)throw new Error("your credit is 0 ")
  let findVideo = await History.findOne({videoId,lang,ask});
   
    if(!videoId){
      return res.status(400).json({message:'VideoId is required'})
    }
if(!findVideo && videoId){

  const transcript = await YoutubeTranscript.fetchTranscript(videoId)
  console.log(transcript,'before')
  if (!transcript || !Array.isArray(transcript)) {
    console.log("Error: Transcript is undefined or not an array!");
    // 이 부분에 대한 처리 추가
} else {
    transcript.map((item) => {
        if (item && item.text) {
            textes.push(item.text);
        }
    });
    console.log("Textes:", textes);
}
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
    console.log(error,'errorMakeSummary!!!!!')
    res.status(500).json({ message: error.message, error: error.message });
  }
}


module.exports=historyController
