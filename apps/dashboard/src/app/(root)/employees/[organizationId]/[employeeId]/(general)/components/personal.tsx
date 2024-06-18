"use client";
import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card, CardContent, CardHeader } from "@hr-toolkit/ui/card";
import { User } from "lucide-react";
import { Button } from "@hr-toolkit/ui/button";
import { format } from "date-fns";
import { capitalize } from "lodash";

type Props = {
  employee: UserWithDepartment;
};

export default function PersonalInfo({ employee }: Props) {
  return (
    <Card className="w-full p-4 flex-grow flex flex-col gap-8">
      <CardHeader className="p-0 flex-row items-center gap-2 font-bold">
        <User size={18} />
        <span>Personal Information</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-secondary-foreground/80 text-sm">
                Date of Birth -
              </span>
              {employee.date_of_birth ? (
                <span>
                  {format(
                    new Date(employee.date_of_birth ?? ""),
                    "MMMM dd, yyyy",
                  )}
                </span>
              ) : (
                <span>Not Available</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-secondary-foreground/80 text-sm">
                Gender -
              </span>
              <span>{capitalize(employee.gender ?? "")}</span>
            </div>
          </div>
          <div className="w-full flex flex-col  gap-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-secondary-foreground/80 text-sm">
                Hired At -
              </span>
              {employee.hire_date ? (
                <span>
                  {format(new Date(employee.hire_date ?? ""), "MMMM dd, yyyy")}
                </span>
              ) : (
                <span>Not Available</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
