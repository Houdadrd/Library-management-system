const mongoose = require("mongosse");

const categorySchema = mongoose.Schema(
    {
        name:{
            type: String,
            enum: ["Policier","Romantique","deliveryMan"],
            required : [true, "Please enter a role name!"],
        }
    }
); 
const Role = mongoose.model("role", roleSchema);

module.exports = Role;