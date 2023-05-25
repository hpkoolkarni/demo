const e = require('express')
const port = 4000
const app =e()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://haripriyakulkarni13:haripriya123@cluster0.czkonab.mongodb.net/?retryWrites=true&w=majority',
{useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
    console.log('connected to db')
})

const Studentschema = new mongoose.Schema({
    name:String,
    rollno:Number,
    wad:Number,
    dsbda:Number,
    cns:Number,
    cc:Number,
    ai:Number
})

const Student = new mongoose.model("Student", Studentschema)

data = [
    {
        name: "Manas",
        rollno: 27,
        wad: 20,
        dsbda: 23,
        cns: 12,
        cc: 16,
        ai: 18,
      },
      {
        name: "Roku",
        rollno: 29,
        wad: 12,
        dsbda: 20,
        cns: 15,
        cc: 18,
        ai: 14,
      },
      {
        name: "Sid",
        rollno: 7,
        wad: 20,
        dsbda: 13,
        cns: 16,
        cc: 19,
        ai: 13,
      },
      {
        name: "Appu",
        rollno: 1,
        wad: 23,
        dsbda: 3,
        cns: 2,
        cc: 6,
        ai: 8,
      },
];

app.get('/', async(req,res)=>{
    try{
        res.send("Hello World")
    }
    catch(err){
        console.log(err)
    }
})

app.get('/add', async(req,res)=>{
    try{
        await Student.insertMany(data)
        res.send("Data added successfully")
    }catch(err){
        console.log(err)
    }
})

app.get('/display', async(req,res)=>{
    try{
        const students=await Student.find()
        const count=students.length
        res.send({TotalCount: count, students: students})
    }catch(err){
        console.log(err)
    }
})

app.get('/dsbda', async(req,res)=>{
    try{
        const students=await Student.find({dsbda: {$gt : 10}})
        res.send(students)
    }catch(err){
        console.log(err)
    }
})

app.get('/update/:rollno', async(req,res)=>{
    try{
        const {rollno}=req.params
        const filter = {rollno : rollno}
        const update = {
            $inc:{
                wad:10,
                dsbda:10,
                cns:10,
                cc:10,
                ai:10
            }
        }
        const updatedStudent = await Student.findOneAndUpdate(filter,update,{new:true})
        if(updatedStudent){
            res.json({message:"Updated successfully",updatedStudent:updatedStudent})

        } 
        else{
            res.send({message:"Student not found"})
        }
    }
    catch(err){
        console.log(err)
    }
})
app.get('/morethan',async(req,res)=>{
    try{
        const students=await Student.find(
            {
                wad: {$gt : 15},
                dsbda: {$gt :15},
                cc: {$gt : 15},
                cns: {$gt : 15},
                ai: {$gt : 15},
        })
        if(students.length>0){
            res.send(students)
        }
        else{
            res.send({message:"No student found"})
        }
    }catch(err){
        console.log(err)
    }
})

app.get('/delete/:rollno', async(req,res)=>{
    try{
        const {rollno} =req.params
        const deleteStudent = await Student.deleteOne({rollno:rollno})

        if(deleteStudent.deletedCount>0){
            res.send({message:"Deleted successfully"})
        }
        else{
            res.send({message:"Student not found"})
        }
    }catch(err){
        console.log(err)
    }
})

app.get('/table',async(req,res)=>{
    try{
        const students=await Student.find()
        const tableRows=students.map((student)=>{
            return(`
            <tr>
            <td>${student.name}</td>
            <td>${student.rollno}</td>
            <td>${student.rollno}</td>
            <td>${student.wad}</td>
            <td>${student.dsbda}</td>
            <td>${student.cc}</td>
            <td>${student.cns}</td>
            <td>${student.ai}</td>
            </tr>
            `)
        });
        const table=`
        <table>
            <thead>
                <th>Name</th>
                <th>Rollno</th>
                <th>Wad</th>
                <th>Dsbda</th>
                <th>Cc</th>
                <th>Cns</th>
                <th>Ai</th>
            </thead>
            <tbody>
                ${tableRows.join("")}
            </tbody>
        </table>
        `;
        res.send(table)
    }
    catch(err){
        console.log(err)
    }
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})