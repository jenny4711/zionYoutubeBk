
const express =require('express')
const router=express.Router();
const userController =require('../controllers/user.controller')

router.post("/",userController.autoSignUp);
router.post("/subcredit",userController.subtractCredit)
router.put("/editLang/:id",userController.editLang)
router.put("/editPromptStyle/:id",userController.editPromptStyle)
router.get('/:email',userController.showUserInfo)
router.put('/addHistory/:videoId/:email',userController.editMyHistory)
router.put('/addRef/:userId/:refEmail',userController.editMyRef)
router.delete("/:id",userController.deleteUser)



module.exports=router;