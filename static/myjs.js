// login
function sign_in() {
  let username = $("#input-username").val();
  let password = $("#input-password").val();

  if (username === "") {
    $("#help-id-login").text("Please input your id.");
    $("#input-username").focus();
    return;
  } else {
    $("#help-id-login").text("");
  }

  if (password === "") {
    $("#help-password-login").text("Please input your password.");
    $("#input-password").focus();
    return;
  } else {
    $("#help-password-login").text("");
  }

  $.ajax({
    type: "POST",
    url: "/sign_in",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      if (response["result"] === "success") {
        $.cookie("mytoken", response["token"], { path: "/" });
        window.location.replace("/");
      } else {
        alert(response["msg"]);
      }
    },
  });
}

// fungsi javascript toggleClass untuk mengecek apakah suatu target memuliki class tertentu, apabilas sudah, maka akan dihilangkan
function toggle_sign_up() {
  $("#sign-up-box").toggleClass("is-hidden");
  $("#div-sign-in-or-up").toggleClass("is-hidden");
  $("#btn-check-dup").toggleClass("is-hidden");
  $("#help-id").toggleClass("is-hidden");
  $("#help-password").toggleClass("is-hidden");
  $("#help-password2").toggleClass("is-hidden");
}
function is_nickname(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
  return regExp.test(asValue);
}

function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

function check_dup() {
  let username = $("#input-username").val();
  console.log(username);
  if (username === "") {
    $("#help-id")
      .text("Enter in your id")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-username").focus();
    return;
  }
  if (!is_nickname(username)) {
    $("#help-id")
      .text(
        "Please check your id. For your id, please enter 2-10 English characters, numbers, or the following special characters (._-)"
      )
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-username").focus();
    return;
  }
  $("#help-id").addClass("is-loading");
  $.ajax({
    type: "POST",
    url: "/sign_up/check_dup",
    data: {
      username_give: username,
    },
    success: function (response) {
      console.log(response);
      if (response["exists"]) {
        $("#help-id")
          .text("This id is already in use.")
          .removeClass("is-safe")
          .addClass("is-danger");
        $("#input-username").focus();
      } else {
        $("#help-id")
          .text("This id is available!")
          .removeClass("is-danger")
          .addClass("is-success");
      }
      $("#help-id").removeClass("is-loading");
    },
  });
}

function sign_up() {
  let username = $("#input-username").val();
  let password = $("#input-password").val();
  let password2 = $("#input-password2").val();

  if ($("#help-id").hasClass("is-danger")) {
    alert("Please check your id");
    return;
  } else if (!$("#help-id").hasClass("is-success")) {
    alert("Please double check your id");
    return;
  }

  if (password === "") {
    $("#help-password")
      .text("Please enter your password")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password").focus();
    return;
  } else if (!is_password(password)) {
    $("#help-password")
      .text(
        "Please check your password. For your password, please enter 8-20 English characters, numbers, or the following special characters (!@#$%^&*)"
      )
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password").focus();
    return;
  } else {
    $("#help-password")
      .text("This password can be used!")
      .removeClass("is-danger")
      .addClass("is-success");
  }
  if (password2 === "") {
    $("#help-password2")
      .text("Please enter your password")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password2").focus();
    return;
  } else if (password2 !== password) {
    $("#help-password2")
      .text("Your passwords do not match")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password2").focus();
    return;
  } else {
    $("#help-password2")
      .text("Your passwords match!!!")
      .removeClass("is-danger")
      .addClass("is-success");
  }
  $.ajax({
    type: "POST",
    url: "/sign_up/save",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      alert("Your are signed up! Nice!");
      window.location.replace("/login");
    },
  });
}

function clearInputs() {
  $("#input-username").val("");
  $("#input-password").val("");
  $("#input-password2").val("");
}
// end login

// index
function post() {
  let comment = $("#textarea-post").val();
  let today = new Date().toISOString();
  console.log(comment);
  $.ajax({
    type: "POST",
    url: "/posting",
    data: {
      comment_give: comment,
      date_give: today,
    },
    success: function (response) {
      $("#modal-post").removeClass("is-active");
      console.log(response["msg"]);
      window.location.reload();
    },
  });
}

function time2str(date) {
  let today = new Date();
  let time = (today - date) / 1000 / 60;
  if (time < 60) {
    return parseInt(time) + " minutes ago";
  }
  time = time / 60;
  if (time < 24) {
    return parseInt(time) + " hours ago";
  }
  time = time / 24;
  if (time < 7) {
    return parseInt(time) + " days ago";
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}.${month}.${day}`;
}

function num2str(count) {
  if (count > 1000) {
    return parseInt(count / 1000) + "k";
  }
  if (count > 500) {
    return parseInt(count / 100) / 10 + "k";
  }
  if (count == 0) {
    return "";
  }

  return count;
}

function get_posts(username) {
  if (username === undefined) {
    username = "";
  }
  $("#post-box").empty();
  $.ajax({
    type: "GET",
    url: `/get_posts?username_give=${username}`,
    data: {},
    success: function (response) {
      if (response["result"] === "success") {
        let posts = response["posts"];
        for (let i = 0; i < posts.length; i++) {
          let post = posts[i];
          let time_post = new Date(post["date"]);
          let time_before = time2str(time_post);
          let class_heart = post["heart_by_me"] ? "fa-heart" : "fa-heart-o";
          let class_star = post["star_by_me"] ? "fa-star" : "fa-star-o";
          let class_thumbsup = post["thumbsup_by_me"]
            ? "fa-thumbs-up"
            : "fa-thumbs-o-up";
          // if(post['heart_by_me']){
          //   class_heart = 'fa-heart';
          // }else {
          //   class_heart = 'fa-heart-o'
          // }
          let html_temp = `
            <div class="box" id="${post["_id"]}">
      <article class="media">
        <div class="media-left">
          <a class="image is-64x64" href="/user/${post["username"]}">
            <img class="is-rounded" src="/static/${
              post["profile_pic_real"]
            }" alt="image"/>
          </a>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${post["profile_name"]}</strong> <small>@${
            post["username"]
          }</small>
              <small>· ${time_before}</small>
              <br />
              ${post["comment"]}
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a
                class="level-item is-sparta"
                aria-label="heart"
                onclick="toggle_like('${post["_id"]}', 'heart')"
              >
                <span class="icon is-small"
                  ><i class="fa ${class_heart}" aria-hidden="true"></i></span
                >&nbsp;<span class="like-num">${num2str(
                  post["count_heart"]
                )}</span>
              </a>

              <a
                class="level-item is-yellow"
                aria-label="star"
                onclick="toggle_star('${post["_id"]}', 'star')"
              >
                <span class="icon is-small"
                  ><i class="fa ${class_star}" aria-hidden="true"></i></span
                >&nbsp;<span class="like-num">${num2str(
                  post["count_star"]
                )}</span>
              </a>

              <a
                class="level-item"
                aria-label="thumbsup"
                onclick="toggle_thumbsup('${post["_id"]}', 'thumbsup')"
              >
                <span class="icon is-small is-warning"
                  ><i class="fa ${class_thumbsup}" aria-hidden="true"></i></span
                >&nbsp;<span class="like-num">${num2str(
                  post["count_thumbsup"]
                )}</span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
            `;
          $("#post-box").append(html_temp);
        }
      }
    },
  });
}

function toggle_like(post_id, type) {
  let $a_like = $(`#${post_id} a[aria-label = 'heart']`);
  let $i_like = $a_like.find("i");

  if ($i_like.hasClass("fa-heart")) {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "unlike",
      },
      success: function (response) {
        $i_like.addClass("fa-heart-o").removeClass("fa-heart");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "like",
      },
      success: function (response) {
        $i_like.addClass("fa-heart").removeClass("fa-heart-o");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  }
}

function toggle_star(post_id, type) {
  let $a_like = $(`#${post_id} a[aria-label = 'star']`);
  let $i_like = $a_like.find("i");

  if ($i_like.hasClass("fa-star")) {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "unlike",
      },
      success: function (response) {
        $i_like.addClass("fa-star-o").removeClass("fa-star");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "like",
      },
      success: function (response) {
        $i_like.addClass("fa-star").removeClass("fa-star-o");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  }
}

function toggle_thumbsup(post_id, type) {
  let $a_like = $(`#${post_id} a[aria-label = 'thumbsup']`);
  let $i_like = $a_like.find("i");

  if ($i_like.hasClass("fa-thumbsup")) {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "unlike",
      },
      success: function (response) {
        $i_like.addClass("fa-thumbs-o-up").removeClass("fa-thumbs-up");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
        post_id_give: post_id,
        type_give: type,
        action_give: "like",
      },
      success: function (response) {
        $i_like.addClass("fa-thumbs-up").removeClass("fa-thumbs-o-up");
        $a_like.find("span.like-num").text(num2str(response["count"]));
      },
    });
  }
}
// end index

// user
function sign_out() {
  $.removeCookie("mytoken", { path: "/" });
  alert("Signed out!");
  window.location.href = "/login";
}

function update_profile() {
  let name = $("#input-name").val();
  let file = $("#input-pic")[0].files[0];
  let about = $("#textarea-about").val();
  let form_data = new FormData();
  form_data.append("file_give", file);
  form_data.append("name_give", name);
  form_data.append("about_give", about);

  console.log(file, name, about, form_data);

  $.ajax({
    type: "POST",
    url: "/update_profile",
    data: form_data,
    cache: false,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response["result"] === "success") {
        alert(response["msg"]);
        window.location.reload();
      }
    },
  });
}
// end user
