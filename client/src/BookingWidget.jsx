import React from 'react'
import { useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import axios from 'axios'
import { useContext } from 'react'
import { useEffect } from 'react'
import { UserContext } from "./UserContext";
import { Navigate } from 'react-router-dom'

export default function BookingWidget({place}) {

    const [checkIn,setCheckIn]=useState('')
    const [checkOut,setCheckOut]=useState('')
    const [guests,setGuests]=useState(1)
    const [name,setName]=useState('')
    const [phone,setPhone]=useState('')
    const [redirect,setRedirect]=useState('')
    const {user}=useContext(UserContext)

    useEffect(()=>{
        if(user){
            setName(user.name)
        }
    },[user])

    let numberOfNights=0
    if(checkIn && checkOut){
        numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
    }

    async function bookThisPlace(){
        try {

            const response=await axios.post('/bookings',{checkIn,checkOut,guests,name,phone,place:place._id,price:numberOfNights*place.price})
            const bookingId=response.data._id   
            setRedirect(`/account/bookings/${bookingId}`)
            
        } catch (error) {
            console.log(error)
        }
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

  return (
    <div className='bg-white shadow-md p-4 sm:p-6 rounded-2xl'>
        <div className="text-2xl text-center font-semibold">
            Price: {place.price}Ar / per night
        </div>
        <div className="border rounded-2xl mt-4 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                <div className="py-3 px-4 flex-1">
                    <label className='block text-sm text-gray-600'>Check-in:</label>
                    <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/>
                </div>
                <div className="py-3 px-4 sm:border-l flex-1">
                    <label className='block text-sm text-gray-600'>Check-out:</label>
                        <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}/>
                    </div>
                </div>
                <div className='py-3 px-4 border-t sm:border-t-0'>
                    <label className='block text-sm text-gray-600'>Number of guests:</label>
                    <input type="number" value={guests} onChange={e=>setGuests(e.target.value)}/>
                </div>
                {
                    numberOfNights > 0 && (
                        <div className='py-3 px-4 border-t'>
                            <label className='block text-sm text-gray-600'>Your full name:</label>
                            <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
                            <label className='block text-sm text-gray-600'>Your phone number:</label>
                            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}/>
                        </div>
                    )
                }
       </div>
        <button onClick={bookThisPlace} className="primary mt-4">
            Book this place {" "}
            {numberOfNights > 0 && (
                
                <span>
                    {numberOfNights*place.price}Ar
                </span>
            )}
        </button>
    </div>    
  )
}
