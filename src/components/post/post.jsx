import { useState } from "react"
import { useUserData } from "../../contexts/UserContext";
import './posts.css'

const Post = () => {
    const [newPost, setNewPost] = useState('');
    const [title, setTitle] = useState('');
    const userData = useUserData();
    const [posts, setPosts] = useState([]);
    // const [location, setLocation] = useState('');
    // const [tags, setTags] = useState('');
    // commnet

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/users/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    // userId: userData.id, 
                    content: newPost, 
                    title: title,
                    // location: location,
                    // tags: tags.split(', ').map(tag => tag.trim())

                }),
            });

            if (response.ok) {
                const createdPost = await response.json();
                
                // Update state with new post 
                setPosts([...posts, { ...createdPost.post, id: createdPost.post.id }]);
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
                {posts.map(post => (
                    <li key={post.id} className="post">
                        <p>{post.content}</p>
                        {/* <small>Posted by: {userData.username}</small> */}
                        <small>Title: {post.title}</small>
                        {/* <small>Location: {post.location}</small>
                        <small>Tags: {post.tags.join(', ')}</small> */}
                    </li>
                ))}
            </ul>
                
            </div>
        </>
    )
}

export default Post;