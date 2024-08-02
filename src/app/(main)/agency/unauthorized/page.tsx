import UnauthorizedComponent from '@/components/unauthorized'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
        <UnauthorizedComponent />
    </div>
  )
}

export default Page