import React from "react";

function EmployeeDocuments({ params }: { params: { id: string } }) {
	return (
		<div>
			EmployeeDocuments
			<p>{params.id}</p>
		</div>
	);
}

export default EmployeeDocuments;
