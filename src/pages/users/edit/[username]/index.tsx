import { useGetUserByUsername, useUpdateUser } from "@/hooks/userHook";
import { fetchSingleUserByUsername } from "@/services/userService";
import { UpdateUserDto, User } from "@/types/user";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.query;

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["users", username as string],
      queryFn: async () => await fetchSingleUserByUsername(username as string),
    });
  } catch (error) {
    console.error("Error prefetching users:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function EditUserPage() {
  const router = useRouter();

  const { username } = router.query;
  const { data: user } = useGetUserByUsername(username as string);

  const originalUsername = user?.username;

  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState<UpdateUserDto>({
    username: "",
    fullname: "",
    role: "",
    project: [],
    activeYn: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      project: value.split(",").map((project) => project.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({
        username: (user && user.username) || "",
        updateUserDto:
          formData.username === originalUsername
            ? {
                fullname: formData.fullname,
                role: formData.role,
                project: formData.project,
                activeYn: formData.activeYn,
              }
            : formData,
      });
      router.push("/");
    } catch (error) {
      return <div>Failed to update user</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 w-full">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fullname
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projects
          </label>
          <input
            type="text"
            name="project"
            value={(formData.project && formData.project.join(", ")) || ""}
            onChange={handleProjectChange}
            placeholder="Enter projects separated by commas"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Active
          </label>
          <select
            name="activeYn"
            value={formData.activeYn}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
