import { BASE_URL } from "../config";

export const getUserLikedPosts = async (likerId, token, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/posts/liked/" + likerId + "?" + new URLSearchParams(query),
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

export const getPosts = async (token, query) => {
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

export const getPost = async (postId, token) => {
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

export const createPost = async (token, postData) => {
  try {
    const res = await fetch(BASE_URL + "api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(postData),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = async (postId, token, postData) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(postData),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId, token) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};
