import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";

import { IoIosFolderOpen } from "react-icons/io";
import CreateFolderDialog from "./components/dialogs/create-folder";
import DocumentsNavigation from "./components/navigation";

async function EmployeeDocuments({ params }: { params: { id: string } }) {
  const employeeId = params.id;
  const data = await getEmployeeFolders(employeeId, "");
  const isEmpty = data?.length === 1 || !data;

  if (isEmpty)
    return (
      <main className="flex flex-col items-center justify-center h-full p-4 ">
        <div className="flex flex-col gap-4 items-center max-w-md">
          <IoIosFolderOpen className="h-52 w-52 text-muted-foreground" />
          <h1 className="text-xl font-bold text-muted-foreground">
            No folder's found
          </h1>
          <p className=" text-center  text-muted-foreground">
            You don't have any folders yet.
            <br />
            Create a folder to start uploading documents.
          </p>
          <CreateFolderDialog employeeId={params.id} folderPath="" />
        </div>
      </main>
    );
  return (
    <main className="flex flex-col items-center justify-start w-full h-full p-4 ">
      <DocumentsNavigation employeeId={employeeId} filesData={data} />
    </main>
  );
}

export default EmployeeDocuments;
