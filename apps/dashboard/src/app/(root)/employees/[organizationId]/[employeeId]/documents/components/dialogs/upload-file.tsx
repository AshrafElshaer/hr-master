"use client";

import * as React from "react";

import { Button } from "@hr-toolkit/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@hr-toolkit/ui/dialog";

import UploadZone from "../files-table/upload-zone";
import { CloudUpload } from "lucide-react";

export function UploadFileDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CloudUpload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <UploadZone setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
