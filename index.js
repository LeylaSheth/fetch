const oHttp = new SimpleHttp();
oHttp.get('https://jsonplaceholder.typicode.com/posts',
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });

let dataObj = {
    "title": "perfect",
    "body": "try your best"
}
oHttp.post('https://jsonplaceholder.typicode.com/posts', dataObj,
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });

oHttp.put('https://jsonplaceholder.typicode.com/posts', dataObj,
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });