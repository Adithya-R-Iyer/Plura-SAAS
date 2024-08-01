import React from 'react'

type Props = {
    params: { agencyId: string }
}

const AgencyPage = ({ params }: Props) => {
  return (
    <div>{params.agencyId}</div>
  )
}

export default AgencyPage