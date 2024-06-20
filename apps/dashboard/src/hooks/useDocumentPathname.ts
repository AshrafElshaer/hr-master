import { getSegmentAfterDocuments } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function useDocumentPathname() {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const folderPath = getSegmentAfterDocuments(decodeURI(pathname));
  const organizationId = paths[1];
  const employeeId = paths[2];

  return {
    organizationId,
    employeeId,
    folderPath,
    pathname,
  };
}
