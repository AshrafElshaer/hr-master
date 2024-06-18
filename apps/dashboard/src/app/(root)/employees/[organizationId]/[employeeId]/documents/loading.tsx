import { cn } from "@hr-toolkit/ui/utils";
import { Button, buttonVariants } from "@hr-toolkit/ui/button";

import { Skeleton } from "@hr-toolkit/ui/skeleton";
import { IoIosFolderOpen } from "react-icons/io";
import { FolderPlus, Folders } from "lucide-react";

function DocumentsRootLoading() {
  return (
    <section className="w-full flex flex-col gap-4 p-4 ">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between ">
        <div className="flex items-center gap-2 ">
          <div className="flex  items-center gap-2 h-9 w-full sm:w-[250px] rounded-md  border bg-transparent px-3 py-1 text-base md:text-sm ui-transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none cursor-not-allowed opacity-50 animate-pulse">
            <Folders size={18} />
            Search Folders
          </div>

          <div className="flex items-center gap-2 sm:hidden ">
            <Button
              variant="outline"
              className="gap-2 items-center"
              size={"sm"}
              disabled
            >
              <FolderPlus className="w-5 h-5" />{" "}
            </Button>
          </div>
        </div>

        <div className="sm:flex items-center gap-2 hidden">
          <Button
            variant="outline"
            className="gap-2 items-center"
            size={"sm"}
            disabled
          >
            <FolderPlus className="w-5 h-5" />{" "}
          </Button>
        </div>
      </div>
      <div className={"w-full flex items-center gap-2  flex-wrap"}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "flex flex-col items-center hover:bg-background",
            )}
            key={idx.toString()}
          >
            <IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14 animate-pulse rounded-md text-primary/10" />
            <Skeleton className="w-3/4 mx-auto h-2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DocumentsRootLoading;
