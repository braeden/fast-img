process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const fetch = require('node-fetch')
require('../app')

function createSearchParams(obj, url) {
    return new URLSearchParams({
        ...obj,
        url: url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1024px-Node.js_logo.svg.png'
    })
}

describe('Valid requests', function () {
    it('Main page content', async () => {
        let response = await fetch('http://localhost:3000')
        expect(response.status).to.equal(200)
    });

    it('Default image response', async () => {
        const searchParams = createSearchParams({
            qual: 80,
            scale: 2
        })
        const response = await fetch('http://localhost:3000/image/?' + searchParams)
        expect(response.status).to.equal(200)
        expect(response.headers.get('Content-Type')).to.equal('image/jpeg')
        const imageData = await response.blob()
        expect(imageData.size).to.equal(10300)
    });

    it('Cache image response', async () => {
        await fetch('http://localhost:3000/clear-cache')
        const searchParams = createSearchParams()
        let start = new Date()
        let response = await fetch('http://localhost:3000/image/?' + searchParams)
        let nonCachedTime = new Date() - start
        start = new Date()
        response = await fetch('http://localhost:3000/image/?' + searchParams)
        let cachedTime = new Date() - start
        expect(nonCachedTime * 0.2 > cachedTime).to.be.true
        expect(response.status).equal(200)

    })
})

describe('Invalid requests', function () {
    it('Invalid parameters response', async () => {
        const searchParams = createSearchParams({
            qual: 1000,
            scale: 2
        })
        const response = await fetch('http://localhost:3000/image/?' + searchParams)
        expect(response.redirected).true
        expect(response.url).to.include('error.html')
    });

    it('Non-image URL', async () => {
        const searchParams = createSearchParams({
            qual: 80,
            scale: 2
        }, 'https://google.com')
        const response = await fetch('http://localhost:3000/image/?' + searchParams)
        expect(response.redirected).true
        expect(response.url).to.include('error.html')
    })
})