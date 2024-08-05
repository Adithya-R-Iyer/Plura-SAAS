import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import React from "react";

type Props = {
  params: {
    subAccountId: string;
  };
};

const MediaPage = async ({ params }: Props) => {

    const subAccountId = params.subAccountId;
    const mediaFiles = await getMedia(params.subAccountId);
    

  return <>
    <MediaComponent
        data={mediaFiles}
        subAccountId={subAccountId}
    />
  </>;
};

export default MediaPage;
