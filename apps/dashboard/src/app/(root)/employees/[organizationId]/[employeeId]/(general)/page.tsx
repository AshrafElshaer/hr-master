import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import BasicInfo from "./components/basics";
import { ScrollArea } from "@hr-toolkit/ui/scroll-area";
import PersonalInfo from "./components/personal";
import Address from "./components/address";
import Emergency from "./components/emergency";

export default async function EmployeeDetails({
  params,
}: { params: { organizationId: string; employeeId: string } }) {
  const employeeId = params.employeeId;
  const organizationId = params.organizationId;
  const supabase = createServerClient();
  const employee = await getEmployeeById(supabase, employeeId);

  return (
    <ScrollArea className="p-4 h-[calc(100svh_-_110px)] sm:pb-4">
      <section className="gap-4 flex flex-col h-full sm:flex-row">
        <BasicInfo employee={employee} />
        <div className="flex flex-col gap-4 w-full flex-grow justify-between">
          <PersonalInfo employee={employee} />
          <Address employee={employee} />
          <Emergency employee={employee} />
        </div>
      </section>
    </ScrollArea>
  );
}
