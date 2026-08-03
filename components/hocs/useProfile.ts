import { UserService } from "@/app/services/user.service";
import { IFullUser } from "@/app/types/user.interface";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const EMPTY_PROFILE = {} as IFullUser;

export const useProfile = () => {

  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['get profile'],
    queryFn: () => UserService.getProfile(),
    select: (data) => data.data,
    enabled: !!user
  });

  return {
    profile: data || EMPTY_PROFILE,
    isLoading: isLoading && !!user
  };
};
