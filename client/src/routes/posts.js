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

    const getText = (post) => {
        const lineBreaks = post.text.split(/\r\n|\r|\n/).length;
        if(lineBreaks > 4 && post.text.length < 250) {
            // Looks for the fifth line break
            let count = 0;
            let position = -1;
            for(let i = 0; i < post.text.length - 1; i++) {
                if(post.text.slice(i, i + 1) === "\n") {
                    count++;
                    if(count === 5) {
                        position = i;
                        break;
                    }
                }
            }
            const text = post.text.slice(0, position);
            let element;
            element = <p>{text} <a href="/posts" onClick={(e) => readMore(e, post._id, post.text)}>Read more</a></p>;
            return element;
        } else if(post.text.length > 250) {
            const text = post.text.slice(0, 250) + "...";
            let element;
            element = <p>{text} <a href="/posts" onClick={(e) => readMore(e, post._id, post.text)}>Read more</a></p>;
            return element;
        } else {
            return post.text;
        }
    }

    const createPost = (post) => {
        return (
            <div key={post._id} className='post'>
            <div>{post.title}</div>
            <div>Posted {DateTime.fromISO(post.date).toLocaleString(DateTime.DATETIME_MED)}</div>
            <div>By {post.author.username}</div>
            <div>
                <div id={post._id}>
                    {getText(post)}
                </div>
            </div>
            <div className='post-options'>
                <button>Like</button>
                <div>0 likes</div>
                <div>0 comments</div>
                <button>Go to post</button>
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