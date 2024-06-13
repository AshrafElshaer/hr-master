import React from "react";

function EmployeePayroll({ params }: { params: { id: string } }) {
  return (
    <div>
      EmployeePayroll
      <p>{params.id}</p>
    </div>
  );
}

export default EmployeePayroll;
