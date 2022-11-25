import React, { useState } from 'react'
import './index.css'

function CommentBox({comment, setComment, handleAddCommentNest, handleEditCommentNest, handleDeleteCommentNest, loadMore}) {
    const [ toggleReply, setToggleReply ] = useState(false)
    const [ id, setId ] = useState(-1)
    // const [ showEdit, setShowEdit ] = useState(true)
    const [ userComment, setUserComment ] = useState({name:'', text:''})
    const [ editComment , setEditComment ] = useState({
        showEdit : false,
        editText:'',
        editOrSave:'Edit'
    })

    function fromNow(date, nowDate = Date.now(), rft = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })) {
        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;
        const WEEK = 7 * DAY;
        const MONTH = 30 * DAY;
        const YEAR = 365 * DAY;
        const intervals = [
            { ge: YEAR, divisor: YEAR, unit: 'year' },
            { ge: MONTH, divisor: MONTH, unit: 'month' },
            { ge: WEEK, divisor: WEEK, unit: 'week' },
            { ge: DAY, divisor: DAY, unit: 'day' },
            { ge: HOUR, divisor: HOUR, unit: 'hour' },
            { ge: MINUTE, divisor: MINUTE, unit: 'minute' },
            { ge: 30 * SECOND, divisor: SECOND, unit: 'seconds' },
            { ge: 0, divisor: 1, text: 'just now' },
        ];
        const now = typeof nowDate === 'object' ? nowDate.getTime() : new Date(nowDate).getTime();
        const diff = now - (typeof date === 'object' ? date : new Date(date)).getTime();
        const diffAbs = Math.abs(diff);
        for (const interval of intervals) {
            if (diffAbs >= interval.ge) {
                const x = Math.round(Math.abs(diff) / interval.divisor);
                const isFuture = diff < 0;
                return interval.unit ? rft.format(isFuture ? x : -x, interval.unit) : interval.text;
            }
        }
    }

    
    const handleReply = (com)=>{
        setId(com.id)
        if (id != com.id ){
          setToggleReply(true)
        } else {
            setToggleReply(!toggleReply)
        }
       // window.scrollTo(0, document.body.scrollHeight);
    }

    const handleDelete = (com)=>{
        handleDeleteCommentNest(com)
    }

     const handleAddComment = (com,userComment)=>{
        handleAddCommentNest(com,userComment)
        setUserComment({name:'', text:''})
        setToggleReply(!toggleReply)
        setId('')
     }

     const handleEditComment = (com)=>{
      if (editComment.editOrSave == 'Edit'){
        setEditComment({
        ...editComment,
        showEdit:!editComment.showEdit,
        editText:com.text,
        editOrSave:'Save'
      })
     } else {
        setEditComment({
            ...editComment,
            showEdit:!editComment.showEdit,
            editText:com.text,
            editOrSave:'Edit'
          })
          handleEditCommentNest(com,editComment.editText)
      }

     }

    return (<>   
            <div>
               {
                comment.map((com)=>{
                    return (<>
                            <div className='comment' key={com.id}>
                                <div className='main-comment'>
                                { !com.deleted? <>
                                
                                <span style={{ display:'flex' }}> <p className='nameStyel'>👤 {com.name}</p> {com.parent && <p className='refer_to'>➦{com.parent}</p>} <p className='bullet'> </p> <p className='time_ago'>{fromNow(com.timestamp)}</p></span>
                               { editComment.showEdit ? <textarea name="" id="" cols="30" rows="5" value={editComment.editText} onChange={(e)=>setEditComment({
                                ...editComment,
                                editText:e.target.value
                               })}></textarea>: <p className='textStyle'>{com.text}</p> }
                                <div>
                                 { !editComment.showEdit &&  <button onClick={()=>handleReply(com)}>Reply</button> }
                                    <button onClick={()=>handleEditComment(com)}>{editComment.editOrSave}</button>
                                 { !editComment.showEdit &&  <button onClick={()=>handleDelete(com)}>Delete</button> }
                                 { com.subComment.length > 0  && <span onClick={()=>loadMore(com)}> {!com.expand?'Load More...':'Show Less...'}</span>}
                                </div>
                                </>
                                :
                                    <>
                                    {/* <p>[deleted]</p>
                                    <p>[deleted]</p>
                                    <div>   
                                    <button disabled={true} >Reply</button> 
                                    <button disabled={true} >{editComment.editOrSave}</button>
                                     <button disabled={true} >Delete</button>                                        
                                    </div> */}
                                    </>
                                }
                                </div>
                                {
                                     (toggleReply && id === com.id )&& 
                                    <div 
                                     style={{
                                        padding: '13px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                     }}
                                    >
                                        <span><input placeholder='Your Name' type="text"  value={userComment.name} onChange={(e)=>setUserComment({...userComment, name:e.target.value})} /></span>
                                        <span><textarea placeholder='Your Comment' name="" id="" cols="30" rows="5" value={userComment.text} onChange={(e)=>setUserComment({...userComment, text:e.target.value})}></textarea>
                                        </span>
                                        <span> <button onClick={()=>handleAddComment(com, userComment)}>Add comment</button></span>
                                    </div> 
                                }
                                { com.expand &&
                                <div className='sub-comment'> 
                                <CommentBox 
                                     comment={com.subComment}
                                     setComment= {setComment}
                                    handleAddCommentNest={handleAddCommentNest}
                                    handleEditCommentNest={handleEditCommentNest}
                                    handleDeleteCommentNest={handleDeleteCommentNest}
                                    loadMore={loadMore}
                                     />           
                                </div>
                              }
                            </div>
                          </>)
                })
              }
            </div>
           </>
    )
}

export default CommentBox