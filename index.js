const express = require("express")
const cors = require("cors")
const { Server } = require('socket.io');


const { getDocument, updateDocument } = require('./controller/document-controller.js');

const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { noteRouter } = require("./routes/note.routes")
const mongoose = require('mongoose');
require("dotenv").config()
const port = process.env.PORT||3000
const PORT = process.env.PORT || 8000;
const app = express()
app.use(cors())
app.use(express.json())
app.use("/user",userRouter)
app.use("/note",noteRouter)

mongoose.connect(process.env.mongourl, { useNewUrlParser: true});

app.get("/",(req,res)=>{

    res.send({
        message:"api is working now"
    })

})


app.listen(port,async()=>{

    try {
        await connection
        console.log("database is connected")
    } catch (error) {
        console.log(error)
    }


    console.log("Server is running on port number",port)

})

const io = new Server(PORT, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', socket => {
    
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
     
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            console.log(delta)
            socket.broadcast.to(documentId).emit('receive-changes', delta);
          
        })

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
});