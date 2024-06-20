"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { cn } from "@hr-toolkit/ui/utils";

import BackButton from "@/components/back-button";
import Link from "next/link";
import { Clock, FileText, NotebookTabs } from "lucide-react";
import { HiOutlineBanknotes } from "react-icons/hi2";

type Props = {
  params: { organizationId: string; employeeId: string };
};

export default function EmployeeNavigation({ params }: Props) {
  const pathname = usePathname();
  const employeeId = params.employeeId;
  const organizationId = params.organizationId;

  return (
    <section className=" w-full flex items-center gap-2 overflow-x-scroll overflow-y-clip scrollbar-hide py-3 px-4">
      <BackButton />
      {employeeDetailsNavigation.map((route) => {
        const isActivePath =
          (route.path === "/" &&
            pathname === `/employees/${organizationId}/${employeeId}`) ||
          (route.path !== "/" && pathname.includes(route.path));

        return (
          <Link
            href={`/employees/${organizationId}/${employeeId}${route.path}`}
            key={`/employees/${organizationId}/${employeeId}${route.path}`}
            className={cn(
              buttonVariants({
                variant: isActivePath ? "secondary" : "ghost",
                className: "gap-2",
              }),
            )}
          >
            {route.icon}
            {route.title}
          </Link>
        );
      })}
    </section>
  );
}

const employeeDetailsNavigation = [
  {
    title: "General",
    path: "/",
    icon: <NotebookTabs className="w-4 h-4" />,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    title: "Payroll",
    path: "/payroll",
    icon: <HiOutlineBanknotes className="w-4 h-4" />,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: <FileText className="w-4 h-4" />,
  },
];
