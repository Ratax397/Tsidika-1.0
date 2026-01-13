import mongoose from "mongoose"
const BookingSchema=new mongoose.Schema({
    place:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Place'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    checkIn:{type:Date,required:true},
    checkOut:{type:Date,required:true},
    //guests:{type:Number,required:true},
    name:{type:String,required:true},
    phone:{type:String,required:true},
    price:{type:Number,required:true}
})

const BookingModel=mongoose.model('Booking',BookingSchema)
export default BookingModel