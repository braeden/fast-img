# About

### fast-img is for use with low bandwidth devices trying to access images at greater speed in exchange for minor quality sacrifices & one additional GET request.

We lean on a data center's fast connection to download, scale and compress an image by URL and then serve back the smaller version in the same request. We also use LRU caching for repetitive requests. 

This can lead to substantially faster access times for images of all sizes!

# Screenshots

## 20MB Image w/ ~200Mbps Wifi (9.25s)
![original](screenshots/original.png)

## 20MB Image downscaled w/ fast-img (5.92s)
`scale=2, qual=80`
![scaled](screenshots/scaled.png)

## 20MB Image downscaled w/ fast-img cache hit (0.39s)
![scaled and cached](screenshots/scaled+cached.png)

# About cont.

The domain takes GET query arguments at `/image/?url=` to a image URL plus optional:
- `qual` [1-100, Default:80]
- `scale` [1-10, Default:2]

We also have the most basic HTML form served at the base domain so you can have the GET query filled out automatically

# Chrome Extension

On images or links ending with `jpeg, png, png` we add an addtional ContextMenu (right click option), which opens that image with fast-img in a new tab.

# Setup

Server back-end
```
npm install
npm test
npm run start-dev

OR npm run heroku (for heroku testing)
```

Chrome Extension
```
Chrome Extensions > Developer Mode [On] >
Load Unpacked Extension > Find the chrome-extension/src folder
```