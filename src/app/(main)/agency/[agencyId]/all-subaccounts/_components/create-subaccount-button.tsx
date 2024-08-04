"use client";

import SubAccountDetails from "@/components/forms/subaccount-details";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/model-provider";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOptions: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className: string;
};

const CreateSubAccountButton = ({ user, id, className }: Props) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;

  if (!agencyDetails) return;

  return (
    <Button
      className={twMerge("w-full flex gap-2", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create A SubAccount"
            subHeading="You can switch between your agency account and the subaccount from the sidebar"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails as Agency}
              userId={id}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      <span>Create Sub Account</span>
    </Button>
  );
};

export default CreateSubAccountButton;
