import { useEffect, useState } from "react";
import './comments.css';


const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/getComments`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments);
                } else {
                    console.error('Error fetching comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        // Get userData from local storage
        const userData = localStorage.getItem('userData');
        // If userData exists parse userData.userId to equal userId, otherwise,
        // make it null
        const userId = userData ? JSON.parse(userData).userId : null;
        console.log(userId);

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/postComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, postId, content: newComment })
        });

        if (response.ok) {
            const addedComment = await response.json();
            // Add new comment to comments then reset new comment to '' 
            setComments((prevComments) => [...prevComments, addedComment.comment]);
            setNewComment('');
        } else {
            console.error('Failed to add comment');
        }
        } catch (error) {
            console.error('Error adding commnet:', error);
        }
    };

    return(
        <div >
            <h4>Comments</h4>
            <ul className="comments">
                {comments.map(comment => (
                    <li key={comment._id} className="comment">
                        {comment.content}
                        <p>By {comment.userId.username}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit} className="commentInput">
                <input
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Add a comment"
                    required
                >
                </input>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Comments;