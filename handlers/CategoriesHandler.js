const assert = require('assert');


class CategoriesHandler {

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
}

module.exports = new CategoriesHandler;