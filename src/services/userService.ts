import axiosInstance from "@/axios/axiosConfig";
import { ToastType } from "@/enums/toast";
import { notify } from "@/lib/utils";
import { CreateUserDto, UpdateUserDto, User } from "@/types/user";

const BASE_URL = "/users";
interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}
// Lấy danh sách người dùng
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>(BASE_URL);
    //notify("Fetched users successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Fetched users failed", ToastType.ERROR);
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `${BASE_URL}/${id}`
    );
    //notify("Fetched users successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Fetched users failed", ToastType.ERROR);
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchSingleUserByUsername = async (
  username: string
): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `${BASE_URL}/username/${username}`
    );
    //notify("Fetched users successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Fetched users failed", ToastType.ERROR);
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Tìm kiếm người dùng theo username
export const fetchUserByUsername = async (
  username: string | undefined
): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `${BASE_URL}/search`,
      {
        params: { username },
      }
    );
    //notify("Fetched user successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    // notify("Fetched user failed", ToastType.ERROR);
    console.error(`Error searching user by username: ${username}`, error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUserApi = async (
  createUserDto: CreateUserDto
): Promise<User> => {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>(
      BASE_URL,
      createUserDto
    );
    notify("Created user successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Created user failed", ToastType.ERROR);
    console.error("Error creating user:", error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserApi = async (
  username: string,
  updateUserDto: UpdateUserDto
): Promise<User> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      BASE_URL,
      updateUserDto,
      {
        params: { username },
      }
    );
    notify("Updated user successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Updated user failed", ToastType.ERROR);
    console.error(`Error updating user with username: ${username}`, error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUserApi = async (username: string): Promise<User> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      `${BASE_URL}`,
      {
        params: { username },
      }
    );
    notify("Deleted user successfully", ToastType.SUCCESS);
    return response.data.data;
  } catch (error) {
    notify("Deleted user failed", ToastType.ERROR);
    console.error(`Error deleting user with username: ${username}`, error);
    throw error;
  }
};
