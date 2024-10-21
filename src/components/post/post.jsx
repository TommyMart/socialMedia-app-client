import { useState, useEffect } from "react"
import { useUserData } from "../../contexts/UserContext";
import Comments from '../comments/comments.jsx';
import './posts.css'

const Post = () => {
    const [newPost, setNewPost] = useState('');
    const [title, setTitle] = useState('');
    const [editPostId, setEditPostId] = useState(null);
    const [editPostContent, setEditPostContent] = useState('');
    const [editPostTitle, setEditPostTitle] = useState('');
    const userData = useUserData();
    const [posts, setPosts] = useState([]);
    // const [location, setLocation] = useState('');
    // const [tags, setTags] = useState('');
    // commnet


    const username = userData.username || (localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).username : null);

    const userId = userData.userId || (localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).userId : null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/posts`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data: ', data);
                    setPosts(data.posts);
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userId]); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        const postData = {
            userId: userId, 
            content: newPost, 
            title: title
        };

        console.log('Debugging post data:', postData);

        try {
            const response = await fetch('http://localhost:3000/users/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ postData })
                body: JSON.stringify({ 
                    userId: userId, 
                    content: newPost, 
                    title: title
                //     // location: location,
                //     // tags: tags.split(', ').map(tag => tag.trim())

                }),
            });

            if (response.ok) {
                const createdPost = await response.json();
                
                // Update state with new post that includes userId (with username)
                setPosts(prevPosts => [createdPost.post, ...prevPosts]); // Prepend the new post to the posts array
                setNewPost(''); 
                setTitle(''); 
                // setLocation(''); 
                // setTags(''); 

            } else {
                console.error('Failed to create a post');
            }
        } catch (error) {
            console.error('Error submitting the post:', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/users/post/${postId}`, {
                method: 'DELETE',
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
        try {
            const response = await fetch(`http://localhost:3000/users/post/${postId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editPostContent,
                        title: editPostTitle,
                    }),
                });
            if (response.ok) {
                const updatedPost = await response.json();
                //Update the post in the state
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, ...updatedPost } : post
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
        setEditPostId(post._id); // Set the post id to edit
        setEditPostContent(post.content); 
        setEditPostTitle(post.title);
    }

    return (
        <>
            <div className="posts">
            <div className="postEntryContainer">
            <h2>New Post</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="title"
                    required
                    ></input>
                    {/* <input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="location"
                    ></input> */}
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="post"
                    required>
                </textarea>
                {/* <textarea
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tags"
                    >
                    
                </textarea> */}
            <button type="submit">Submit</button>
            
            </form >
            </div>
            <h2>Posts</h2>
            <ul className="postContainer">
                {Array.isArray(posts) && posts.map(post => (
                    <li key={post._id} className="post">
                        {/* Check if in edit mode for the current post */}
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
                                <p>{post.content}</p>
                                <small>Posted by: {post.userId?.username || username}</small>
                                <small>Title: {post.title}</small>
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
                                <Comments postId={post._id} />
                            </>
                        )}
                    </li>
                ))}
            </ul>
                
            </div>
        </>
    )
}

export default Post;