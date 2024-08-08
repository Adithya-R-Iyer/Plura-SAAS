import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { subAccountId: string };
};

const Pipelines = async ({ params }: Props) => {
  const subAccountId = params.subAccountId;
  const pipelineExist = await db.pipeline.findFirst({
    where: {
      subAccountId: params.subAccountId,
    },
  });

  if (pipelineExist) {
    return redirect(
      `/subaccount/${subAccountId}/pipelines/${pipelineExist.id}`
    );
  }

  try {
    const response = await db.pipeline.create({
      data: {
        name: "First Pipeline",
        subAccountId,
      },
    });
    return redirect(`/subaccount/${subAccountId}/pipelines/${response.id}`);
    
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Oppse!",
      description: "Some error occured.",
    });
    return redirect(`/subaccount/${subAccountId}`);
  }
};

export default Pipelines;
