(() => {
    const createPostBtn = document.querySelector('.create-post');

// take posts from db
    async function showPosts() {
        const parentElement = document.querySelector('.mainDiv');
        const res = await fetch(`/posts`);

        if (res.status !== 200) return;

        const data = await res.json();
        const {posts} = data;

        posts.map((post) => {

            const date = moment(post.date).format('MMMM Do, YYYY');
            const {
                category: {
                    category: categoryName
                }
                , _id
                , mainimage
                , title,
                author: {
                    username: authorName,
                    mainimage: authorAvatar
                },
                postContent
            } = post;
            const divWithPost = document.createElement('div');
            const divRow = document.createElement('div');
            const divCol = document.createElement('div');

            divWithPost.classList.add('single-featured-post');
            divRow.classList.add('row');
            divCol.className = 'col-12 col-lg-12';

            const singlePost = `
                            <!-- Thumbnail -->
                            <div class="post-thumbnail mb-50">
                                 <a href="/single-post/${_id}">
                                 <img src="${mainimage}" alt="post_main_img">
                                 </a>
                            </div>
                            <!-- Post Contetnt -->
                            <div class="post-content">
                                <div class="d-flex flex-row justify-content-between">
                                <a href="/single-post/${_id}" class="post-title">${title}</a>
                                <div class="post-meta">
                                    <a href="#">${date} </a>
                                    <a href="#">${categoryName}</a>
                                </div>
                                </div>
                                       ${postContent}
                            </div>
                            <p>Author: <a href="#">${authorName}</a></p>
                            <!-- Post Share Area -->
                            <div class="post-share-area d-flex align-items-center justify-content-between mb-15">
                                <!-- Post Meta -->
                                <div class="post-meta pl-3">
                                    <a href="#"><i class="fa fa-eye" aria-hidden="true"></i> 1034</a>
                                    <a href="#"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 834</a>
                                    <a href="#"><i class="fa fa-comments-o" aria-hidden="true"></i> 234</a>
                                </div>
                                <!-- Share Info -->
                                <div class="share-info">
                                    <a href="#" class="sharebtn"><i class="fa fa-share-alt" aria-hidden="true"></i></a>
                                    <!-- All Share Buttons -->
                                    <div class="all-share-btn d-flex">
                                        <a href="#" class="facebook"><i class="fa fa-facebook"
                                                                        aria-hidden="true"></i></a>
                                        <a href="#" class="twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                        <a href="#" class="google-plus"><i class="fa fa-google-plus"
                                                                           aria-hidden="true"></i></a>
                                        <a href="#" class="instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                            </div>
`;
            divWithPost.innerHTML = singlePost;
            parentElement.appendChild(divRow);
            parentElement.appendChild(divCol);
            parentElement.appendChild(divWithPost);
        });
    }

    window.addEventListener('load', async () => {
        await showPosts();
    });

    if (createPostBtn) {
        createPostBtn.addEventListener('click', async () => {
            await showPosts();
        });
    }
})();



