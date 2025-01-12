export type AuthStackParamsListBase = {
  Login: undefined;
  Signup: undefined;
  Onboard: undefined;
};

export type MainStackParamsListBase = {
  Drawer: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type DrawerParamsListBase = {
  Agenda: {
    isDrawerOpened: (flag: boolean) => void;
    onEventCreate: () => void
    onEventDeleted: () => void
  };
};
