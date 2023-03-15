import React, { useState } from 'react';
import '../styles/registration.css';

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
        await fetch("http://localhost:5000/auth/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        }).then(response => {
            if(response.status === 401) {
                window.alert("Invalid account information");
                return;
            }
            console.log(response);
            if(response.ok) {
                response.json().then(data => {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'blogs';
                });
            }
        }).catch(err => {
            window.alert(err);
        });
    }

    return(
        <div className='form' onSubmit={onSubmit}>
            <div className='form-holder'>
                <div>
                    Sign in
                </div>
                <form method="post" action="">
                    <div className='form-field'>
                        <label htmlFor='username'>
                            Username
                        </label>
                        <input type='text' id='username' name='username' onChange={onChange} required />

                    </div>
                    
                    <div className='form-field'>
                        <label htmlFor='password'>
                            Password
                        </label>
                        <input type='password' id='password' name='password' onChange={onChange} required />
                    </div>

                    <div className='form-submit'>
                        <input type="submit" />
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Signup;