import Navigation from '@/components/site/navigation'
import React from 'react'

const SiteLayout = ({ children } : { children: React.ReactNode }) => {
  return (
    <main className='h-screen'>
        <Navigation />
        {children}
    </main>
  )
}

export default SiteLayout
