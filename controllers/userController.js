










exports.getAllUser = (req, res)=>{
    res.status(200).json({
        status: "Success",
        data:{
            data: null
        }
    })
}

exports.createUser = (req, res)=>{
    res.status(201).json({
        status: "Success",
    })
}

exports.deleteUser = (req, res)=>{
    res.status(200).json({
        status: "deleted"
    })
}

exports.editUser = (req, res)=>{
    res.status(200).json({
        status: "Success"
    })
}