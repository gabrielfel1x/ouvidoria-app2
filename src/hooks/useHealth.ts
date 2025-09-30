import { useQuery } from "@tanstack/react-query";
import { http } from "../lib/axios";

type HealthResponse = { status: string };

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await http.get<HealthResponse>("/health");
      return data;
    },
  });
}


