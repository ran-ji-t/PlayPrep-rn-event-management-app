import auth from "@react-native-firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../components/Toast";
import { useGroupContext } from "../../hooks/useGroupContext";
import {
  createGroup as create,
  fetchAllGroup,
  joinGroup as join,
} from "../../services/apiHandler";
import { signOutHandler } from "../../services/firebaseAuthHandler";
import { MainStackParamsListBase } from "../../types/navigationParamListBase";
import { DrawerNavigationProps } from "../../types/props";
import { Group } from "../../types/group";
import { useListener } from "../../hooks/useListener";
import moment from "moment";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export const useDrawer = () => {
  const [code, setCode] = useState<string>("");
  const user = useMemo(() => auth().currentUser, []);
  const { selectedGroup, setSelecetdGroup } = useGroupContext();
  const queryId = useMemo(() => {
    if (!selectedGroup) return "ALL";
    if (selectedGroup == "0") return selectedGroup;
    return selectedGroup.id;
  }, [selectedGroup]);
  const [groups, setGroups] = useState<Pick<Group, "id" | "name" | "count">[]>(
    []
  );
  const title = useMemo(
    () =>
      selectedGroup
        ? selectedGroup == "0"
          ? "Personal"
          : selectedGroup.name
        : "All",
    [selectedGroup]
  );
  const { navigate } = useNavigation<DrawerNavigationProps>();
  const {
    actions,
    eventIds,
    groupIds,
    updateActions,
    updateEventIds,
    updateGroupIds,
    deleteAction,
    deleteEventId,
    deleteGroupId,
    register,
  } = useListener();
  const queryClient = useQueryClient();
  const [groupTitle, setTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [date, setDate] = useState(moment().toString());
  const createSheetRef = useRef<BottomSheetModal>(null);
  const joinSheetRef = useRef<BottomSheetModal>(null);

  const {
    data,
    isLoading: isFetching,
    isError: isFectchError,
    refetch,
  } = useQuery({
    queryKey: [`group/fetchAll/${queryId}`],
    queryFn: fetchAllGroup,
    refetchOnReconnect: true,
  });
  useEffect(() => {
    if (data) setGroups(data);
  }, [data]);
  useEffect(() => {
    if (isFectchError) showToast("Error fetching groups");
  }, [isFectchError]);
  const joinGroup = async (onSuccess: () => void) => {
    if (code.trim().length != 6) return;
    try {
      const res = await join(code);
      setGroups((pre) => [res, ...pre]);
      setSelecetdGroup(res);
      onSuccess();
      setCode("");
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
  };
  const createGroup = async (onSuccess: () => void) => {
    try {
      const res = await create(groupTitle, [], groupDescription);
      setGroups((pre) => [
        {
          ...res,
          count: 0,
        },
        ...pre,
      ]);
      setSelecetdGroup(res);
      showToast("Group created successfully");
      onSuccess();
      createSheetRef.current?.forceClose()
      setTitle("");
      setGroupDescription("");
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
  };
  const navigateTo = (screenName: keyof MainStackParamsListBase) =>
    navigate(screenName);
  const logout = () => {
    queryClient.removeQueries();
    signOutHandler();
  };

  return {
    code,
    setCode,
    user,
    title,
    joinGroup,
    groups,
    selectedGroup,
    setSelecetdGroup,
    logout,
    navigateTo,
    isFetching,
    createGroup,
    actions,
    eventIds,
    groupIds,
    updateActions,
    updateEventIds,
    updateGroupIds,
    deleteAction,
    deleteEventId,
    deleteGroupId,
    groupDescription,
    groupTitle,
    setTitle,
    setGroupDescription,
    register,
    refetch,
    date,
    setDate,
    joinSheetRef,
    createSheetRef,
  };
};
