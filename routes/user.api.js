
const express =require('express')
const router=express.Router();
const userController =require('../controllers/user.controller')

router.post("/",userController.autoSignUp);
router.post("/subcredit",userController.subtractCredit)
router.put("/editLang/:id",userController.editLang)
router.put("/editPromptStyle/:id",userController.editPromptStyle)
router.get('/',userController.showUserInfo)
router.put('/addHistory/:videoId/:email',userController.editMyHistory)





module.exports=router;