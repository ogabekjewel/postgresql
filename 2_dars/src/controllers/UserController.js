const { response } = require("express")
const { generateHash, compareHash } = require("../modules/bcrypt")
const { generateToken } = require("../modules/jwt")
const moment = require("moment")

module.exports = class UserController {
    static async SignUpPOST(req, res) {
        try {
            const { name, email, password } = req.body
            let user = await req.psql.users.findOne({
                where: {
                    email,
                },     
                raw: true,
            })  
            
            console.log(user)

            if(user) throw new Error("This email already in use")

            const pass = await generateHash(password)

            user = await req.psql.users.create({
                name,
                email,
                password: pass,
            }, {
                raw: true,
            })
            
            const ip = req.headers['x-forward-for'] || req.socket.remoteAddress
            const useragent = req.headers['user-agent']

            const session = await req.psql.sessions.create({
                user_id: user.id,
                useragent,
                ip,
            })

            let token = generateToken({
                session_id: session.id,
            })

            res.status(200).json({
                ok: true,
                data: {
                    user,
                    token,
                    session
                }
            })
        } catch(e) {
            console.log(e)
            response.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async LoginPOST(req, res) {
        try {
            const { email, password } = req.body

            let user = await req.psql.users.findOne({
                where: {
                    email,
                },
                raw: true,
            })

            if(!user) throw new Error("User is not registered")
            
            let isPassTrue = await compareHash(password, user.password)

            let attempt = await req.psql.attempts.findOne({
                where: {
                    user_id: user.id,
                },
                raw: true,
            })

            if(!attempt) {
                await req.psql.attempts.create({
                    user_id: user.id,
                    attempt: 1,
                })
            } else {
                if(attempt.expire) {
                    if(new Date(attempt.expire).getTime() < new Date().getTime()) {
                        attempt = await req.psql.attempts.update(
                            {
                                expire: null,
                                attempt: 0,
                            },
                            {
                                where: {
                                    id: attempt.id,
                                },
                                returning: true,
                                raw: true,
                            }
                        )
                        // database qaytarishi uchun returning: true 
                        
                        console.log(attempt)
                        attempt = attempt[1][0]

                    } else {
                        throw new Error(`Wait until ${moment(attempt.expire)
                        .locale("en-US")
                        .format("LLL")}`)
                    }
                    
                }

                if(attempt.attempt >= 2) {
                    if(!isPassTrue) {
                        let expire = new Date().getTime() + 1000 * 60 * 0.5
                        await req.psql.attempts.update(
                            {
                                attempt: 3,
                                expire,
                            }, 
                            {
                                where: {
                                    id: attempt.id,
                                }
                            }
                        )

                        throw new Error(
                            `Incorrect Password, try after ${moment(expire)
                                .locale("en-US")
                                .format("LLL")}`
                        )
                    }
                    let expire = new Date().getTime() + 1000 * 60 * 5
                    await req.psql.attempts.update(
                        {
                            attempt: 3,
                            expire,
                        }, 
                        {
                            where: {
                                id: attempt.id,
                            }
                        }
                    )

                    throw new Error(
                        `Incorrect Password, try after ${moment(expire)
                            .locale("en-US")
                            .format("LLL")}`
                    )
                }
                

                await req.psql.attempts.update(
                    {
                        attempt: attempt.attempt + 1,
                    }, 
                    {
                        where: {
                            id: attempt.id,
                        }
                    }
                )
            }

            if(!isPassTrue) throw new Error("Incorrect password")

            await req.psql.attempts.destroy({
                where: {
                    user_id: user.id,
                }
            })

            const ip = req.headers['x-forward-for'] || req.socket.remoteAddress
            const useragent = req.headers['user-agent']

            const session = await req.psql.sessions.create({
                user_id: user.id,
                useragent,
                ip,
            })

            let token = generateToken({
                session_id: session.id,
            })

            res.status(200).json({
                ok: true,
                data: {
                    session,
                    user,
                    token,
                }
            })
        } catch(e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + ""
            })
        }
    }
}