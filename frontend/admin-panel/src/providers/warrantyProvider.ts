import simpleRestProvider from "ra-data-simple-rest";
import type { DataProvider, RaRecord, Identifier, DeleteManyParams, DeleteManyResult, GetOneParams} from "react-admin";
// import path from "path";

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
            console.log("API Response:", data);
            return data;
        });

};

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const normalizeStatus = (status: string) => {
    const statusMapping: { [key: string]: string } = {
        "Manual Review": "manual_review",
        "Rejected": "rejected",
        "Approved": "approved",
        "Pending": "pending",
    };

    return statusMapping[status] || "pending"; // ✅ המרה לערך תקף
};

// const getDownloadUrl = async (resource: string, id: string, filename: string): Promise<string | null> => {
//     const response = await fetch(`${apiUrl}/${resource}/${id}/download/${filename}`, {
//         method: "GET",
//         headers: getHeaders(),
//     });

//     if (!response.ok) {
//         console.error(`Failed to fetch download URL: ${response.status} ${response.statusText}`);
//         return null;
//     }

//     const responseJson = await response.json();
//     console.log("Fetched download URL:", responseJson);

//     return responseJson.url || null; // Assuming the server returns the download URL in `url`
// };


export const warrantyProvider: DataProvider = {
    ...simpleRestProvider(apiUrl, httpClient),

    getList: async (resource: string) => {
        // console.log("Params:", params); 

        const response = await fetch(`${apiUrl}/${resource}`, {
            method: "GET",
            headers: getHeaders(),
        });

        const { warranties } = await response.json();
        // console.log("Processed Data:", warranties);
        console.log("Raw warranty data from server:", warranties);
        return {
            data: warranties.map((item: { _id: string; status: string; invoiceUpload: string }) => ({
                ...item,
                id: item._id,
                status: normalizeStatus(item.status),
            })),
            total: warranties.length,

        };
    },
    getOne: async <RecordType extends RaRecord<Identifier>>(
        resource: string,
        params: GetOneParams<RecordType>
    ): Promise<{ data: RecordType }> => {
        console.log("Admin Token:", localStorage.getItem("token"));
        console.log("Fetching warranty ID:", params.id); 
    
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "GET",
            headers: getHeaders(),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to fetch warranty: ${response.status} ${response.statusText}`);
        }
    
        const responseJson = await response.json();
        console.log("Fetched warranty data from server:", responseJson);

        

        // const invoiceDownloadUrl = responseJson.data.invoiceUpload
        // ? await getDownloadUrl(resource, responseJson.data.id, "1747159803741-receipt")
        // : null;


        return {
            data: {
                ...responseJson.data,
                id: responseJson.data._id,
                status: normalizeStatus(responseJson.data.status),
                // invoiceDownloadUrl,
            } as RecordType,    
        };
    },
    update: async (resource: string, params: { id: string; data: any }) => {
        console.log("Updating record ID:", params.id);
        console.log("Data to update:", params.data);
    
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(params.data),
        });
    
        const responseText = await response.text();
        console.log("Server Response:", responseText);
    
        if (!response.ok) {
            throw new Error(`Failed to update warranty: ${response.status} ${response.statusText}`);
        }
    
        const updatedWarranty = JSON.parse(responseText);
        if (!updatedWarranty) {
            throw new Error("Server response is empty or invalid.");
        }
    
        return { data: updatedWarranty };
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
        console.log("Server Response:", responseJson);
    
        return { data: responseJson.ids }; 
    },
};

