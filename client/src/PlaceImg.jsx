import React from 'react'

export default function PlaceImg({place,index=0,className=null}) {

    if(!place.photos?.length){
        return ''
    }
    if(!className){
        className = 'object-cover w-full h-full'
    }

  return (
    <div>
        <img src={place.photos[index]} alt="Place" className={className} />                        
    </div>
  )
}
