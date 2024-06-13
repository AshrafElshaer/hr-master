import { ScrollArea } from "@hr-toolkit/ui/scroll-area";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import React from "react";

export default function GeneralInfoLoading() {
  return (
    <ScrollArea className="p-4 h-[calc(100svh_-_110px)] sm:pb-4">
      <section className="gap-4 flex flex-col h-full sm:flex-row">
        <Skeleton className="w-full h-full flex-grow sm:w-1/3" />
        <div className="flex flex-col gap-4 w-full flex-grow justify-between">
          <Skeleton className="w-full h-40 sm:h-auto  flex-grow " />
          <Skeleton className="w-full  flex-grow " />
          <Skeleton className="w-full  flex-grow " />
        </div>
      </section>
    </ScrollArea>
  );
}
