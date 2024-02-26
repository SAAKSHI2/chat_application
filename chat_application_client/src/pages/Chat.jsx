import { useEffect } from "react";
import { getGroupName, getUsername } from "../config";
import WriteMsg from "../components/WriteMsg";



function Chat({socket,chats,setChats}){
  
   
    useEffect(()=>{
      console.log("socket entered socket one");
    
      socket.off("receive_message").on("receive_message",(data)=>{
        setChats((prev)=>[...prev,data])
        console.log("data of socket",data.msg);
   })
    
  //  return () => socket.removeListener('receive_message')
    
    },[socket])


    function addNewMsg(data){
      const time=new Date;
      const newMsg = {username:getUsername(),
        msg:data,
        time:time.getHours()+":"+time.getMinutes(),
   };
      setChats((prev)=>[...prev,newMsg])
      const sendMsg = {
        username:getUsername(),
        msg:data,
        time:time.getTime(),
        groupName:getGroupName()
      }
      socket.emit("send_message",sendMsg);
    }


    return (
        <div >
               
          <div className="groups_div afterClick" style={{height:"88vh",border:"hidden"}}>
                {chats.map((ele)=>{
                    return <div key={ele.msg+" "+ele.username+""+ele.time} className={ele.username===getUsername()?"chatMsg newChatMsg":"chatMsg"}>
                      <p className="userName" hidden={ele.username===getUsername()?true:false}>{ele.username}</p>
                      <p>{ele.msg}</p>
                      <p className="userName" style={{fontSize:"10px",marginLeft:"10vw"}} >{ele.time}</p>
                    </div>
                    
                })}
          

           </div>
              
             <WriteMsg setChat={addNewMsg}/>
             
        </div>
 
    )
    
}

export default Chat;