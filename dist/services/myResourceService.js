"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMyResources = fetchMyResources;
exports.deleteResource = deleteResource;
const axios_1 = require("@/lib/axios");
async function fetchMyResources(filters) {
    const res = await axios_1.api.get("/resources", {
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
async function deleteResource(id) {
    await axios_1.api.delete(`/resources/${id}`);
}
