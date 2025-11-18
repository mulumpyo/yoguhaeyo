"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = ({
  ...props
}) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

const CollapsibleTrigger = ({
  ...props
}) => {
  return (<CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />);
};

const CollapsibleContent = ({
  ...props
}) => {
  return (<CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />);
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
