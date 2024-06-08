import React from "react";
type Props = {
	params: { id: string; folder: string };
};
export default function FoldersPage(props: Props) {
	console.log(props);
	return <div>FoldersPage , {decodeURI(props.params.folder)}</div>;
}
