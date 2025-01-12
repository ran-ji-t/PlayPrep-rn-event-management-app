import { useEffect, useState } from "react";

import { Group } from "../types/group";

export const useGroupContext = () => {
  const [selectedGroup, setSelecetdGroup] = useState<Pick<Group, "id" | "name"> | "0" | undefined>(undefined);

  return {
    selectedGroup,
    setSelecetdGroup
  };
};
