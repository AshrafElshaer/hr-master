import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@hr-toolkit/ui/alert-dialog";
import { Button } from "@hr-toolkit/ui/button";
import { Input } from "@hr-toolkit/ui/input";
import { capitalize } from "lodash";

import React from "react";
import { deleteFolder } from "../../actions";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useDocumentPathname } from "@/hooks/useDocumentPathname";
type Props = {
  isDelete: boolean;
  setIsDelete: (value: boolean) => void;
  name: string;
};
function DeleteFolder({ isDelete, name, setIsDelete }: Props) {
  const { organizationId, employeeId, folderPath, pathname } =
    useDocumentPathname();
  const [confirmName, setConfirmName] = React.useState("");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee", "employee_folders", employeeId, pathname],
      });
    },
  });

  async function handleDelete() {
    const { data, serverError } = await mutateAsync({
      organizationId,
      employeeId,
      folderPath,
      folderName: name,
    });
    if (serverError) {
      return toast.error(serverError);
    }
    if (data) {
      toast.success("Folder deleted successfully");
      setIsDelete(false);
    }
  }

  return (
    <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {capitalize(name)} folder , it's subfolders and remove the data from
            our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col w-full gap-2">
          <p className="text-secondary-foreground/70">
            Please type{" "}
            <span className="p-1 rounded bg-border mx-1 text-foreground select-none">
              {name}
            </span>
            to confirm deletion.
          </p>
          <Input
            placeholder="Folder name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={confirmName !== name || isPending}
            variant={"destructive"}
            onClick={handleDelete}
            className="flex items-center"
          >
            {isPending && <Loader className="w-5 h-5 mr-2 animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteFolder;

// Lakshmi Deepthi
