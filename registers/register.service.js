const db = require("../_helpers/db");

module.exports = {
    saveUser,
    saveToken
};

async function saveUser(params, origin){
    params.email = params.email.toLowerCase();
    if (await db.User.findOne({ email: params.email })) {
        throw 'อีเมล "' + params.email + '" ถูกใช้งานแล้ว';
    }

    const user = new db.User(params);

    await user.save();
}

async function saveToken(userEmail, token) {
    return new db.LineToken({
        user: userEmail,
        token: token
    });
}