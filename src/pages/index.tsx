import Image from "next/image";
import { Inter } from "next/font/google";
import UserTable from "@/components/UserTable";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { User } from "@/types/user";
import { fetchUsers } from "@/services/userService";
import { useUsers } from "@/hooks/userHook";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  try {
    // Prefetch dữ liệu người dùng
    await queryClient.prefetchQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
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

export default function Home() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className={` ${inter.className}`}>
      <UserTable users={users} />
    </main>
  );
}
