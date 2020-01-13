function saveOptions() {
    chrome.storage.sync.set({
        scale: document.getElementById('scale').value,
        qual: document.getElementById('qual').value,
        allRequests: document.getElementById('allRequests').checked
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        qual: 80,
        scale: 2,
        allRequests: false
    }, items => {
        document.getElementById('qual').value = items.qual;
        document.getElementById('scale').value = items.scale;
        document.getElementById('allRequests').checked = items.allRequests;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);