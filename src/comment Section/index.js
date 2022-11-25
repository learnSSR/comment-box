import React, { useState } from 'react'
import CommentBox from './component/commentBox';

function Index() {
  
    const [ comment ,setComment ] = useState([{
            id:0,
            name:'Mohit',
            text:'Have taken notes on Optional chain section and this one.',
            deleted:false,
            timestamp:1669382830770,
            parent:null,
            expand:true,
            subComment:[{
                id:1,
                name:'Kim',
                text:'Thank you, I learned a new thing!',
                deleted:false,
                timestamp:1669382830770,
                parent:'Mohit',
                expand:true,
                subComment:[]
            }]

    }]);
    const [ userComment, setUserComment ] = useState({name:'', text:''})

   const handleAddComment = ()=>{
    
    if (userComment.name.trim().length == 0 || userComment.text.trim().length == 0)
         return

        setComment([...comment,
            {id:new Date().getTime(),
             name:userComment.name,
             text:userComment.text,
             deleted:false,
             timestamp:new Date().getTime(),
             parent:null,
             expand:true,
            subComment:[]}])
            setUserComment({name:'', text:''})
    }

    const handleAddCommentNest = (com, userComment)=>{
        if (userComment.name.length == 0 || userComment.text.length == 0)
            return

        function myDel(id, comment){
          
            for(let i=0;i<comment.length;i++){
                let obj = comment[i]
                if (obj.id == id ){
                   
                    obj.subComment.push({
                        id:new Date().getTime(),
                            name:userComment.name,
                            text:userComment.text,
                            delete:false,
                            timestamp:new Date().getTime(),
                            parent:com.name,
                            expand:true,
                           subComment:[]}
                    )  
                  
                    return;
                }
                myDel(id, obj.subComment)
            }
        }
       myDel(com.id, comment)
       setComment([...comment])
     }

     const handleEditCommentNest = (com, userComment)=>{
      
        function myDel(id, comment){   
            for(let i=0;i<comment.length;i++){
                let obj = comment[i]
    
                if (obj.id == id ){
                   obj.text = userComment
                    return;
                }
                myDel(id, obj.subComment)
            }
        }
       myDel(com.id, comment)
       setComment([...comment])
     }

     const handleDeleteCommentNest = (com)=>{
        function myDel(id, comment){
            for(let i=0;i<comment.length;i++){
                let obj = comment[i]
                if (obj.id == id ){
                //    comment.splice(i,1)
                    obj.deleted = true;
                    return;
                }
                myDel(id, obj.subComment)
            }
        }
       myDel(com.id, comment)
       setComment([...comment])
     }

     const loadMore = (com)=>{    
        function myDel(id, comment){
            for(let i=0;i<comment.length;i++){
                let obj = comment[i]
                if (obj.id == id ){
                    obj.expand = !obj.expand
                    return;
                }
                myDel(id, obj.subComment)
            }
        }
       myDel(com.id, comment)
       setComment([...comment])
     }

  return (<>
     <div>
        <div>
            <h2>💬 Comments {91}</h2>
        </div>
    <div
    style={{
        padding: '13px',
        display: 'flex',
        flexDirection: 'column'
    }}
     >
        <span><input placeholder='Your Name' type="text" value={userComment.name} onChange={(e)=>setUserComment({...userComment, name:e.target.value})} /></span>
        <span><textarea placeholder='Add Your Comment' id="" cols="30" rows="5" value={userComment.text} onChange={(e)=>setUserComment({...userComment, text:e.target.value})}></textarea>
        </span>
        <span> <button onClick={()=>handleAddComment()}>Add comment</button></span>
    </div> 
   </div> 
   <div style={{
     marginLeft:'15px'
   }}>
   <CommentBox 
   comment={comment}
   setComment= {setComment}
   handleAddCommentNest={handleAddCommentNest}
   handleEditCommentNest={handleEditCommentNest}
   handleDeleteCommentNest={handleDeleteCommentNest}
   loadMore={loadMore}
   />
   </div>

    </>
  )
}

export default Index