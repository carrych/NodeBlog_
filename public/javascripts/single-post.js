(() => {

// take posts and categories from db

    window.addEventListener('load', async () => {

        const getByFetch = new Fetch;
        const createCommentBtn = document.querySelector('.create-comment');

        await getByFetch.showComments();
        await getByFetch.showCategories();

        //if u create new post and click createPostBtn, its will create and show u new post

        if (createCommentBtn) {

            createCommentBtn.addEventListener('click', async () => {

                await getByFetch.showComments();

            });
        }
    });

})();
