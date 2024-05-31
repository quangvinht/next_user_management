import {
  createUserApi,
  deleteUserApi,
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

// Hook tìm kiếm người dùng theo username
export const useSearchUser = (username: string , initialData: User[] | null = null) => {
 return useQuery<User[]>({
    queryKey: ['searchUsers', username],
    queryFn: async() =>[ await fetchUserByUsername(username)],
   enabled: !!username,
   initialData : initialData || [],
  });
};

// Hook tạo người dùng mới

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createUserDto: CreateUserDto) => await createUserApi(createUserDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Hook cập nhật người dùng
export const useUpdateUser = (

) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; updateUserDto: UpdateUserDto }) => await  updateUserApi(data.username, data.updateUserDto),
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
