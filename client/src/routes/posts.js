import React, { useState, useEffect} from 'react';
import '../styles/post-main.css';
import { DateTime } from 'luxon';
import $ from 'jquery';

const Posts = () => {
    const [posts, updatePosts] = useState([]);
    const [loading, updateLoading] = useState(false);

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

    const endOfPosts = () => { 
        const div = document.createElement('div');
        div.innerHTML = "You've reached the end!";
        div.classList.add('end-of-posts');
        const postHolder = document.querySelector('.post-holder');
        postHolder.appendChild(div);
    }

    const fetchPosts = async (params) => {
        await fetch("http://localhost:5000/posts" + (params ? params : "")
        ).then(results => {
            results.json().then(data => {
                console.log(data);
                if(data.posts.length === 0) {
                    endOfPosts();
                    return;
                }
                updatePosts(posts.concat(data.posts));
            });
          }).catch(err => {
            window.alert(err);
          });
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        // Checks if users scrolls near the bottom, in order to load more posts
        const loadPosts = () => {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                if(loading) { return; }
                updateLoading(true);
                console.log(document.querySelector('.end-of-posts'));
                setTimeout(() => {
                    if(document.querySelector('.end-of-posts')) { return; }
                    updateLoading(false);
                }, 1000);

                fetchPosts("?" + new URLSearchParams({
                    skip: posts.length
                }));
            }
        }

        // Scroll debounce
        function debounce(func, delay) {
            let timeoutId;
            return function(...args) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                func.apply(this, args);
              }, delay);
            };
          }

        const scrollHandler = debounce(loadPosts, 300);

        document.addEventListener('scroll', scrollHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
        };
    });

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