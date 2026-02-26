const router = require('express').Router();
const jsonresponse = require('../lib/jsonresponse');

router.get("/", (req, res) => {
    res.status(200).json(jsonresponse(200, req.user));
});

module.exports = router;