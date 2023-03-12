import React from 'react';
import '../styles/misc.css';

const navigation = () => {
    const clicked = (e) => {
        const element = e.target;
        if(element.innerHTML === "Blogs") {
            window.location.href = "blogs";
        } else if(element.innerHTML === "Register") {
            window.location.href = "sign-up";
        } else if(element.innerHTML === "Sign in") {
            window.location.href = "sign-in";
        } else {
            const logout = async () => {
                await fetch("http://localhost:5000/log-out", {
                    method: "POST",
                }).then(response => {

                });
            }
            logout();
        }
    }

    return(
        <div className="navigation">
            <div onClick={clicked}>Blogs</div>
            <div>
                <button onClick={clicked}>Register</button>
                <button onClick={clicked}>Sign in</button>
                <button onClick={clicked}>Log out</button>
            </div>
        </div>
    )
}

export default navigation;