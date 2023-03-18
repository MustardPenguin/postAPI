import React, { useState, useEffect} from 'react';
import '../styles/post-main.css';
import { DateTime } from 'luxon';

const Posts = () => {
    const [posts, updatePosts] = useState([]);

    const readMore = (e, id, text) => {
        e.preventDefault();
        let element = document.getElementById(id);
        const p = element.querySelector('p');
        p.innerHTML = text;
    }

    const createPost = (post) => {
        return (
            <div key={post._id} className='post'>
            <div>{post.title}</div>
            <div>Posted {DateTime.fromISO(post.date).toLocaleString(DateTime.DATETIME_MED)}</div>
            <div>By {post.author.username}</div>
            <div>
                <div id={post._id}>
                    {(() => {
                        if(post.text.length > 250) {
                            const text = post.text.slice(0, 250) + "...";
                            let element;
                            element = <p>{text} <a href="/posts" onClick={(e) => readMore(e, post._id, post.text)}>Read more</a></p>;
                            return element;
                        } else {
                            return post.text;
                        }
                    })()}
                </div>
            </div>
            <div>
                
            </div>
        </div>
        )
        
    }

    useEffect(() => {
        const fetchPosts = async () => {
            await fetch("http://localhost:5000/posts")
              .then(results => {
                results.json().then(data => {
                    console.log(data);
                    updatePosts([...data.posts]);
                });
              })
              .catch();
        }

        fetchPosts();
    }, []);

    return(
        <div className='post-main-page'>
            <div className='post-holder'>
                {posts.map(post => {
                    return createPost(post);
                })}

            </div>
        </div>
    )
}

export default Posts;