import { api } from "@/lib/axios";
import { MyResourcesFilters, MyResourcesResponse } from "@/types/myResource";

export async function fetchMyResources(filters: MyResourcesFilters): Promise<MyResourcesResponse> {
  const res = await api.get("/resources", {
    params: {
      mine: "true",
      search: filters.search || undefined,
      subject: filters.subject !== "All" ? filters.subject : undefined,
      status: filters.status !== "All" ? filters.status : undefined,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
  return res.data;
}

export async function deleteResource(id: string): Promise<void> {
  await api.delete(`/resources/${id}`);
}