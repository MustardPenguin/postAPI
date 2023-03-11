import React from 'react';
import '../styles/misc.css';

const navigation = () => {
    const clicked = (e) => {
        const element = e.target;
        if(element.innerHTML === "Blogs") {
            window.location.href = "blogs";
        } else if(element.innerHTML === "Register") {
            window.location.href = "sign-up";
        } else {
            window.location.href = "sign-in";
        }
    }

    return(
        <div className="navigation">
            <div onClick={clicked}>Blogs</div>
            <div>
                <button onClick={clicked}>Register</button>
                <button onClick={clicked}>Sign in</button>
            </div>
        </div>
    )
}

export default navigation;