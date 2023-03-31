import React, { useState } from 'react';


const CreateComment = (props) => {
    const [comment, updateComment] = useState("");

    const onChange = (e) => {
        updateComment(e.target.value);
    }


    const onSubmit = async (e) => {
        // For some unknown reason, when this function calls, everything seems to break?
        // Calling it then visiting sign-in or sign-up just... breaks everything...
        // 
        e.preventDefault();
        if(props.user === "") {
            window.alert("Please log in first.");
            return;
        }
        
        await fetch('http://localhost:5000/comments', {
            method: 'POST',
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "comment": comment })
        }).then(response => {
            response.json().then(data => {
                console.log(data);
            });
        }).catch(err => {
            window.alert(err);
        });
    }

    return(
        <div className='comment-form'>
            <form method='post' onSubmit={(e) => onSubmit(e)}>
                <label htmlFor='comment' />
                <textarea name='comment' required={true} rows={4} onChange={(e) => onChange(e)} />
                
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default CreateComment;