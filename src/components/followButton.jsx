import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';



const FollowButton = ({ targetUserId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const fetchFollowData = async () => {
        const token = Cookies.get('jwtToken');

        if (!token) {
            console.error('Token is missing');
            return;
        }
         try {
            const response = await fetch(`http://localhost:3000/follow/${targetUserId}/status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Debug
            console.log('Token being sent via heaer:', `Bearer ${token}`);

            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
                setFollowersCount(data.followersCount);
                setFollowingCount(data.followingCount);
            }
        } catch (error) {
            console.error('Error fetching following and followers count', error);
    } 
    };

    // fetches follow data for each target user
    useEffect(() => {
        fetchFollowData();
    }, [targetUserId]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/follow/${targetUserId}/follow`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
                
            });

            if (response.ok) {
                setIsFollowing(true);
                setFollowersCount(prevCount => prevCount + 1);
            }
        } catch (error) {
            console.error('Error following user:', error)
        }}

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://localhost:3000/follow/${targetUserId}/unfollow`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
                
            });

            if (response.ok) {
                setIsFollowing(false);
                setFollowersCount(prevCount => prevCount - 1);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    return(
        <div>
            <button onClick={isFollowing ? handleUnfollow : handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <p>Followers: {followersCount}</p>
            <p>Following: {followingCount}</p>
        </div>
    );
};


export default FollowButton;