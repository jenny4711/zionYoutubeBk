const{ translateResult ,createChatWithGoogle } =require('../utils/ai') ;
const History = require('../model/history')
const historyController={};
const{ YoutubeTranscript} = require('youtube-transcript') ;

 async function saveSummary({videoId,summaryORG,lang,summary}){
  try{
    const video=await History.findOne({ videoId, lang });
    if(!video){
      const newHistory = new History({
        videoId,
        summaryORG,
        lang,
        summary,
      })
      await newHistory.save()
      console.log('save!')
    }else{
      console.log(video,'video')
    }
  
  }catch(error){
    console.log(error,'error-saveSummary')
  }
}


historyController.makeSummary=async ( req,res)=>{
  try{
  const {videoId,lang,ask}=req.body;
  console.log(ask,'ask-makeSummary!!!!!!!!!')
    const textes=[]
    let findVideo = await History.findOne({ videoId, lang ,ask});

    if(!videoId){
      return res.status(400).json({message:'VideoId is required'})
    }
if(!findVideo){
  const transcript = await YoutubeTranscript.fetchTranscript(videoId)
  transcript.map((item)=>{
    textes.push(item.text)
  })
// console.log(textes,'textes!')
 let summaryORG = await createChatWithGoogle(textes,ask)
 let summary = await translateResult(summaryORG,lang)
 if(summaryORG == ""){
  summaryORG ="Sorry something went wrong. Please try again later!"

 }
 await saveSummary({videoId,summaryORG,lang,summary})
//  console.log(summaryORG ,'summaryORG!')
//  console.log(summary,'summary')
 res.status(200).json({data:summary,videoId:videoId})


}else{
  let summary=findVideo.summary
  let videoId=findVideo.videoId
  
  return res.status(200).json({data:summary,videoId:videoId})
}

  }catch(error){
    res.status(500).json({ message: 'Failed to get transcript', error: error.message });
  }
}



module.exports = historyController;