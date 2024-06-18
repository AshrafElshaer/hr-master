import React from "react";

function EmployeeAttendance({ params }: { params: { id: string } }) {
  return (
    <div>
      EmployeeAttendance
      <p>{params.id}</p>
    </div>
  );
}

export default EmployeeAttendance;
