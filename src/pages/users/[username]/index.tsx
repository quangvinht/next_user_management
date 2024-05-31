import { User } from "@/types/user";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.query;

  let userData: User | null = null;
  userData = JSON.parse(user as string);

  return {
    props: {
      user: userData,
    },
  };
};

export default function Profile({ user }: { user: User }) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Detail</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="mt-4">
            <p className="text-gray-600">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-medium">Fullname:</span> {user?.fullname}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-medium">Role:</span> {user?.role}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-medium">Active:</span> {user?.activeYn}
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="text-lg font-semibold text-gray-700">Projects</h2>
          <ul className="mt-4 list-disc list-inside">
            {user?.project.map((project: string, index: number) => (
              <li key={index} className="text-gray-600">
                {project}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
