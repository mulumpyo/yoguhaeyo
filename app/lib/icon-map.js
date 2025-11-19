import * as Icons from "lucide-react";

const DefaultIcon = Icons.Link; 

export const getIcon = (iconName) => {
  if (!iconName) {
    return DefaultIcon; 
  }

  const RequestedIcon = Icons[iconName];

  return RequestedIcon || DefaultIcon;
};