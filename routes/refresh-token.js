// const { verify } = require('jsonwebtoken');
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const jsonresponse  = require('../lib/jsonresponse');
const Token = require('../schema/token');
const { generateAccesToken } = require('../auth/generateTokens');
const { verifyRefreshToken } = require('../auth/verifyToken')

const router = require('express').Router();

router.post("/", async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);

    if(refreshToken){
        try {
            const found = await Token.findOne({token: refreshToken});
            if (!found) {
                return res.status(401).send(jsonresponse(401, { error: "Unauthorized" }));
            }

            const payload = verifyRefreshToken(found.token);
            if(payload){
                const  accessToken = generateAccesToken(payload.user);

                return res.status(200).json(jsonresponse(200, {accessToken}));
            }else {
                return res
                    .status(401)
                    .send(jsonresponse(401, {error: "Unauthorized"}));
            }

        } catch (error) {
            return res
                .status(401)
                .send(jsonresponse(401, {error: "Unauthorized"}));
        }
    }else {
        return res
        .status(401)
        .send(jsonresponse(401, {error: "Unauthorized"}));
    }
});

module.exports = router;