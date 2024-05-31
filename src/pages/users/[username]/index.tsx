import { useGetUserByUsername } from "@/hooks/userHook";
import { fetchSingleUserByUsername } from "@/services/userService";
import { User } from "@/types/user";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.query;

  const queryClient = new QueryClient();

  try {
    // Prefetch dữ liệu người dùng
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

export default function Profile() {
  const router = useRouter();

  const { username } = router.query;

  const {
    data: user,
    isLoading,
    error,
  } = useGetUserByUsername(username as string);

  if (isLoading)
    return (
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        {" "}
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        Error: {error.message}
      </div>
    );
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
