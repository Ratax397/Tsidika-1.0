import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grow flex flex-col'>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}
