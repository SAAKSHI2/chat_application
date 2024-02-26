import { useState } from "react";


function WriteMsg(props){
    const [chat,setChat] = useState("");

    function handleChange(event){
        setChat(event.target.value)
    }
    
    function handleSubmit(){
        props.setChat(chat);
        setChat("");
    }

    return(
        <div className="writeMsg">
           <input onChange={handleChange} type="text" value={chat} placeholder="Write Message here..."/>
           <button onClick={handleSubmit}>send</button>
        </div>
    )

}
export default WriteMsg;
