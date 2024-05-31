import {
  createUserApi,
  deleteUserApi,
  fetchSingleUserByUsername,
  fetchUserById,
  fetchUserByUsername,
  fetchUsers,
  updateUserApi,
} from "@/services/userService";
import { CreateUserDto, UpdateUserDto, User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook lấy danh sách người dùng
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: async () => await fetchUserById(id),
  });
};

export const useGetUserByUsername = (username: string) => {
  return useQuery<User>({
    queryKey: ["users", username],
    queryFn: async () => await fetchSingleUserByUsername(username),
  });
};

// Hook tìm kiếm người dùng theo username
export const useSearchUser = (
  username: string,
  initialData: User[] | null = null
) => {
  return useQuery<User[]>({
    queryKey: ["searchUsers", username],
    queryFn: async () => [await fetchUserByUsername(username)],
    enabled: !!username,
    initialData: initialData || [],
  });
};

// Hook tạo người dùng mới

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createUserDto: CreateUserDto) =>
      await createUserApi(createUserDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Hook cập nhật người dùng
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      username: string;
      updateUserDto: UpdateUserDto;
    }) => await updateUserApi(data.username, data.updateUserDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Hook xóa người dùng
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => await deleteUserApi(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
