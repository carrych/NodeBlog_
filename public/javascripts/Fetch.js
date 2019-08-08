class Fetch {

    // get all categories from DB by fetch ant put into the HTML code of page
    async showCategories() {

        const res = await fetch(`/categories`);

        if (res.status !== 200) return;

        const data = await res.json();

        const {categories} = data;

        const parentElement = document.querySelector('.catagory-widgets');
        categories.map((category) => {

            const {
                category: categoryName
            } = category;

            const liWithCategory = document.createElement('li');

            const singleCategory = `
                          <a href="#"><span><i class="fa fa-angle-double-right" aria-hidden="true"></i> ${categoryName}</span>
            <span>35</span></a>
`;
            liWithCategory.innerHTML = singleCategory;
            parentElement.appendChild(liWithCategory);
        });
    }

    // get all posts from DB by fetch and put into the HTML code of page
    async showPosts() {
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
                                 <img src="/uploads/imgs/${mainimage}" alt="post_main_img">
                                 </a>
                            </div>
                            <!-- Post Contetnt -->
                            <div class="post-content content-hide content">
                                <div class="d-flex flex-row justify-content-between">
                                <a href="/single-post/${_id}" class="post-title text-overflow">${title}</a>
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

    // get all comments from DB by fetch for some single post and show comments in single-post.hbs
    async showComments() {

        const postTitle = document.querySelector('.post-title');
        const postId = postTitle.getAttribute('id');

        const parentElement = document.querySelector('.parent_element_for_comments');
        const res = await fetch(`/single-post/comments/${postId}`);

        if (res.status !== 200) return;

        const data = await res.json();
        const {comments} = data;

        comments.map((oneComment) => {

                let singleComment;
                const date = moment(oneComment.commentDate).format('MMMM Do, YYYY');
                const {
                    guestName,
                    comment,
                } = oneComment;

                const liWithComment = document.createElement('li');

                liWithComment.classList.add('single_comment_area');

                if (!guestName) {
                    const {
                        author: {
                            username: authorName,
                            mainimage: authorAvatar
                        }
                    } = oneComment;

                    singleComment = `
                            <div class="comment-content d-flex">
                                <!-- Comment Author -->
                                <div class="comment-author">
                                    <img src="/uploads/imgs/${authorAvatar}" alt="author">
                                </div>
                                <!-- Comment Meta -->
                                <div class="comment-meta">
                                    <a href="#" class="comment-date">${date}</a>
                                    <h6>${authorName}</h6>
                                    ${comment}
                                    <div class="d-flex align-items-center">
                                        <a href="#" class="like">like</a>
                                        <a href="#" class="reply">unlike</a>
                                    </div>
                                </div>
                            </div>
`;
                }
                else {
                    singleComment = `
                            <div class="comment-content d-flex">
                                <!-- Comment Author -->
                                <div class="comment-author">
                                    <img src="/uploads/imgs/defaultAvatar.png" alt="author">
                                </div>
                                <!-- Comment Meta -->
                                <div class="comment-meta">
                                    <a href="#" class="comment-date">${date}</a>
                                    <h6>${guestName}</h6>
                                    ${comment}
                                    <div class="d-flex align-items-center">
                                        <a href="#" class="like">like</a>
                                        <a href="#" class="reply">unlike</a>
                                    </div>
                                </div>
                            </div>
`;
                }

                liWithComment.innerHTML = singleComment;
                parentElement.appendChild(liWithComment);
            }
        );
    }
}
