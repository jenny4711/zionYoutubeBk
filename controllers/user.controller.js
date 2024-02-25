const User = require("../model/user");
const userController = {};

userController.autoSignUp = async (req, res) => {
  try {
    let {
      email,
      lastName,
      firstName,
      picture,
      status,
      lang,
      promptStyle,
     
      credit,
    } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      console.log(user,'user')
      return res.status(200).json({ status: "already-in", data: user });
    }
    const newUser = new User({
      email,
      lastName,
      firstName,
      picture,
      status,
      lang,
      promptStyle,
      credit:10,
    });
    await newUser.save();
    console.log(newUser,'newUser')
    return res.status(200).json({ status: "success createUser!", data: newUser });
  } catch (error) {
    console.error(error, "error!!!!!!!!!!!");
    res.status(400).json({ status: "fail", error: error.message });
  }
};


userController.showUserInfo=async(req,res)=>{
  try{
    const {email}=req.params;
    const user = await User.fineOne({email})
    if(!user)throw new Error("couldn't find user")
    return res.status(200).json({status:'success-showUserInfo',data:user})
  }catch(error){
    return res.status(400).json({status:'fail-showUserInfo'})
  }
}


userController.subtractCredit = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
  
      if (user.credit > 0) {
        user.credit -= 1;
        await user.save();
        return res.status(200).json({ status: 'You have used 1 credit', data: user.credit });
      } else {
        res.status(400).json({ status: 'You have over limit now. Please recharge credit!' });
      }
    }
  } catch (error) {
    console.error(error, "error!!!!!!!!!!!");
    return res.status(400).json({ status: 'You need to register first', error: error });
  }
};




userController.editLang = async (req, res) => {
  try {
    const email = req.params.id;
    const { lang } = req.body;
    const userId =await User.findOne({email})
    const user = await User.findByIdAndUpdate(
      userId,
      { lang },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: "Not found the User!", message: "Fail-Update-Lang" });
    }
   
    return res.status(200).json({ status: 'addLang-success', data: user });
  } catch (error) {
    console.log(error, 'error-editLang');
    return res.status(400).json({ status: "updateLang-fail", error: error });
  }
};

userController.editPromptStyle = async (req, res) => {
  try {
    const email = req.params.id;
    const { promptStyle } = req.body;
    const userId =await User.findOne({email})
    const user = await User.findByIdAndUpdate(
      userId,
      { promptStyle },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: "Not found the user!", message: "Fail-update-promtStyle" });
    }
   
    return res.status(200).json({ status: 'addPromptStyle-success', data: user });
  } catch (error) {
    console.log(error, 'error-editLang');
    return res.status(400).json({ status: "updatePromptStyle-fail", error: error });
  }
};

module.exports = userController;