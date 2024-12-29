import React, { useEffect, useState } from 'react';
import { getPosts, createPost, deletePost, updatePost } from '../api/posts';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      const data = await getPosts(token);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    const createdPost = await createPost(token, newPost);
    setPosts((prev) => [...prev, createdPost]);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    await deletePost(postId, token);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h1>Posts</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        ></textarea>
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
