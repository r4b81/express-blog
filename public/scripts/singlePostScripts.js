window.onload = function () {
  const bookmarks = document.getElementsByClassName("bookmark");
  [...bookmarks].forEach((bookmark) => {
    bookmark.style.cursor = "pointer";
    bookmark.addEventListener("click", function (e) {
      let target = e.target.parentElement;

      let headers = new Headers();
      headers.append("Accept", "Application/JSON");

      let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
        method: "GET",
        headers,
        mode: "cors",
      });

      fetch(req)
        .then((req) => req.json())
        .then((data) => {
          if (data.bookmarked) {
            target.innerHTML = '<i class="fas fa-bookmark"></i>';
          } else {
            target.innerHTML = '<i class="far fa-bookmark"></i>';
          }
        })
        .catch((e) => {
          console.error(e.response.data.error);
          alert(e.response.data.error);
        });
    });
  });

  const comment = document.getElementById("comment");
  const commentHolder = document.getElementById("comment-holder");

  comment.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (e.target.value) {
        let postId = e.target.dataset.post;
        let data = {
          body: e.target.value,
        };
        let req = generateRequest(`/api/comment/${postId}`, "POST", data);

        fetch(req)
          .then((res) => res.json())
          .then((data) => {
            let commentElement = createComment(data);
            commentHolder.insertBefore(
              commentElement,
              commentHolder.children[0]
            );
            e.target.value = "";
          })
          .catch((e) => {
            console.log(e.message);
            alert(e.message);
          });
      } else {
        alert("Please Enter A valid Comment");
      }
    }
  });

  commentHolder.addEventListener("keypress", function (e) {
    if (commentHolder.hasChildNodes(e.target)) {
      if (e.key === "Enter") {
        let commentId = e.target.dataset.comment;
        let value = e.target.value;

        if (value) {
          let data = {
            body: value,
          };

          let req = generateRequest(
            `/api/comment/reply/${commentId}`,
            "POST",
            data
          );

          fetch(req)
            .then((res) => res.json())
            .then((data) => {
              let replyElement = createReplyElement(data);
              let parent = e.target.parentElement;
              parent.previousElementSibling.appendChild(replyElement);
              e.target.value = "";
            })
            .catch((e) => {
              console.log(e);
              alert(e.message);
            });
        } else {
          alert("Please Enter A Valid Reply");
        }
      }
    }
  });

  function generateRequest(url, method, body) {
    let headers = new Headers();
    headers.append("Accept", "Application/JSON");
    headers.append("Content-Type", "Application/JSON");

    let req = new Request(url, {
      method,
      headers,
      body: JSON.stringify(body),
      mode: "cors",
    });

    return req;
  }

  function createComment(comment) {
    let innerHTML = `<img class="mr-3 rounded-circle" src="${comment.user.profilePics}" width="40">
  <div class="media-body">

    <p>${comment.body}</p>

    <div class="my-3">
      <input type="text" class="form-control" placeholder="Press Enter to Reply" name="reply" data-comment='${comment._id}'>
    </div>
  </div>`;

    let div = document.createElement("div");
    div.className = "media border pt-3";
    div.innerHTML = innerHTML;

    return div;
  }

  function createReplyElement(reply) {
    let innerHTML = `<img class="mr-3 rounded-circle" src="${reply.profilePics}" width="40"/>
                      <div class="media-body">
                        <p>${reply.body}</p>
                      </div>`;
    let div = document.createElement("div");
    div.className = "media mt-3";
    div.innerHTML = innerHTML;

    return div;
  }

  let likeBtn = document.getElementById("likeBtn");
  let dislikeBtn = document.getElementById("dislikeBtn");

  likeBtn.addEventListener("click", function (e) {
    let postId = e.target.dataset.post;
    reqLikeDislike("likes", postId)
      .then((req) => req.json())
      .then((data) => {
        let likeText = data.liked
          ? `Liked ( ${data.totalLikes} )`
          : `Like ( ${data.totalLikes} )`;
        let dislikeText = `Dislike ( ${data.totalDislikes} )`;

        likeBtn.innerHTML = likeText;
        dislikeBtn.innerHTML = dislikeText;
      })
      .catch((e) => {
        console.log(e.response.data.error);
        alert("e.response.data.error");
      });
  });

  dislikeBtn.addEventListener("click", function (e) {
    let postId = e.target.dataset.post;
    reqLikeDislike("dislikes", postId)
      .then((req) => req.json())
      .then((data) => {
        let dislikeText = data.disliked
          ? `Disliked ( ${data.totalDislikes} )`
          : `Dislike ( ${data.totalDislikes} )`;
        let likeText = `Like ( ${data.totalLikes} )`;

        likeBtn.innerHTML = likeText;
        dislikeBtn.innerHTML = dislikeText;
      })
      .catch((e) => {
        console.log(e.response.data.error);
        alert("e.response.data.error");
      });
  });

  function reqLikeDislike(type, postId) {
    let headers = new Headers();
    headers.append("Accept", "Application/JSON");
    headers.append("Content-Type", "Application/JSON");
    let req = new Request(`/api/${type}/${postId}`, {
      method: "GET",
      headers,
      mode: "cors",
    });
    return fetch(req);
  }
};
