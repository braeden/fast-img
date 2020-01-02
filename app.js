const express = require('express')
const sharp = require('sharp')
const fetch = require('node-fetch');
// const LRU = require('lru-cache')
const Cache = require('streaming-cache');
var cache = new Cache({
    max: 10
});

// const cache = new LRU({
//     max: 10,
//     length: (n, key) => 1
// })
const app = express()
const port = process.env.PORT || 3000
app.use(express.static('public'))

let globObject = {}


app.get('/image', async (req, res) => {
    console.log(req.query.url)
    const scale = parseInt(req.query.scale) || 2
    const quality = parseInt(req.query.qual) || 80
    const lookupKey = `${req.query.url || ''}-${scale}-${quality}`

    if (cache.exists(lookupKey)) {
        console.log("hit cache")
        res.type('jpeg')
        // console.log(typeof cache.get(lookupKey))
        const test1 = cache.get(lookupKey)

        test1.pipe(res)

    } else if (globObject[lookupKey] && false) {
        res.type('jpeg')
        console.log("hit ")
        const yees = globObject[lookupKey]
        yees.pipe(res)
    } else {
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
            const newWidth = ~~((await sharpObject.metadata()).width / scale)
            const out = image.pipe(pipeline.resize(newWidth).jpeg({
                quality: quality
            }))
            // const neew = image.pipe(pipeline.resize(newWidth).jpeg({
            //     quality: quality
            // }))
            //console.log(globObject[lookupKey] == out)
            // console.log(typeof out)
            // cache.set(lookupKey, out)
            // const test=cache.get(lookupKey)
            //globObject[lookupKey] = out
            console.log(cache.exists(lookupKey))

            out.pipe(cache.set(lookupKey)).pipe(res)
            //out.pipe(res)
            //out.pipe(res)
        } catch (e) {
            console.log(e)
            res.status(400).send("Error")
        }
    }
})


app.listen(port, () => console.log(`Started at port ${port}`))