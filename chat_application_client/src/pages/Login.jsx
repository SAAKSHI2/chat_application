import { useState } from "react";
import { loginRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { setUsernam } from "../config";


function Login(props){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(){
        try{
            const res = await fetch(loginRoute,{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body:JSON.stringify({username:username,password:password}),
           });
           if(res.ok){
               setUsernam(username);
                navigate("/chats");
           }

        } catch(error){
            console.log("error while logging in : ",error);
        }
       
    }

    function handleChange(event){
        const {name,value} = event.target;
        if(name === "username"){
            setUsername(value);
        }
        else if(name==="password"){
            setPassword(value);
        }

    }

    return(
        <div className="login_container">
            <div className="login_box">
            <input type="text" placeholder="username" name="username" value={username} onChange={handleChange}/>
            <input placeholder="password" name="password" value={password} onChange={handleChange}/>
            <button onClick={handleSubmit}>Login</button>
            <p>Sign up ?<span onClick={()=>{
                navigate("/register")
            }}>Register</span></p>

            </div>
       </div>
    )

    
}

export default Login;