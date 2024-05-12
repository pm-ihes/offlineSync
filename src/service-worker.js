importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
    if (event.tag === 'post-data') {
        event.waitUntil(getDataAndSend());
    }
});

function addData(text) {
    const obj = {
        text
    }
    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(() => Promise.resolve())
        .catch(() => Promise.reject());
}

function getDataAndSend() {
    let db;
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
        throw new Error(event);
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log(db);
        getData(db);
    };
}

function getData(db) {
    const transaction = db.transaction(['test-store']);
    const objectStore = transaction.objectStore('test-store');
    console.log(`Objectstore: ${objectStore}`);
    const request = objectStore.get('text');
    console.log(request);
    request.onerror = (event) => {
        throw new Error(event);
    };
    request.onsuccess = (event) => {
        // Do something with the request.result!
        addData(request.result);
        console.log('Testtext: ' + request.result);
    };
}
