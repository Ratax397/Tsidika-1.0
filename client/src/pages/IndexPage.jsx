import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header'
import axios from 'axios'

export default function IndexPage() {

  const[places,setPlaces]=useState([])

  useEffect(()=>{
    axios.get('/listPlaces').then(response=>{
      setPlaces(response.data)
    })
  },[])

  return (
    <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8'>
     {places.length > 0 && places.map(place=>(
      <Link to={'/place/'+place._id} className='group block'>
        <div className='bg-gray-200 mb-2 rounded-2xl overflow-hidden transition group-hover:shadow-md'>
          {place.photos?.[0] && (
            <img className="object-cover aspect-square w-full h-full" src={place.photos[0]} alt=""/>
          )}
        </div>
        <h2 className="font-semibold text-gray-900">{place.address}</h2>
        <h3 className="text-sm text-gray-600">{place.title}</h3>
        <div className='mt-1'>
          <span className='font-bold'>{place.price}Ar per night</span>
        </div>
      </Link>
     ))}
   </div>
  )
}
