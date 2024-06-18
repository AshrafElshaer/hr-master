"use client";

import type { StorageFile } from "@hr-toolkit/supabase/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { formatBytes } from "@/lib/utils";

export const columns: ColumnDef<StorageFile>[] = [
  {
    accessorKey: "name",
    header: () => <div className="min-w-[15rem]">File Name</div>,
    cell: ({ row }) => {
      const file = row.original;

      return <span>{file.name?.split(".").shift() ?? "N/A"}</span>;
    },
  },
  {
    accessorKey: "created_at",

    header: () => <div className="min-w-[12rem]">Uploaded At</div>,
    cell: ({ row }) => {
      const file = row.original;

      return format(new Date(file.created_at ?? ""), "MMM dd, yyyy | hh:mm a");
    },
  },
  {
    id: "type",
    header: () => <div className="w-[4rem]">Type</div>,
    cell: ({ row }) => {
      const file = row.original;

      return file?.name?.split(".").pop()?.toUpperCase() ?? "N/A";
    },
  },
  {
    id: "size",
    header: () => <div className="w-[5rem]">Size</div>,
    cell: ({ row }) => {
      const file = row.original;

      return (
        <span className="text-sm ">
          {formatBytes(
            (Object.create(file?.metadata as object)?.size as number) ?? 0,
          )}
        </span>
      );
    },
  },
];
