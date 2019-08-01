const assert = require('assert');


class CollectionsHandler {

    async FindAll(collection) {
        return await collection.find();
    }

    FindAllPromise(collection, errMsg) {
        return new Promise((resolve, reject) => {
            const res = this.FindAll(collection);
            if (res) {
                resolve(res);
            } else {
                reject(errMsg);
            }
        })
    }
}

module.exports = new CollectionsHandler;
