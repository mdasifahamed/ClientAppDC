const express = require('express')
const bodyParser = require('body-parser')
const contract = require('./contract.js')
const app = express()
const port = 9000
app.use(bodyParser.json())



app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});

// api for submitting request
app.post('/submit-request', async (req , res)=> {
    if( !req.body.student_name || !req.body.student_id || 
        !req.body.degree || !req.body.major || !req.body.result){

        return res.status(400).json({data:"Missing required fields"})
    }
    let track_id
    try {
        let requests = await contract.get_all_request()
        if (!requests){
            track_id = 1;
        } else {
            requests = JSON.parse(requests)
            track_id = requests.length + 1;
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({data:"Failed To Connect The Blokchain Network"})
    }
        
    try{
        const response = await contract.submit_request(track_id.toString(),req.body.student_name,
        req.body.student_id,req.body.degree ,req.body.major,req.body.result)
        return res.status(200).json({data:JSON.parse(response)});

    }catch(err){

        return res.status(500).json({data:"Failed To Connect The Blokchain Network"})
    }
        
})

app.get('/read-request/:tracking_id',async (req,res)=>{

    const track_id = req.params.tracking_id
    if(!track_id){
        return res.status(400).json({data:"Invlaid Path"})
    }
    try {
        let request_history =  await contract.read_request(track_id.toString())
        return res.status(200).json({data:JSON.parse(request_history)})
    } catch (error) {
        if (error) {
            return res.status(500).json({data:`No data found for  id ${track_id}`})
        }
    }
})


app.get('/read-request',async (req,res)=>{

    const track_id = req.body.tracking_id
    if(!track_id){
        return res.status(400).json({data:"Missing Required Tracking Id"})
    }
    try {
        let request_history =  await contract.read_request(track_id.toString())
        return res.status(200).json({data:JSON.parse(request_history)})
    } catch (error) {
        if (error) {
            return res.status(500).json({data:`No data found for  id ${track_id}`})
        }
    }
})

app.get('/get-all-the-request', async(req,res)=>{

    try {
        let requests = await contract.get_all_request()
        return res.status(200).json({data:JSON.parse(requests)})
    } catch (error) {
        return res.status(500).json({data:"Failed To Connect The Blokchain Network"})
    }
})

app.get('/read-certificate-by-id',async(req,res)=>{

    let cert_id = req.body.certificate_id

    if(!cert_id){
        return res.status(400).json({data:"Required Certificate Id Is Missing"})
    }

    try {
        const certificate = await contract.read_certificate_by_certid(cert_id.toString())
        return res.status(200).json({data:JSON.parse(certificate)})
    } catch (error) {
        if (error) {
            return res.status(500).json({data:`Certificate Not Found For The Id ${cert_id}`})
        }
    }
})


app.get('/history-of-certificate',async (req,res)=>{

    let tracking_id = req.body.tracking_id
    if(!tracking_id){
        return res.status(400).json({data:"Required Fields Tracking_Id  Is  Missing"})
    }

    try {
        let request_history =  await contract.history_of_a_request(tracking_id.toString())
        return res.status(200).json({data:JSON.parse(request_history)})
    } catch (error) {
        if (error) {
            return res.status(500).json({data:`Certficate History Is Not Found For The Tracking Id : ${tracking_id}`})
        }
    }
})

app.get('/verify-by-hash', async(req,res)=>{
    
    let certificate_hash = req.body.certificate_hash
    if(!certificate_hash){
        return res.status(400).json({data:"Required Certificate Hash Is Missing"})
    }
    try {
        let result = await contract.verify_by_hash(certificate_hash.toString())
        return res.status(200).json({data:JSON.parse(result)})
    } catch (error) {

        if (error) {
            return res.status(500).json({data:`Certificate Not Found For The Hash ${certificate_hash}`})
        }
    }
})

