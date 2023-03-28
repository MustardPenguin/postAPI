import React, { useState, useEffect} from 'react';
import '../styles/post-main.css';
import $ from 'jquery';
import CreatePost from '../components/post';

const Posts = () => {
    const [posts, updatePosts] = useState([]);
    const [loading, updateLoading] = useState(false);

    const endOfPosts = () => { 
        const div = document.createElement('div');
        div.innerHTML = "You've reached the end!";
        div.classList.add('end-of-posts');
        const postHolder = document.querySelector('.post-holder');
        postHolder.appendChild(div);

        const indicator = document.querySelector('.loading-indicator');
        if(indicator) { indicator.remove(); }
    }

    const fetchPosts = async (params) => {
        await fetch("http://localhost:5000/posts" + (params ? params : ""),{
            headers: {
                "x-access-token": localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
        }, 
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
        fetchPosts("?" + new URLSearchParams({
            skip: 0
        }));
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
                    return CreatePost(post);
                })}
                <div className='loading-indicator'>
                    {loading === true ? "Loading more posts..." : ""}
                </div>
            </div>
        </div>
    )
}

export default Posts;