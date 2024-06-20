import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";

import type { Metadata, ResolvingMetadata } from "next";

import EmployeeNavigation from "./employee-navigation";

type Props = {
  children: React.ReactNode;
  params: { organizationId: string; employeeId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = createServerClient();
  const employee = await getEmployeeById(supabase, params.employeeId);
  return {
    title: `${employee.first_name} ${employee.last_name}`,
  };
}

export default function EmployeeDetailsLayout({ children, params }: Props) {
  return (
    <main className="flex flex-col h-full ">
      <EmployeeNavigation params={params} />
      {children}
    </main>
  );
}
