import { useEffect, useState } from "react";
import { getUsername, setGroupName } from "../config";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

function Groups(props){
    const [groups,setGroups] = useState([]);
    const navigate = useNavigate();
    const [displayChat,setDisplayChat] = useState(false);

    useEffect(()=>{
        const groupsUserEnrolledIn=async()=>{
              const group = await fetch("http://localhost:3001/groups",{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body:JSON.stringify({username : getUsername()}),
              });

              const data= await group.json();
              console.log(data);
              setGroups(data);
              
        }
        groupsUserEnrolledIn();

    },[])

    const [chats,setChats] = useState([{}]);
    
    const handleGroupClick=async(groupName)=>{
        setGroupName(groupName);
        props.socket.emit("join_room",groupName);
              const group = await fetch("http://localhost:3001/chats",{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body:JSON.stringify({groupName : groupName}),
              });

              const data= await group.json();
              setChats(data);
              setDisplayChat(true);

        }


    return(
       
        <div className="chat_parent_div">

          <div className="groups">
              <div style={{backgroundColor:"#00A884"}}>
              <button onClick={()=>{navigate("/"); window.location.reload();}} className="logOutButton">Logout</button>
              </div>
        
              <div className="groups_div" style={{height:"92vh"}}>
                  {groups.map((ele)=>{
                    return <div className="groupEle" key={ele} onClick={()=>handleGroupClick(ele)}>{ele}</div>
                  })}
              </div>
          </div>
           

            <div style={{height:"100vh"}} className="chatsDisplay_div" >
                {
                   displayChat?<Chat socket={props.socket} chats={chats} setChats={setChats}/>:
                    <div className="groups_div afterClick initialChat" style={{height:"100vh",padding:"0px"}}>
                      <p style={{fontSize: "25px",color: "#00A884", textAlign:"center"}}><span  style={{fontSize: "50px",color: "#00A884",marginBottom:"30px"}}>Welcome {getUsername()} !</span> <br/>Click on Group to Start Your Chat :)</p>
                    </div>
                   
                }
            </div>

        </div>
    )
}

export default Groups;