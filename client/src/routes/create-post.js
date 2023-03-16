import React, { useState } from 'react';
import '../styles/create-post.css';

const CreatePost = (props) => {
    const [form, updateForm] = useState({
        title: '',
        text: '',
    });
    const onSubmit = async (e) => {
        e.preventDefault();
        
        await fetch("http://localhost:5000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify(form)
        }).then(response => {
            response.json().then(data => {
                if(data.created) {
                    window.location.href = '/posts'
                }
            });
        }).catch(err => {

        });
    }
    const onChange = (e) => {
        updateForm({...form, [e.target.name]: e.target.value});
    }
    
    return (
        <div className='create-post-page'>
            {
                props.user ?
                (
                    <div className='create-post-holder'>
                        <div>Create post</div>

                        <div className='create-post-form'>
                            <form onSubmit={(e) => onSubmit(e)}>
                                <div>
                                    <label htmlFor='title'>Title: </label>
                                    <input type='text' required={true} name='title' onChange={onChange} />
                                </div>
                                
                                <div>
                                    <label htmlFor='text'>Text: </label>
                                    <textarea name='text' required={true} rows={6} onChange={onChange} />
                                </div>

                                <div className='create-post-submit'>
                                    <button type='submit'>Create</button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                ) :
                (
                    <div>Please log in first</div>
                )
            }
        </div>
    )
}

export default CreatePost;