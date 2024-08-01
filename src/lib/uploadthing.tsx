import { generateUploadButton, generateUploadDropzone, generateUploader } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react';

import { ourFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
export const Uploader = generateUploader();

export const { useUploadThing, uploadFiles } = generateReactHelpers<typeof ourFileRouter>();

