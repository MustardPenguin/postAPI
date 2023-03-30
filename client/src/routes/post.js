import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../styles/post-page.css';

const Post = () => {
    const [post, updatePost] = useState({});
    const { id } = useParams();

    const fetchPosts = async () => {
        await fetch('http://localhost:5000/posts/' + id)
            .then(response => {
                response.json().then(data => {
                    console.log(data);
                });
            }).catch(err => {
                window.alert(err);
            }
        );
    }
    
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='post-main-page'>
            <div className='post-holder'>
                <div className='post'>a</div>
            </div>
        </div>
    )
}

export default Post;