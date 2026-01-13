import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from '../BookingWidget';
import PlaceGallery from '../PlaceGallery';
import AddressLink from '../AddressLink';

export default function PlacePage() {

    const {id} = useParams();
    const [place,setPlace]=useState(null)
    const [showMorePhotos,setShowMorePhotos]=useState(false)

    useEffect(()=>{
        if(!id){
            return
        }
        axios.get('/getPlacesById/'+id).then((Response)=>{
            setPlace(Response.data)
        })
    },[id])

    if(!place){
        return <div>Loading...</div>
    }

    if(showMorePhotos){
        return(
            <div className='absolute inset-0 bg-black text-white min-h-screen'>
                <div className='bg-black p-8 grid gap-4'>
                    <div>
                        <h2 className="text-3xl mr-40">Photos of {place.title}</h2>
                        <button onClick={()=>setShowMorePhotos(false)} className='fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Close photo
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map((photo)=>(
                        <div>
                            <img src={photo} alt="" />
                        </div>      
                    ))}
                </div>
            </div>
        )
    }

  return (
    <div className='mt-4 bg-gray-100 rounded-2xl px-4 sm:px-6 lg:px-8 pt-8'>
        <h1 className='text-3xl'>{place.title}</h1>
        <AddressLink>{place.address}</AddressLink>
        <PlaceGallery place={place} />
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="my-4">
                <h2 className="font-semibold text-2xl">Description</h2>
                {place.description}
            </div>
            Check-in: {place.checkIn}<br/>
            Check-out: {place.checkOut}<br/>
            Max number of guests: {place.maxGuests}
          </div>
          <div>
            <BookingWidget place={place}/>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-4 sm:px-6 lg:px-8 py-8 border-t">
            <div>
                <h2 className="font-semibold text-2xl">Extra info</h2>
            </div>
            <div className='mb-4 mt-2 text-sm text-gray-700 leading-5'>{place.extraInfo}</div>
        </div>
    </div>
  )
}
