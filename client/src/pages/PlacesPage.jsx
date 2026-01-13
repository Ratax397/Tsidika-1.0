import React, { useEffect, useState } from 'react'
//import { useState } from 'react'
import { Link, Navigate} from 'react-router-dom'
import Perks from '../Perks'
//import axios from 'axios'
import PhotosUploader from '../PhotosUploader'
import PlacesForm from './PlacesForm'
import AccountNav from '../AccountNav'
import axios from 'axios'
import PlaceImg from '../PlaceImg'

export default function PlacesPage() {

    const [places,setPlaces]=useState([])
    useEffect(()=>{
        axios.get('/getPlaces').then((response)=>{
            setPlaces(response.data);
        })
    },[])

  return (
    <div>
        <AccountNav />
        <div className='text-center'>
           <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full hover:opacity-90 transition shadow-sm' to={'/account/places/new'}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
             </svg>
             Add new place
           </Link>
        </div>
        <div className='mt-4'>
            {places.length > 0 && places.map((place)=>(
                <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-white p-4 rounded-2xl hover:shadow-md transition">
                    <div className='w-32 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0'>
                        <PlaceImg place={place} />
                    </div>
                    <div className='grow-0 shrink'>
                        <h2 className='text-xl font-semibold text-gray-900'>{place.title}</h2>
                        <p className='text-sm mt-2 text-gray-600'>{place.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}
