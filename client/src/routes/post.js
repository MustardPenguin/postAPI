import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../styles/post-page.css';
import { DateTime } from 'luxon';
import CreateComment from './create-comment';

const Post = (props) => {
    const [post, updatePost] = useState({});
    const { id } = useParams();

    const fetchPosts = async () => {
        await fetch('http://localhost:5000/posts/' + id)
            .then(response => {
                response.json().then(data => {
                    console.log(data.post);
                    updatePost(data.post);
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

                <div className='post'>
                <div>{post.title}</div>
                    <div>Posted {DateTime.fromISO(post.date).toLocaleString(DateTime.DATETIME_MED)}</div>
                    <div>By {post.author ? post.author.username : ""}</div>
                    {(() => {
                        if(post.image) {
                            return (
                                <div className='post-image'>
                                    <img alt="" src={'http://localhost:5000/uploads/' + post.image} />
                                </div>
                            )
                        }
                    })()}
                    <div className='post-text'>
                        <div id={post._id}>
                            {post.text}
                        </div>
                    </div>
                </div>

                <div style={{
                    fontSize: 18,
                }}>Comments</div>
                <CreateComment />

                <div className='comment-holder'>
                    
                </div>

            </div>

            
        </div>
    )
}

export default Post;