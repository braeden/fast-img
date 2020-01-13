const express = require('express')
const sharp = require('sharp')
const fetch = require('node-fetch');
const Cache = require('streaming-cache');
const cache = new Cache({
    max: 100 * 10 ** 6, // In bytes (100Mb)
});
const app = express()
const port = process.env.PORT || 3000
app.use(express.static('public'))

function logExceptOnTest(string) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(string);
    }
}

app.get('/image', async (req, res) => {
    const scale = parseInt(req.query.scale) || 2
    const quality = parseInt(req.query.qual) || 80
    const lookupKey = `${req.query.url || ''}|${scale}|${quality}`
    logExceptOnTest(lookupKey)

    if (cache.exists(lookupKey)) {
        console.log('Cache hit')
        res.type('jpeg')
        cache.get(lookupKey).pipe(res)
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
            out.pipe(cache.set(lookupKey)).pipe(res)
            console.log('Served image')
        } catch (e) {
            logExceptOnTest(e)
            res.redirect('/error.html')
        }
    }
})

app.get('/clear-cache', (req, res) => {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
        cache.reset()
        console.log('Cleared cache')
    }
    res.end(200)
})

app.listen(port, () => console.log(`Started at port ${port}`))