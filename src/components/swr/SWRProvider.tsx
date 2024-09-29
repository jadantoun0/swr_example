"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/utils/swr/fetcher";

const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  {/* every time you use the useSWR hook in your app, it will automatically use this fetcher 
  function to fetch data unless a different fetcher is explicitly provided. */}
  return (
    <SWRConfig value={{ fetcher }}>
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;