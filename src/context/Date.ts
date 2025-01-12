import moment from "moment";
import { createContext } from "react";

type contextType = {
  date: string;
  setDate: (val: string) => void;
};
export const DateContext = createContext<contextType>({
  date: "",
  setDate() {},
});
