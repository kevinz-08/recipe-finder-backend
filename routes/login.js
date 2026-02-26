const jsonresponse  = require('../lib/jsonresponse');
const router = require('express').Router();
const User = require("../schema/user")
const getUserInfo = require ("../lib/getUserInfo");

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if ( !email || !password ) {
        return res.status(400).json(
            jsonresponse(400, {
                error: "Fields are Required",
            })
        );
    }

    const user = await User.findOne({ email });

    if (user) {
        const correctPassword = await user.comparePassword(password);

        if(correctPassword){
            // autenticar usuario
            const accessToken = user.createAccesToken();
            const refreshToken = await user.createRefreshToken();
        
            return res
            .status(200)
            .json(jsonresponse(200, {user: getUserInfo(user), accessToken, refreshToken}));
        }else{
            res.status(400).json(
                jsonresponse(400, {
                    error: "User or Password incorrect"
                })
            )
        }

    }else{
        res.status(400).json(
            jsonresponse(400, {
                error: "User not Found",
            })
        );
    }
    // autenticar usuario en la base de datos
});

module.exports = router;