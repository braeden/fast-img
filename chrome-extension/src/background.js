chrome.contextMenus.onClicked.addListener((info, tab) => {
    const searchParams = new URLSearchParams({
        url: info.srcUrl || info.linkUrl,
    });
    const websiteUrl = 'http://fast-img.herokuapp.com/image/?'
    chrome.tabs.create({
        url: websiteUrl + searchParams
    })
});

chrome.contextMenus.create({
    title: 'Open with fast-img',
    contexts: ['image', 'link'],
    targetUrlPatterns: [
        '*://*/*.jpeg',
        '*://*/*.jpg',
        '*://*/*.png'
    ]
});