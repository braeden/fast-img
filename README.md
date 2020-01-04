# About

### fast-img is for use with low bandwidth devices trying to access images at greater speed in return for a sacrifice of quality + one additonal GET request.

We lean on a datacenter's fast connection to download, scale and compress an image by URL and then serve back the smaller version in the same request. 

This can lead to faster access times then trying to access a large original file.

It takes GET query arguments at `/image/?url=` to a image URL plus optional:
- `qual` [1-100, Default:80]
- `scale` [1-10, Default:2]

We also have the most basic HTML form served at the base domain so you can have the GET query filled out automatically

# Chrome Extension

On images or links ending with `jpeg, png, png` we add an addtional ContextMenu (right click option), which opens that image with fast-img in a new tab.

# Setup

Main back-end
```
npm install
npm start

OR npm run heroku (for heroku testing)
```

Chrome Extension
```
Chrome Extensions > Developer Mode [On] >
Load Unpacked Extension > Find the chrome-extension/src folder

To publish: 
./build.sh OR zip the src directory
```