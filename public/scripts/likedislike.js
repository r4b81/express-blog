window.onload = function () {
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
