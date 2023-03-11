import React, { useState } from 'react';

const Signup = () => {
    const [form, updateForm] = useState({
        username: "",
        password: "",
    });

    const onChange = (e) => {
        if(e.target.id === 'password') {
            updateForm({...form, password: e.target.value});
        } else {
            updateForm({...form, username: e.target.value});
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        }).then(response => {
            if(response.ok) {
                return response.json().then(data => {
                    window.alert(data.message);
                });
            }
            console.log(response.json());
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
                <input type='text' id='username' name='username' onChange={onChange} required />

                <label htmlFor='password'>
                    Password: 
                </label>
                <input type='password' id='password' name='password' onChange={onChange} required />

                <input type="submit" />
            </form>
        </div>
    )
}

export default Signup;