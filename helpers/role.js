function checkRole(cookie) {
    if(cookie.role != 1)
        return false;
    return true;
};

module.exports = { checkRole };