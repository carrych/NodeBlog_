function whatNeedToRender(callback, collection, response, page, msgOrArrOfErrors) {
    if (typeof msgOrArrOfErrors === 'string') {
        callback(collection)
            .then((temp) => {
                response.render(page, {
                    title: 'Result',
                    msg:  msgOrArrOfErrors,
                    items: temp
                });
            })
            .catch(err => console.log(err));
    }
}

module.exports = new whatNeedToRender;
