const {userDB} = require("./data/data");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
const uuid4 = require('uuid4');
const cookieParser = require('cookie-parser');
const { cookie } = require("request");
const { render } = require("pug");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser(uuid4()));

app.set("views", path.join(__dirname,"public", "views"));
app.set("view engine", "pug");

app.get('/',(req,res)=>{
    res.clearCookie('username');
    res.clearCookie('id');
    return res.render('index');
})

app.get('/login',(req,res)=>{
    return res.render('login');
})

app.get('/signup',(req,res)=>{
    return res.render('signup');
})

app.get('/user/:username',(req,res)=>{
    try{
        console.log(req.signedCookies);
        console.log(req.params.username)
        const findUser = userDB.find(data => data.username === req.params.username);
        console.log(findUser)
        if(findUser){
            if(req.signedCookies.id === findUser.id){
                res.render('links',{
                    username:findUser.username,
                    list:findUser.list
                });
            }else{
                return res.redirect('/');
            }
        }else{
            return res.redirect('/');
        }
    }catch{
        return res.send("伺服器錯誤:(" + err);
    }
})

app.post('/signup',(req,res)=>{
    try{
        const findUser = userDB.find(data => data.id === req.body.id);
        if(!findUser){
            const newUser = {
                username: req.body.username,
                id: req.body.id,
                password: req.body.password,
                list: []
            }
            userDB.push(newUser);
            res.cookie('username',newUser.username,{signed:true});
            res.cookie('id',newUser.id,{signed:true});
            return res.redirect(`/user/${newUser.username}`);
        }else{
            return res.redirect(`/login`);
        }
    }catch(err){
        return res.send("伺服器錯誤:(" + err);
    }
})

app.post('/login',(req,res)=>{
    try{
        const findUser = userDB.find(data => data.id === req.body.id);
        if(findUser && req.body.password === findUser.password){
            res.cookie('username',findUser.username,{signed:true});
            res.cookie('id',findUser.id,{signed:true});
            console.log(req.signedCookies);
            return res.redirect(`/user/${findUser.username}`);
        }else{
            return res.render('login',{
                message:"查無此帳"
            })
        }
    }catch{
        return res.send("伺服器錯誤:(" + err);
    }
})

app.post('/user/:username',(req,res)=>{
    try{
        const findUserIDX = userDB.findIndex(data => data.username === req.signedCookies.username);
        const newLink = req.body.title + "\t" + req.body.link;
        console.log(findUserIDX.list);
        userDB[findUserIDX].list = [...userDB[findUserIDX].list,newLink];
        return res.redirect(`/user/${req.signedCookies.username}`);
    }catch(err){
        return res.send("伺服器錯誤:(" + err);
    }
})

server.listen(PORT,()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
})