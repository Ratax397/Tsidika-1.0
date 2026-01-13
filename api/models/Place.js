import mongoose from "mongoose"

const PlaceSchema=new mongoose.Schema({
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    maxGuests:Number,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    price:Number
})

const PlaceModel=mongoose.model('Place',PlaceSchema)

export default PlaceModel