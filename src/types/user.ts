import { User } from "lucide-react";

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

export type User = {
  _id: string;
  username: string;
  fullname: string;
  role: string;
  project: string[];
  activeYn: string;
};

// Interface cho DTO khi tạo người dùng
export type CreateUserDto = {
  username: string;
  fullname: string;
  role: string;
  project: string[];
  activeYn: string;
};

// export type cho DTO khi cập nhật người dùng
export type UpdateUserDto = {
  username?: string;
  fullname?: string;
  role?: string;
  project?: string[];
  activeYn?: string;
};
