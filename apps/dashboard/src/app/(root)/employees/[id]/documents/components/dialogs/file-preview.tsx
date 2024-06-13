import { formatBytes } from "@/lib/utils";
import type { StorageFile } from "@hr-toolkit/supabase/types";
import { Button } from "@hr-toolkit/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@hr-toolkit/ui/sheet";
import { format } from "date-fns";
import { Share2, X } from "lucide-react";
import React from "react";
import { LuDownloadCloud } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hr-toolkit/ui/dropdown-menu";

type Props = {
  selectedFile: StorageFile | null;
  setSelectedFile: (value: null) => void;
};

export default function FilePreview({ selectedFile, setSelectedFile }: Props) {
  return (
    <Sheet
      open={Boolean(selectedFile)}
      onOpenChange={(evt) => evt === false && setSelectedFile(null)}
    >
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetClose className="p-4">
          <X className="h-4 w-4" />
        </SheetClose>
        <div className=" p-4">
          <div className="w-3/4 aspect-square border rounded flex justify-center items-center mx-auto">
            {selectedFile?.name}
          </div>
        </div>
        <SheetHeader className="p-4">
          <SheetTitle>{selectedFile?.name}</SheetTitle>
          <SheetDescription>
            {selectedFile?.metadata.mimetype} -{" "}
            {formatBytes(selectedFile?.metadata.size)}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {selectedFile?.created_at && (
            <SheetDescription>
              Added On
              <br />
              {format(
                new Date(selectedFile.created_at),
                "MMM dd, yyyy | hh:mm a",
              )}
            </SheetDescription>
          )}
        </div>
        <div className="flex p-4 items-center gap-2">
          <Button variant={"outline"}>
            <LuDownloadCloud className="h-4 w-4 mr-2" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" >
              <DropdownMenuItem>
                Expire in 1 week
              </DropdownMenuItem>
              <DropdownMenuItem>
                Expire in 1 month
              </DropdownMenuItem>
              <DropdownMenuItem>
                Expire in 1 year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant={"destructive"} className="ml-auto">
            <FaTrash className="h-3 w-3 mr-2" />
            Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
