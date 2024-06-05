import React from "react";
type Props = {
	params: { id: string; folder: string };
};
export default function FoldersPage(props: Props) {
	console.log({ props: props });
	return <div>FoldersPage , {props.params.folder}</div>;
}
