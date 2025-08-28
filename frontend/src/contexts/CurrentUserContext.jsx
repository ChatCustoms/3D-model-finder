import { createContext } from "react";

const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export default CurrentUserContext;
