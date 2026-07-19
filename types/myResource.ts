export interface MyResource {
  _id: string;
  title: string;
  subject: string;
  category: string;
  level: string;
  description: string;
  fileUrl: string;
  pages: number;
  status: "Processing" | "Ready";
  rating: number;
  ratingsCount: number;
  downloads: number;
  createdAt: string;
}

export interface MyResourcesResponse {
  data: MyResource[];
  total: number;
  totalPages: number;
}

export interface MyResourcesFilters {
  search: string;
  subject: string;
  status: string;
  page: number;
  pageSize: number;
}