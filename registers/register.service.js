const db = require("../_helpers/db");

module.exports = {
    saveUser,
    saveToken
};

async function saveUser(params, origin){
	console.log(params.fullName);
    const user = new db.User(params);
    const oldUser = await db.User.findOne({ email: params.email });
    const oldToken = await db.LineToken.findOne({ email: params.email });
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
		token: params.token
	});
	await form.save();
}
