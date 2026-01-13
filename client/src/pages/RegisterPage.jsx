import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'

export default function RegisterPage() {

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)

    async function registerUser(e){
      try {
        
        e.preventDefault();
        await axios.post('/register',{name,email,password})
        alert("User registered successfully")
        setRedirect(true)
      } catch (error) {
        alert('Registration failed. Please try again later')
      }
      

    }
    if(redirect){
      return <Navigate to={'/login'} />
    }

  return (
    <div className="-mt-45 grow flex items-center justify-around py-12 sm:py-16">
        <div className="w-full max-w-md">
            <h1 className="text-4xl text-center  font-semibold">Register</h1>
            <form className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md" onSubmit={registerUser}>
                <input type="text" placeholder='yourname' value={name} onChange={e=>setName(e.target.value)} required/>
                <input type="email" placeholder='your@email.com' value={email} onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder='password' value={password} onChange={e=>setPassword(e.target.value)} required/>
                <button className='primary mt-2'>Register</button>
                <div className='text-center py-2 text-gray-500'>
                    Already a member? <Link className="underline text-black" to={"/login"}>Login</Link>
                </div>
            </form>
        </div>      
    </div>
  )
}
