import AgencyDetails from '@/components/forms/agency-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  searchParams: { plan: Plan, code: string, state: string }
}

const Page = async ({ searchParams }: Props) => {
    const agencyId = await verifyAndAcceptInvitation(); // check whether an invitation exists for the logged in user (if not logged in, prompt login), if exists accept it... create new user account and redirect him to sub-account page or agency page based on kind of invitation.. else search if the user exists in the database... if he does then redirect him to his/her dashboard ...else prompt user registration page

    //get user details and check their permissions to redirect them accordingly to different pages
    const user : any = await getAuthUserDetails();  // side bar option information

    if(agencyId) {
      if(user?.Role === "SUBACCOUNT_GUEST" || user?.Role === "SUBACCOUNT_USER") {
        return redirect("/subaccount");
      } else if(user?.Role === "AGENCY_OWNER" || user?.Role === "AGENCY_ADMIN") {
        if(searchParams.plan) {
          return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
        }
        // stripe doesn't allow to return a dynamic url... so we cant possibly know the agencyId to redirect the user.. instead we can obtain it through 'state'... and then we can redirect the user with a searchParam called 'code' which contains info to confirm the process. (connecting multiple accounts)
        if(searchParams.state) {
          const statePath = searchParams.state.split("___")[0];
          const stateAgencyId = searchParams.state.split("___")[1];
          if(!stateAgencyId) return <div>Not Authorized</div>
          return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
        } else {
          return redirect(`/agency/${agencyId}`)
        }
      } else {
        return <div>Not Authorized</div>
      }
    }
    
    const authUser = await currentUser();
  return (
    <div className='flex justify-center items-center mt-4'>
      <div className='max-w-[850px] border-[1px] p-4 rounded-xl'>
        <h1 className='text-4xl'>Create An Agency</h1>
        <AgencyDetails 
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress}}
        />
      </div>
    </div>
  )
}


export default Page