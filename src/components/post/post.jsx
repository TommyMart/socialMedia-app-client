import { useState, useEffect } from "react";
import { useUserData } from "../../contexts/UserContext";
import Comments from '../comments/comments.jsx';
import Cookies from 'js-cookie';
import './posts.css';

// Post component 
const Post = () => {
    const [newPost, setNewPost] = useState('');
    const [title, setTitle] = useState('');
    const [editPostId, setEditPostId] = useState(null);
    const [editPostContent, setEditPostContent] = useState('');
    const [editPostTitle, setEditPostTitle] = useState('');
    const { userData, removeToken } = useUserData();
    const [posts, setPosts] = useState([]);

    // Correctly extract username and userId from userData context
    const username = userData?.username; 
    const userId = userData?.userId;

    // Fetch posts from the server
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/getPosts`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwtToken')}` // Send the token in the Authorization header
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data: ', data);
                    setPosts(data.posts);
                } else {
                    console.error('Failed to fetch posts');
                    if (response.status === 401) {
                        removeToken(); // Remove token if unauthorized
                    }
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userId, removeToken]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Ensure userId, newPost, and title are defined
        if (!userId || !newPost || !title) {
            console.error('Missing required fields for post submission.');
            return;
        }

        const postData = {
            userId: userId, 
            content: newPost, 
            title: title
        };

        console.log('Debugging post data:', postData);

        try {
            const response = await fetch('http://localhost:3000/posts/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwtToken')}` // Send the token in the Authorization header
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                const createdPost = await response.json();

                // Add username so buttons populate without refreshing
                const newPostWithUser = {
                    ...createdPost.post,
                    userId: { username: username },
                    _id: createdPost.post.id, // Ensure username and id are present
                }

                // Update state with new post
                setPosts(prevPosts => [newPostWithUser, ...prevPosts]); // Prepend the new post to the posts array with username
                setNewPost(''); 
                setTitle(''); 

            } else {
                const errorData = await response.json();
                console.error('Failed to create a post:', errorData.message || errorData);
            }
        } catch (error) {
            console.error('Error submitting the post:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!postId) {
            console.error('Post ID is undefined. Cannot delete post.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwtToken')}`
                }
            });

            if (response.ok) {
                // Remove the deleted post from the state
                setPosts(posts.filter(post => post._id !== postId));
            } else {
                console.error('Failed to delete the post');
            }
        } catch (error) {
            console.error('Error deleting the post:', error);
        }
    };

    const handleEdit = async (postId) => {
        if (!postId) {
            console.error('Post ID is undefined. Cannot edit post.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/editPost`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwtToken')}`
                    },
                    body: JSON.stringify({
                        content: editPostContent,
                        title: editPostTitle,
                    }),
                });
            if (response.ok) {
                const { updatedPost } = await response.json();

                //Update the post in the state
                setPosts(posts.map(post =>
                    post._id === postId ? updatedPost : post
                ));

                setEditPostId(null); // exit edit mode
            } else {
                console.error('Failed to edit post');
            } 
        } catch (error) {
            console.error('Error editing post', error)
        }
    }

    const handleEditClick = (post) => {
        if (!post._id) {
            console.error('Post ID is undefined. Cannot edit the post.');
            return;
        }
        setEditPostId(post._id); // Set the post id to edit
        setEditPostContent(post.content); 
        setEditPostTitle(post.title);
    }

    return (
        <>
            <div className="posts">
            <div className="postEntryContainer">
            <h2>New Post</h2>
            <form onSubmit={handleSubmit} className="postForm">
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="title"
                    className="postInputTitle"
                    required
                    ></input>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="post"
                    className="postInputPost"
                    required>
                </textarea>
            <button type="submit" className="submitButton">Submit</button>
            
            </form >
            </div>
            <h2>Posts</h2>
            <ul className="postContainer">
                {Array.isArray(posts) && posts.map(post => (
                    <li key={post._id} >
                        {editPostId === post._id ? (
                            <>
                                <input
                                    value={editPostTitle}
                                    onChange={(e) => setEditPostTitle(e.target.value)}
                                    placeholder="Edit title"
                                />
                                <textarea
                                    value={editPostContent}
                                    onChange={(e) => setEditPostContent(e.target.value)}
                                    placeholder="Edit post"
                                />
                                <button onClick={() => handleEdit(post._id)}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                            <div className="post">
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                                <small>Author: <a className='author' href={`/users/${post.userId._id || userData._id}/home`}>
                                    {post.userId?.username || username}</a></small>
                                
                                {post.userId?.username === username && (
                                    <>
                                        <button onClick={() => handleDelete(post._id)}>
                                            Delete
                                        </button>
                                        <button onClick={() => handleEditClick(post)}>
                                            Edit
                                        </button>
                                    </>
                                )}
                                <Comments postId={post._id || post.id} />
                            </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
                
            </div>
        </>
    )
};

export default Post;
