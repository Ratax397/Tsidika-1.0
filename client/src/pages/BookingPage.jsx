import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AddressLink from '../AddressLink'
import PlaceGallery from '../PlaceGallery'
import BookingDates from '../BookingDates'

export default function BookingPage() {

    const {id}=useParams()
    const [booking,setBooking]=useState(null)
    useEffect(()=>{
      if(id){
        axios.get('/getBookings').then(response=>{
          const foundBooking = response.data.find(({_id})=>_id === id)
          if(foundBooking){
            setBooking(foundBooking)
          }
        })
      }
    },[id])


    if(!booking){
      return ''
    }

  return (
    <div className='my-8'>
      <h1 className="text-3xl font-semibold">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-100 p-6 my-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl mb-4 font-semibold">Your booking information</h2>
          <BookingDates booking={booking} />
        </div>
        <div className='bg-primary p-4 text-white rounded-2xl min-w-[160px] text-center'>
          <div className='opacity-90'>Total Price</div>
          <div className='text-3xl font-semibold'>{booking.price}Ar</div>
        </div>
      </div>
      <PlaceGallery place={booking.place}/>
    </div>
  )
}
