import axios from 'axios'
import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, Navigate} from 'react-router-dom'
import { UserContext } from '../UserContext'

export default function LoginPage() {
      
      const [email,setEmail]=useState('')
      const [password,setPassword]=useState('')
      const [redirect,setRedirect]=useState(false)
      const {setUser}=useContext(UserContext)

      async function handleLoginSubmit(e){
        try {
          
          e.preventDefault()

          const response=await axios.post('/login',{email,password});
          //await axios.post('/login',{email,password});

          //const responseProfile=await axios.get('/profile')
          
          setUser(response.data.data)
          alert('Login successfully')
          setRedirect(true)
          /*setTimeout(()=>{
            setRedirect(true)
          },0)*/
          

        } catch (error) {
          alert('Login failed',error.message)
        }
      }

      if(redirect){
          return <Navigate to={'/'} />
       }

  return (
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                <input type="email" placeholder='your@email.com' value={email} onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder='password' value={password} onChange={e=>setPassword(e.target.value)} required/>
                <button className='primary'>Login</button>
                <div className='text-center py-2 text-gray-500'>
                    Don't have an account yet? <Link className="underline text-black" to={"/register"}>Register now</Link>
                </div>
            </form>
        </div>      
    </div>
  )
}