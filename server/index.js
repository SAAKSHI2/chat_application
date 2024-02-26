import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import {Server} from "socket.io";
import http from "http";

const app=express();
const server = http.createServer(app);
const io = new Server(server);


dotenv.config();


app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS,');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
  });



const dataBase = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DATABASE_PORT
})


dataBase.connect().then(()=>
    console.log("database connection succesfull")
).catch((error)=>console.log("error: ",error.message))


io.on("connection", (socket) => {

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log("socket join group",data);
    })
    
    socket.on("send_message",async(data)=>{
        try{
            const date = new Date(data.time);
            const userID = (await dataBase.query("select user_id from users where username=$1",[data.username])).rows[0].user_id;
            const groupID = (await dataBase.query("select group_id from groups where group_name=$1",[data.groupName])).rows[0].group_id;
            const insertData = await dataBase.query("Insert into group_messages(user_id,group_id,timestamp,content) values($1,$2,to_timestamp($3/1000.0),$4)",[userID,groupID,data.time,data.msg])
            socket.to(data.groupName).emit("receive_message",{msg:data.msg,time:date.getHours()+":"+date.getMinutes(),username:data.username});

        }catch(error){
            console.log("error in socket",error);
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });






app.post("/register", async(req,res)=>{

    const {username,password,email}=req.body;
    try{
        const check = await dataBase.query("select * from users where username=$1",[username]);

        if(check.rowCount >0 ){
            res.status(401).json({error:"user already exists"});
        } else{
            const hashPassword = await bcrypt.hash(password,10);
            const insert = await dataBase.query("Insert into users (username,password,email) values($1,$2,$3)",[username,hashPassword,email]); 
            res.status(201).json({ message: 'User registered successfully' });
        }

    } catch(error){
        res.json({error:error.message});
    }
    
});

app.post("/login",async(req,res)=>{

    const {username,password} = req.body;

    try{
        const check = await dataBase.query("select password from users where username=$1",[username]);

        if(check.rowCount <=0 ){
            res.status(401).json({error:"user doesn't exists"});
        } else{
            const matchPassword = await bcrypt.compare(password,check.rows[0].password);
            if(matchPassword){
                res.status(201).json({ message: 'User login successfully' });
            }else{
                res.status(401).json({ message: 'Invalid username or password' });
            }     
        }

    } catch(error){
        res.json({error:error.message});
    }
});

app.post("/groups", async(req,res)=>{
 
    const username=req.body.username;
 
    try{
        const userID = (await dataBase.query("select user_id from users where username=$1",[username])).rows[0].user_id;
        const group = await dataBase.query("select group_name from groups g,users u,user_groups ug where u.user_id=$1 and u.user_id=ug.user_id and ug.group_id=g.group_id",[userID]);

        let groupName = [];

        group.rows.forEach((group)=>groupName.push(group.group_name));

         res.json(groupName);
        
    } catch(error){
        res.json({error:error.message});
    }
    
});

app.post("/chats", async(req,res)=>{

    const groupName=req.body.groupName;
 
    try{
        const groupID = (await dataBase.query("select group_id from groups where group_name=$1",[groupName])).rows[0].group_id;
        const chats = await dataBase.query("select username,timestamp,content from group_messages gm, users u where gm.user_id=u.user_id and group_id=$1 order by timestamp asc",[groupID]);

        let chat = [];

        chats.rows.forEach((ele)=>chat.push({
            msg:ele.content,
            time:ele.timestamp!=null?ele.timestamp.getHours()+":"+ele.timestamp.getMinutes():null,
            username: ele.username
        }));


         res.json(chat);
        
    } catch(error){
        res.json({error:error.message});
    }
    
});






server.listen(process.env.PORT,()=>{
    console.log("server running at port :",process.env.PORT);
})
