import * as Icons from "lucide-react";

export const getIcon = (iconName) => {
  if (!iconName) return null;
  return Icons[iconName] || null;
};
