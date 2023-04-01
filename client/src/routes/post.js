import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../styles/post-page.css';
import { DateTime } from 'luxon';
import CreateComment from './create-comment';

const Post = (props) => {
    const [post, updatePost] = useState({});
    const { id } = useParams();

    const fetchPosts = async () => {
        const params = "?" + new URLSearchParams({
            skip: 0
        });
        await fetch('http://localhost:5000/posts/' + id + params, {
            method: 'GET',
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        }).then(response => {
                response.json().then(data => {
                    console.log(data.post);
                    updatePost(data.post);
                });
            }).catch(err => {
                console.log(err);
                window.alert(err);
            }
        );
    }
    
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const CreateCommentElement = (comment) => {
        comment = {
            username: "test", comment: "test"
        }

        return (
            <div className='comment'>
                <div>{comment.username}</div>
            </div>
        )
    }

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

                    <div className='post-options'>
                        <button >
                            {post.liked ? "Unlike" : "Like"}</button>
                        <div>{post.likes} likes</div>
                        <div>0 comments</div>
                    </div>
                </div>

                <div style={{
                    fontSize: 18,
                }}>Create Comment</div>
                <CreateComment user={props.user} postId={post._id} />
                <div style={{
                    fontSize: 18,
                }}>Comments</div>
                <div className='comment-holder'>
                    {CreateCommentElement()}
                </div>

            </div>

            
        </div>
    )
}

export default Post;