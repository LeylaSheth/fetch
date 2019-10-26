class FetchData {
    get(url) {
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(res => res.json()) //这是fetch中的promise
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    post(url, data) {
        return new Promise(function(resolve, reject) {
            fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json()) //这是fetch中的promise
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    put(url, data) {
        return new Promise(function(resolve, reject) {
            fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json()) //这是fetch中的promise
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }
}