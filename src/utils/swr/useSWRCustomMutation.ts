import { RequestInfo } from "@/types/RequestInfo";
import useSWRMutation from "swr/mutation";
 
const mutationFetcher = async <ResponseData, RequestData>(
  url: string,
  method: string,
  requestInfo: RequestInfo<RequestData>,
): Promise<ResponseData> => {
  const { body, queryParams } = requestInfo;
  const queryString = queryParams
  ? '?' + new URLSearchParams(queryParams).toString() 
  : '';

  const response = await fetch(url + queryString, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ResponseData>;
};


export const useSWRCustomMutation = <ResponseData = any, RequestData = unknown, ErrorType = Error>(
  url: string,
  method: string,
) => {
  const { trigger, isMutating, error } = useSWRMutation<ResponseData, ErrorType>(
    url, 
    (url: string, { arg }: { arg: RequestInfo<RequestData> }) => mutationFetcher<ResponseData, RequestData>(url, method, arg)
  );

  return {
    trigger: trigger as (arg?: RequestData) => Promise<ResponseData>,
    isMutating,
    error,
  };
};
