const db = require("../_helpers/db");

module.exports = {
    saveUser,
    saveToken
};

async function saveUser(params, origin){
    const user = new db.User(params);
    const oldUser = await db.User.findOne({ email: params.email });
    const oldToken = await db.LineToken.findOne({ user: oldUser });
    if(oldUser){
    	await oldUser.remove();
    }
    if(oldToken){
    	await oldToken.remove();
    }
    
    await user.save();
}

async function saveToken(params) {
	const userData = await db.User.findOne({ email: params.userEmail });
	const form = new db.LineToken({
		user: userData.id,
		email: params.userEmail,
		code: params.token,
		verified: false,
		access_token: null
	});
	await form.save();
}
