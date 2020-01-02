const express = require('express')
const sharp = require('sharp')
const fetch = require('node-fetch');
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
app.use(express.static('public'))

app.get('/image', async (req, res) => {
    console.log(req.query.url)

    try {
        if (!req.query.url) throw "Error processing image query"
        const response = await fetch(req.query.url)
        if (!response.ok || !response.headers.get('content-type').includes("image")) {
            throw "Content-type error"
        }
        const image = await response.body
        res.type('jpeg')
        const pipeline = sharp()
        const sharpObject = image.pipe(pipeline)
        const newWidth = ~~((await sharpObject.metadata()).width / (parseInt(req.query.scale) || 2))
        const out = image.pipe(pipeline.resize(newWidth).jpeg({
            quality: parseInt(req.query.qual) || 80
        }))
        out.pipe(res)
    } catch (e) {
        console.log(e)
        res.status(400).send("Error")
    }
})


app.listen(port, () => console.log(`Started at port ${port}`))