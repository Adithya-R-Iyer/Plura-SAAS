import Loading from '@/components/global/loading'
import React from 'react'

type Props = {}

const LoadingSubAccountPage = (props: Props) => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
        <Loading></Loading>
    </div>
  )
}

export default LoadingSubAccountPage