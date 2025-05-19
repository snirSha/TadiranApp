import simpleRestProvider from "ra-data-simple-rest";
import type { DataProvider, RaRecord, Identifier, DeleteManyParams, DeleteManyResult, GetOneParams, DeleteParams, DeleteResult} from "react-admin";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const httpClient = (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");
    // console.log("Auth Token:", localStorage.getItem("token"));
    if (!token) return Promise.reject("No token, authorization denied");

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };
    return fetch(url, options)
        .then(async (response) => {
            const data = await response.json();
            // console.log("API Response:", data);
            return data;
        });

};

export const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDownloadUrl = async (warrantyId: string): Promise<string> => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    return `${apiUrl}/warranties/${warrantyId}/download`; 
};


export const warrantyProvider: DataProvider = {
    ...simpleRestProvider(apiUrl, httpClient),

    getList: async (resource: string) => {

        const response = await fetch(`${apiUrl}/${resource}`, {
            method: "GET",
            headers: getHeaders(),
        });

        const { warranties } = await response.json();
        // console.log("Raw warranties from server:", warranties);
        return {
            data: warranties.map((item: { _id: string; userId: { name: string }; installationDate: string; status: string; invoiceUpload: string }) => ({
                ...item,
                id: item._id,
                installerName: item.userId?.name || "Unknown Installer", 
                installationDate: item.installationDate?.split("T")[0],
                status: item.status,
            })),
            total: warranties.length,

        };
    },
    getOne: async <RecordType extends RaRecord<Identifier>>(
        resource: string,
        params: GetOneParams<RecordType>
    ): Promise<{ data: RecordType }> => {
    
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "GET",
            headers: getHeaders(),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to fetch warranty: ${response.status} ${response.statusText}`);
        }
    
        const responseJson = await response.json();
        // console.log("🔍 Warranty Data:", responseJson.data);
        // console.log("🔍 Installer Name:", responseJson.data.userId?.name);
        return {
            data: {
                ...responseJson.data,
                id: responseJson.data._id,
                installerName: responseJson.data.userId.name || "Unknown Installer",
                installationDate: responseJson.data.installationDate.split("T")[0], //only date, no time
                status: responseJson.data.status,
                fileName: responseJson.data.invoiceUpload ? responseJson.data.invoiceUpload.split("\\").pop() : null,
            } as RecordType,    
        };
    },
    update: async (resource: string, params: { id: string; data: any }) => {

        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(params.data),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to update warranty: ${response.status} ${response.statusText}`);
        }
    
        const updatedWarranty = await response.json();


        if (!updatedWarranty || !updatedWarranty.warranty || !updatedWarranty.warranty._id) {
            throw new Error("Server response is missing 'id' key.");
        }
        
        return { data: { id: updatedWarranty.warranty._id, ...updatedWarranty.warranty } };
    },
    delete: async <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
        console.log("Deleting record ID:", params.id);
    
        const response = await fetch(`${apiUrl}/${resource}`, {
            method: "DELETE",
            headers: getHeaders(),
            body: JSON.stringify({ ids: [params.id] }), //will use deleteWarrantyController for one to many records
        });
    
        if (!response.ok) {
            throw new Error(`Failed to delete warranty: ${response.status} ${response.statusText}`);
        }
    
        const responseJson = await response.json();
    
        return { data: responseJson.ids }; // return the if of the deleted warranty
    },
    deleteMany: async <RecordType extends RaRecord<Identifier>>(
        resource: string,
        params: DeleteManyParams<RecordType>
    ): Promise<DeleteManyResult<RecordType>> => {
        const response = await fetch(`${apiUrl}/${resource}`, {
            method: "DELETE",
            headers: getHeaders(),
            body: JSON.stringify({ ids: params.ids }),
        });
    
        if (!response.ok) {
            throw new Error("Failed to delete warranties");
        }
    
        const responseJson = await response.json();
    
        return { data: responseJson.ids }; 
    },
};

