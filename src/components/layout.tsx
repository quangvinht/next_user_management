import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className={`flex  min-h-screen bg-slate-300 flex-col items-center justify-center py-6 `}
    >
      {children}
    </main>
  );
};

export default Layout;
