let allPosts = [];
const form = document.getElementById("post-form");
const displayNoPost = () => {
  const postContainer = document.getElementById("post-container");
  const element = `
    <div id="no-posts" class="col-sm-6 .col-md-4">
         <h3>no posts yet</h3>
     </div>`;
  postContainer.insertAdjacentHTML("afterbegin", element);
};
let postData = async (url = "", body = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      token: "xyz",
    },
    body: JSON.stringify(body),
  });
  return response.json();
};
let fetchPosts = async () => {
  const respone = await fetch("https://jsonplaceholder.typicode.com/posts");
  return respone.json();
};
const postStructure = (post) => {
  const ele = `
      <div class="col-sm-6 .col-md-4">
      <div class="post-single">
            <header><h4>${post.title}</h4></header>
            <div class="post-body">
                 <p>${post.body}</p>
            </div>
            <button class="btn btn-danger btn-del-post" onclick="deletePost(this ,${post.id} )">delete</button>
      </div>
     </div>`;
  return ele;
};
const addNewPost = (post) => {
  const postContainer = document.getElementById("post-container");
  const { title, body } = post;
  if (title === "" || body === "") {
    alert("post title or body can't be empty");
  } else {
    allPosts.unshift(post);
    if (allPosts.length === 1) {
      document.getElementById("no-posts").remove();
    }

    const element = postStructure(post);
    postContainer.insertAdjacentHTML("afterbegin", element);
    postData("https://jsonplaceholder.typicode.com/posts", post).then((res) => {
      console.log(res);
    });
  }
};
const displayPosts = (posts) => {
  if (posts.length === 0) {
    displayPosts();
  } else {
    const postContainer = document.getElementById("post-container");
    let element = "";
    for (let post of posts) {
      element += postStructure(post);
    }
    postContainer.insertAdjacentHTML("afterbegin", element);
  }
};
fetchPosts().then((posts) => {
  allPosts = posts.slice(0, 5).map((post) => {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
    };
  });

  displayPosts(allPosts);
});
form.onsubmit = function (e) {
  e.preventDefault();
  const title = this["postTitle"].value.trim();
  const body = this["postContent"].value.trim();
  const id = allPosts.length + 1;
  addNewPost({ title, body, id });
  this.reset();
};
const deletePost = function (evt, id) {
  const deletePost = confirm("post will be deleted !");
  if (deletePost) {
    const index = allPosts.findIndex((post) => post.id === id);
    allPosts.splice(index, 1);
    evt.parentElement.remove();
    if (allPosts.length == 0) {
      displayNoPost();
    }
  }
};
