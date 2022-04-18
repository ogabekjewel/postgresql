const { SignUpPOST, LoginPOST } = require("../controllers/UserController")

const router = require("express").Router()

router.post("/signup", SignUpPOST)
router.post("/login", LoginPOST)
module.exports = {
    path: "/",  
    router,
}