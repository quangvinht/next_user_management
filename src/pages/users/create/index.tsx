import { useCreateUser } from "@/hooks/userHook";
import { CreateUserDto } from "@/types/user";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";


export const getServerSideProps: GetServerSideProps = async () => {
   
    const initialData: CreateUserDto = {
      username: '',
      fullname: '',
      role: '',
      project: [],
      activeYn: 'Y',
    };
  
    return {
      props: {
        initialData,
      },
    };
  };


const CreateUser = ({ initialData }: { initialData: CreateUserDto }) => {
  const router = useRouter();
  const createUser = useCreateUser();

  const [formData, setFormData] = useState<CreateUserDto>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(formData);
      router.push("/");
    } catch (error) {
      return <div>Failed to create user</div>;
    }
  };
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      project: value.split(",").map((project) => project.trim()), 
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 w-full">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projects
          </label>
          <input
            type="text"
            name="project"
            value={formData.project.join(", ")}
            onChange={handleProjectChange}
            placeholder="Enter projects separated by commas"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
