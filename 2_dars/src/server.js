const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const { PORT } = require("./config")
const postgres = require("./modules/postgres")
const morgan = require("morgan")

async function server() {
    try {
        const app = express()

        app.listen(PORT, _ => console.log(`SERVER READY AT PORT ${PORT}`))

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors())
        app.use(morgan("tiny"))

        app.use(async (req, res, next) => {
            const psql = await postgres()
            req.psql = psql
            next()
        })

        fs.readdir(path.join(__dirname, "routes"), (err, files) => {
            if(!err) {
                files.forEach(file => {
                    const RoutePath = path.join(__dirname, "routes", file)
                    const Route = require(RoutePath)
                    if(Route.path && Route.router) {
                        app.use(Route.path, Route.router)
                    }
                })
            }
        })
    } catch(e) {
        console.log(e)
    }
}

server()


