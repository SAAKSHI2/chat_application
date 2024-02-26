import { useState } from "react";
import { registerRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

function Register(){
    const [userDetails,setUserDetails] = useState({
        username:"",
        password:"",
        confirmPassword:"",
        email:""
    });
    const navigate = useNavigate();

    
    async function handleSubmit(){

        setUserDetails({ username:"",
        password:"",
        confirmPassword:"",
        email:""});
        if(handleValidation()){
            //API Call
            try{
                const res = await fetch(registerRoute,{
                    method:'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(userDetails),
               });
               if(res.ok){
                navigate("/");
               }
            } catch(error){
                console.log("error while registering : ",error);
            }
         
        }

    }

    function handleChange(event){
        setUserDetails({...userDetails,[event.target.name]:event.target.value});
    }

    const handleValidation = ()=>{
        if(userDetails.password!==userDetails.confirmPassword){
            // toast.error("password and confirm password are not same");
            alert(userDetails.password+ "and" + userDetails.confirmPassword + "are not matching");
            return false;
        } else if(userDetails.email===""){
            alert("email is required");
            return false;
        } else if(userDetails.password.length<8){
            alert("password length must be more than 8 characters");
            return false;
        } else if(userDetails.username<3){
            alert("username length must be more than 3 characters");
            return false;
        }
        return true;
         
    }

    return(
        <div className="login_container">
            <div className="login_box">
            <input type="text" placeholder="username" name="username" value={userDetails.username} onChange={handleChange}/>
            <input placeholder="email" name="email" value={userDetails.email} onChange={handleChange}/>
            <input placeholder="password" name="password" value={userDetails.password} onChange={handleChange}/>
            <input placeholder="confirm password" name="confirmPassword" value={userDetails.confirmPassword} onChange={handleChange}/>
            <button onClick={handleSubmit}>Register</button>
            </div>
       </div>
    )

}
export default Register;