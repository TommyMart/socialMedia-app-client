import { useEffect, useState } from "react";
import { useUserData } from "../../contexts/UserContext";
import Cookies from 'js-cookie';
import './comments.css';



const Comments = ({ postId }) => {

    console.log('PostId received in Comment component:', postId);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editCommentContent, setEditCommentContent] = useState(''); // store new comment content data while editing
    const [editCommentId, setEditCommentId] = useState(null) // track which commented is being edited

    const { userData } = useUserData(); // Access userData from context
    const username = userData?.username;

    useEffect(() => {

        if (!postId) return; // Don't fetch comments is postId is undefined
        // Debug log
        console.log('PostId:', postId);

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/comments/${postId}/getComments`);
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
        
        const userId = userData?.userId;
        console.log('User Id:', userId, 'PostId:', postId);

        try {
            const response = await fetch(`http://localhost:3000/comments/${postId}/newComment`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, content: newComment })
        });

        if (response.ok) {
            const addedComment = await response.json();

            // Add username so buttons show without refreshing
            const newCommentWithUser = {...addedComment.comment,
                userId: { username: username },
            }
            // Add new comment to comments then reset new comment to '' 
            setComments((prevComments) => [...prevComments, newCommentWithUser]);
            setNewComment('');
        } else {
            console.error('Failed to add comment');
        }
        } catch (error) {
            console.error('Error adding commnet:', error);
        }
    };

    const handleEditSubmit = async (event, commentId) => {
        event.preventDefault();

        const userId = userData?.userId;

        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwtToken')}`
                },
                body: JSON.stringify({ content: editCommentContent, userId })
            });

                if (response.ok) {
                    const { updatedComment } = await response.json();

                    setComments(comments.map(comment => 
                        comment._id === commentId ? updatedComment : comment
                    ));

                    setEditCommentContent('');
                    setEditCommentId(null);
                } else {
                    console.error('Failed to edit comment');
                }
                } catch (error) {
                    console.error('Error editing comment:', error);
                }
            
        }

        const handleCommentDelete = async (commentId) => {
            try {
                const response = await fetch(`http://localhost:3000/comments/${commentId}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('jwtToken')}`
                    }
                });
                if (response.ok) {
                    // Remove the deleted comment from the state
                    setComments(comments.filter(comment => comment._id !== commentId));
                } else {
                    console.error('Failed to delete comment');
                }
            } catch (error) {
                console.log('Error deleting comment:', error);
            }
        };
        
        const handleEditClick = (comment) => {
            setEditCommentId(comment._id);
            setEditCommentContent(comment.content);
        };

    return (
        <div>
            <h4>Comments</h4>
            <ul className="comments">
                {comments.map(comment => (
                    <li key={comment?._id} className="comment">
                        {/* Show either the edit form or the comment content */}
                        {editCommentId === comment?._id ? (
                            <form onSubmit={(event) => handleEditSubmit(event, comment._id)}>
                                <input
                                    value={editCommentContent}
                                    onChange={(event) => setEditCommentContent(event.target.value)}
                                    required
                                />
                                <button type="submit">Save</button>
                                <button onClick={() => setEditCommentId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <p>{comment?.content}</p>
                                <p>By {comment?.userId?.username || username }</p>
                            </>
                        )}

                        {/* Only show edit and delete buttons if the user owns the comment */}
                        {comment?.userId?.username === username && (
                            <>
                                <button onClick={() => handleCommentDelete(comment._id)}>
                                    Delete
                                </button>
                                <button onClick={() => handleEditClick(comment)}>
                                    Edit
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit} className="commentInput">
                <input
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Add a comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Comments;