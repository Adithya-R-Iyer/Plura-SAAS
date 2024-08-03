import React from "react";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndPoint: "agencyLogo" | "avatar" | "subAccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndPoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-2">
        {type !== "pdf" ? (
          <div className="relative h-full flex items-center">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              width={75}
              height={75}
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button variant="secondary" type="button" className="flex gap-2" onClick={() => onChange("")}>
          <X className="h-4 w-4" />
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndPoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.error("Error uploading file:", error);
        }}
      />
    </div>
  );
};

export default FileUpload;
