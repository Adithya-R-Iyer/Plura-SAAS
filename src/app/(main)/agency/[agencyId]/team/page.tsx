import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const agencyId = params.agencyId;
  const authUser = await currentUser();
  if (!authUser) return null;

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });


  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: {
      SubAccount: true,
    },
  });
  if (!agencyDetails) return null;

  return (
    <DataTable
      actionButtonText={
        "Add User"
      }
      modalChildren={<SendInvitation agencyId={agencyId}/>}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );
};

export default TeamPage;
