const assert = require('assert');


class CollectionsHandler {

    async FindAll(collection) {
        let temp = await collection
            .find({}, function (err, data) {
                let tempArr = [];
                assert.equal(null, err);
                data.forEach(category => tempArr.push(category));

            })
            .then(tempArr => tempArr);
        return temp;
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
