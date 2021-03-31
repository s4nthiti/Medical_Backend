const db = require("../_helpers/db");
const bcrypt = require('bcryptjs');
const config = require('config.json');
const jwt = require('jsonwebtoken');


module.exports = {
    saveUser,
    saveToken,
	getAll,
	register,
	login,
    toggleNotify,
    getNotify,
    checkNoti
};

async function checkNoti(userId, origin) {
    const user = await db.User.findOne({ _id: userId});
    const linenoti = await db.LineToken.findOne({ user: user });
    if(linenoti)
        return true;
    else
        return false;
}

async function getNotify(userId, origin) {
    const user = await db.User.findOne({ _id: userId});
    return user.lineNotify;
}

async function toggleNotify(toggle, userId, origin) {
    const user = await db.User.findOne({ _id: userId});
    if(user)
    {
        if(toggle == 'true')
            toggle = 'false';
        else
            toggle = 'true';
        user.lineNotify = toggle;
        await user.save();
    }
    return user.lineNotify;
}

async function register(params, origin) {
    // validate
    if (await db.User.findOne({ phonenumber: params.phonenumber })){
        throw 'เบอร์โทร "' + params.phonenumber + '" ถูกใช้งานแล้ว';
    }

    // create account object
    const user = new db.User(params);
    user.lineNotify = false;
	user.role = 'User';

    // hash password
    user.passwordHash = hash(params.password);

    // save account
    await user.save();
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

async function login({ phonenumber, password }) {
    const user = await db.User.findOne({ phonenumber });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'เบอร์โทรศัพท์ หรือ รหัสผ่าน ของท่านผิดพลาด';
    }

	const line = await db.LineToken.findOne({ users: user._id });
    let lineRegister = false;
    
	if(line != null)
		lineRegister = true;
    const jwtToken = generateJwtToken(user, lineRegister);

    // return basic details and tokens
    return {
        jwtToken
    };
}

function generateJwtToken(user, lineRegister) {

    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ id: user.id, phonenumber: user.phonenumber, name: user.name, role: user.role, lineNotify: user.lineNotify, lineRegister: lineRegister}, config.secret, { algorithm: "HS256", expiresIn: config.tokenLife });
}

async function getAll(){
	const users = await db.User.find().sort({name:1});
    let name = [];
    await users.forEach(user => {name.push(user.name)});
	return name;
}

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
	const userData = await db.User.findOne({ phonenumber: params.phoneNumber });
	const form = new db.LineToken({
		user: userData.id,
		code: params.token,
		verified: false,
		access_token: null
	});
	await form.save();
}