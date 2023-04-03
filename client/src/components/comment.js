import { DateTime } from 'luxon';

const Comment = (props) => {
    const comment = props.comment;
    return(
        <div className='comment'>
            <div>{comment.username.username}, {DateTime.fromISO(comment.date).toLocaleString(DateTime.DATETIME_MED)}</div>
            <div>{comment.comment}</div>
        </div>
    )
}

export default Comment;