(() => {

// take posts and categories from db

    window.addEventListener('load', async () => {

        const getByFetch = new Fetch;
        const createPostBtn = document.querySelector('.create-post');

        await getByFetch.showPosts();
        await getByFetch.showCategories();

        //if u create new post and click createPostBtn, its will create and show u new post

        if (createPostBtn) {

            createPostBtn.addEventListener('click', async () => {

                await getByFetch.showPosts();
                await getByFetch.showCategories();

            });
        }
    });

})();
