import React from 'react';

const signup = () => {
    const onSubmit = async (e) => {
        e.preventDefault();

        console.log("Log");
        await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                body: JSON.stringify({}),
            }
        }).catch(err => {
            window.alert(err);
            return;
        });
    }

    return(
        <div className='form' onSubmit={onSubmit}>
            <form method="post" action="">
                <label htmlFor='username'>
                    Username: 
                </label>
                <input type='text' id='username' required />

                <label htmlFor='password'>
                    Password: 
                </label>
                <input type='password' id='password' required />

                <input type="submit" />
            </form>
        </div>
    )
}

export default signup;