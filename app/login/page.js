//import React from 'react'
import SignInButton from '../_components/SigninButton';

export const metadata = {
    title: "Login "
}

const page = () => {
  return (
    <div className='flex flex-col gap-10 mt-10 items-center'>
        <h2 className='text-3xl font-semibold'>
            Sign in to access your guest area
        </h2>
        
    <SignInButton  />
        </div>

  )
}

export default page;