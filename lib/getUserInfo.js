function getUserInfo(user) {
    return {
        email : user.email,
        name: user.name,
        id: user.id,
    };
}

module.exports = getUserInfo;