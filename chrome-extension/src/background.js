const websiteUrl = 'http://fast-img.herokuapp.com/image/?'

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.sync.get({
        qual: 80,
        scale: 2
    }, items => {
        const searchParams = new URLSearchParams({
            url: info.srcUrl || info.linkUrl,
            ...items
        });
        chrome.tabs.create({
            url: websiteUrl + searchParams
        })
    });

});

chrome.contextMenus.create({
    title: 'Open with fast-img',
    contexts: ['image', 'link'],
    targetUrlPatterns: [
        '*://*/*.jpeg',
        '*://*/*.jpg',
        '*://*/*.png',
        '*://*/*.svg',
        '*://*/*.gif'
    ]
});