import { createContext } from "react";

import { Group } from "../types/group";

type ContextType = {
  selectedGroup: Pick<Group, "id" | "name"> | "0" | undefined;
};
export const GroupContext = createContext<ContextType>({
  selectedGroup: undefined,
});
