"use client";

import * as React from "react";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ServiceSelectionBreakdown({parentName,
	childServices,
	selectedServices,
	toggleService}) {
	const [showStatusBar, setShowStatusBar] = React.useState(true);
	const [showActivityBar, setShowActivityBar] = React.useState(false);
	const [showPanel, setShowPanel] = React.useState(true);
	
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<p className="cursor-pointer bg-yellow-800 p-2 rounded-sm">{parentName}</p>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Services</DropdownMenuLabel>
				<DropdownMenuSeparator />
				
				{childServices.map((service, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedServices.includes(service)}
            onCheckedChange={() => toggleService(service)}
          >
            {service}
          </DropdownMenuCheckboxItem>
        ))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
