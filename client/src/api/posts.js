import { BASE_URL } from "../config";

const getUserLikedPosts = async (likerId, token, query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/posts/liked/" +
        likerId +
        "?" +
        new URLSearchParams(query),
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getPosts = async (token, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/posts?" + new URLSearchParams(query),
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getPost = async (postId, token) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUserLikes = async (postId, anchor) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/posts/like/" +
        postId +
        "/users?" +
        new URLSearchParams({
          anchor,
        })
    );

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createPost = async (formData) => {
  try {
    const res = await fetch(BASE_URL + "api/posts", {
      method: "POST",
      body: formData, // FormData must be sent as-is
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create post");
    }

    return await res.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};


const updatePost = async (postId, user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deletePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const likePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/like/" + postId, {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const unlikePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/like/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getUserLikedPosts,
  likePost,
  unlikePost,
  getUserLikes,
};
