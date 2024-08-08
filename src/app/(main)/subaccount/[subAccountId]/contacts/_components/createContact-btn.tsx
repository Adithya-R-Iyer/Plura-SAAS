"use client";

import ContactForm from "@/components/forms/customer-contact-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/model-provider";
import { PlusIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  subAccountId: string;
  className?: string;
};

const CreateContactBtn = ({ subAccountId, className }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = () => {
    setOpen(
      <CustomModal
        title="Create or Update Contact Information"
        subHeading="Please enter the below contact information"
      >
        <ContactForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };

  return (
    <Button
      onClick={handleCreateContact}
      className={twMerge("flex items-center gap-2", className)}
    >
      <PlusIcon size={15} />
      <span>Add Contact</span>
    </Button>
  );
};

export default CreateContactBtn;
