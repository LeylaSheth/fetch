let oFetch = new FetchData;
// oFetch.get('http://jsonplaceholder.typicode.com/posts')
//     .then(data => console.log(data))
//     .catch(err => console.log(err));
const user = {
        "name": "Leyla",
        "username": "sheetal",
        "email": "12345678"
    }
    // oFetch.post('http://jsonplaceholder.typicode.com/users', user)
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err));

oFetch.put('http://jsonplaceholder.typicode.com/users/2', user)
    .then(data => console.log(data))
    .catch(err => console.log(err));