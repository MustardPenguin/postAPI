

const Comment = (props) => {
    const comment = props.comment;
    return(
        <div className='comment'>
            <div>{comment.username.username}</div>
            <div>{comment.comment}</div>
        </div>
    )
}

export default Comment;