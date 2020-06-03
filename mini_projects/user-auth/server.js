const express = require('express')
const expSession = require('express-session')
const { db, Users} = require('./db')
const path= require('path')

const app = express()
app.set('view engine', 'hbs')
app.use(expSession({
    resave:true,
    saveUninitialized: true,
    secret:'vvdgwqpokknwp98u##%#%#$!3msfsjndkgdad@$@$'
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))  //2nd op app.use('/', express.static(path.join(__dirname, '/public')))

app.get('/logout', (req, res)=>{
    req.session.userId = null
    res.redirect('/login')
})
app.get('/signup', (req, res)=>{
    res.render('signup')
})
app.post('/signup',  async (req, res)=>{
    const user = await Users.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    res.status(201).send('created')
})
app.get('/login', (req, res)=>{
    res.render('login')
})
app.post('/login', async (req, res)=>{
    const user = await Users.findOne({where:{username:req.body.username}})
    if(!user){
        return res.render('login', {error:"This username does't exist"})
    }
    if(user.password !== req.body.password){
        return res.render('login', {error:"password does't match"})
    }
    req.session.userId = user.id
    res.redirect('/profile')
})
app.get('/profile', (req, res)=>{
    console.log(req.session)
    if(!req.session.userId){
        return res.redirect('/signup')
    }
    res.render('profile')
})
db.sync().then(
    app.listen(3000, ()=>{
        console.log('listening on server http://localhost:3000')
    })
).catch(console.error)