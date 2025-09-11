function createPromissesPost(ids, url) {
    return [fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.authToken}`,
        },
        body: JSON.stringify(ids),
        credentials: "include",
    })];
}
function createPromissesGet(ids, url) {
    const requests = ids.map(element =>
        fetch(url + element, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.authToken}`,
            },
            credentials: "include",
        })
    );
    return requests;
}

module.exports = { createPromissesPost, createPromissesGet };