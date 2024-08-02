import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infoBar";
import Sidebar from "@/components/sidebar";
import UnauthorizedComponent from "@/components/unauthorized";
import { getNotificationAndUser } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const Layout = async ({ children, params }: Props) => {
  const agencyId = params.agencyId;
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <UnauthorizedComponent />;
  }

  let allNotifications: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) {
    allNotifications = notifications;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNotifications} role={allNotifications.User?.Role} />
        <div className="relative">
          <BlurPage>
            {children}
          </BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
