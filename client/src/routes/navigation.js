import React from 'react';
import '../styles/misc.css';

const navigation = (props) => {
    const clicked = (e) => {
        const element = e.target;
        if(element.innerHTML === "Posts") {
            window.location.href = "/posts";
        } else if(element.innerHTML === "Register") {
            window.location.href = "/sign-up";
        } else if(element.innerHTML === "Sign in") {
            window.location.href = "/sign-in";
        } else if(element.innerHTML === 'Create post') {
            window.location.href = "/create-post"
        } else {
            if(localStorage.getItem('token') == null) { return; }
            const logout = async () => {
                await fetch("http://localhost:5000/auth/log-out", {
                    method: "GET",
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                }).then(response => {
                    localStorage.removeItem('token');
                    props.user.updateUser("");
                    window.location.reload();
                });
            }
            logout();
        }
    }

    return(
        <div className="navigation">
            <div onClick={clicked}>Posts</div>
            {props.user.username !== null && props.user.username !== ""
                ? <div className='navigation-logged-in'>
                    <div>Welcome {props.user.username}!</div>
                    <button onClick={clicked}>Create post</button>
                    <button onClick={clicked}>Log out</button>
                </div>
                : <div>
                    <button onClick={clicked}>Register</button>
                    <button onClick={clicked}>Sign in</button>
                </div>
            }
        </div>
    )
}

export default navigation;