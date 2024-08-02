import Link from 'next/link'
import React from 'react'

type Props = {}

const UnauthorizedComponent = (props: Props) => {
  return (
    <div className='p-4 text-center h-screen w-screen flex justify-center items-center flex-col gap-4'>
        <h1 className='text-3xl md:text-6xl'>
            Unauthorized access!
        </h1>
        <p>Please contact support or your agency owner to get access</p>
        <Link className='mt-4 bg-primary p-2' href={"/"}>
            Back to Home
        </Link>
    </div>
  )
}

export default UnauthorizedComponent