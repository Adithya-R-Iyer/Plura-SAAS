"use client"

import { useModal } from '@/providers/model-provider';
import React from 'react'
import { Button } from '../ui/button';
import CustomModal from '../global/custom-modal';
import UploadMediaForm from '../forms/upload-media';

type Props = {
    subAccountId: string;
}

const MediaUploadButton = ({ subAccountId }: Props) => {

    const { setOpen } = useModal();

  return (
    <Button
        onClick={() => {
            setOpen(
                <CustomModal
                    title='Upload Media'
                    subHeading='Upload a file to your media bucket'
                >
                    <div></div>
                    <UploadMediaForm subAccountId={subAccountId}/>
                </CustomModal>
            )
        }}
    >
        Upload
        </Button>
  )
}

export default MediaUploadButton