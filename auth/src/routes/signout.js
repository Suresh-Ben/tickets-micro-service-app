const express = require('express');

//inits
const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    const cookies = req.cookies;
    for (let header in cookies)
        res.clearCookie(header);

    res.send({});
});

module.exports = router;