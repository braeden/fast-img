function saveOptions() {
    chrome.storage.sync.set({
        scale: document.getElementById('qual').value,
        qual: document.getElementById('scale').value
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        qual: 80,
        scale: 2
    }, items => {
        document.getElementById('qual').value = items.qual;
        document.getElementById('scale').value = items.scale;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);