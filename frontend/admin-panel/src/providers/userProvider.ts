import { CreateResult, DataProvider, GetManyReferenceResult, GetManyResult, Identifier, RaRecord, UpdateManyResult } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const httpClient = (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");
    if (!token) return Promise.reject("No token, authorization denied");

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };
    return fetch(url, options)
        .then(async (response) => {
            const data = await response.json();
            return data;
        });
};

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const userProvider: DataProvider = {
    ...simpleRestProvider(apiUrl, httpClient),

    getList: async (resource) => {
        const response = await fetch(`${apiUrl}/${resource}`, {
            method: "GET",
            headers: getHeaders(),
        });

        const json = await response.json();
        return {
            data: json.users
                .map((user: { _id: string; name: string; email: string }) => ({
                    ...user,
                    id: user._id,
                })),
            total: json.users.length,
        };
    },

    getOne: async (resource, params) => {
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "GET",
            headers: getHeaders(),
        });

        const json = await response.json();
        return { data: { ...json, id: json._id } };
    },


    update: async (resource, params) => {
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(params.data),
        });

        const json = await response.json();
        return { data: { ...json, id: json._id } };
    },


    delete: async (resource, params) => {
        const response = await fetch(`${apiUrl}/${resource}/`, {
            method: "DELETE",
            headers: getHeaders(),
            body: JSON.stringify({ ids: [params.id] }),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
        }
    
        const json = await response.json();
    
        if (!json.ids) { // ✅ בדיקה אם `ids` קיים
            throw new Error(json.message || "Invalid response format: missing 'ids' field");
        }
    
        return { data: json.ids }; // ✅ החזרת `ids` רק אם הוא קיים
    },

    deleteMany: async (resource, params) => {
        const response = await fetch(`${apiUrl}/${resource}/`, {
            method: "DELETE",
            headers: getHeaders(),
            body: JSON.stringify({ ids: params.ids }),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to delete users: ${response.status} ${response.statusText}`);
        }
    
        const json = await response.json();
    
        if (!json.ids) { // ✅ מחפש `ids` במקום `data`
            throw new Error("Invalid response format: missing 'ids' field");
        }
    
        return { data: json.ids }; // ✅ מחזיר `ids`
    },

    updateMany: function <RecordType extends RaRecord = any>(): Promise<UpdateManyResult<RecordType>> {
        throw new Error("Function not implemented.");
    },

    getMany: function <RecordType extends RaRecord = any>(): Promise<GetManyResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    getManyReference: function <RecordType extends RaRecord = any>(): Promise<GetManyReferenceResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    
    create: function <RecordType extends Omit<RaRecord, "id"> = any, ResultRecordType extends RaRecord = RecordType & { id: Identifier; }>(): Promise<CreateResult<ResultRecordType>> {
        throw new Error("Function not implemented.");
    },
    
};