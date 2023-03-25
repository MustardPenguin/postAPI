import React, { useState } from 'react';
import '../styles/create-post.css';

const CreatePost = (props) => {
    const [form, updateForm] = useState({
        title: '',
        text: '',
        image: null,
    });
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('text', form.text);
        formData.append('image', form.image);


        await fetch("http://localhost:5000/posts", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            body: formData
        }).then(response => {
            response.json().then(data => {
                if(data.created) {
                    window.location.href = '/posts';
                } else if(data.message) {
                    window.alert(data.message);
                }
            });
        }).catch(err => {

        });
    }
    const onChange = (e) => {
        const value = e.target.name === "image" ? e.target.files[0] : e.target.value;
        updateForm({...form, [e.target.name]: value});
    }
    
    return (
        <div className='create-post-page'>
            {
                props.user ?
                (
                    <div className='create-post-holder'>
                        <div>Create post</div>

                        <div className='create-post-form'>
                            <form onSubmit={(e) => onSubmit(e)} encType="multipart/form-data">
                                <div>
                                    <label htmlFor='title'>Title: </label>
                                    <input type='text' required={true} name='title' onChange={onChange} />
                                </div>

                                <div>
                                    <label htmlFor='image'>Image: </label>
                                    <input type='file' name='image' onChange={onChange} />
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