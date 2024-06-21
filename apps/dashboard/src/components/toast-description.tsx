import React from "react";

type Props = {
	description: string;
};

function ToastDescription({ description }: Props) {
	return <p className="text-secondary-foreground/70">{description}</p>;
}

export default ToastDescription;
