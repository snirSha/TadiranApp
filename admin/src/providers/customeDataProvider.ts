import { DataProvider } from "react-admin";
import { warrantyProvider } from "./warrantyProvider";
import { userProvider } from "./userProvider";

const customDataProvider: DataProvider = {
    getList: async (resource, params) => {
        if (resource === "warranties") return warrantyProvider.getList(resource, params);
        if (resource === "users") return userProvider.getList(resource, params);
        throw new Error(`Unknown resource: ${resource}`);
    },

    getOne: async (resource, params) => {
        if (resource === "warranties") return warrantyProvider.getOne(resource, params);
        if (resource === "users") return userProvider.getOne(resource, params);
        throw new Error(`Unknown resource: ${resource}`);
    },

    update: async (resource, params) => {
        if (resource === "warranties") return warrantyProvider.update(resource, params);
        if (resource === "users") return userProvider.update(resource, params);
        throw new Error(`Unknown resource: ${resource}`);
    },

    delete: async (resource, params) => {
        if (resource === "warranties") return warrantyProvider.delete(resource, params);
        if (resource === "users") return userProvider.delete(resource, params);
        throw new Error(`Unknown resource: ${resource}`);
    },

    deleteMany: async (resource, params) => { // support deleteMany records of warranties and users
        if (resource === "warranties") return warrantyProvider.deleteMany(resource, params);
        if (resource === "users") return userProvider.deleteMany(resource, params);
        throw new Error(`Unknown resource: ${resource}`);
    },

    // Empty Functions
    getMany: async () => { return { data: [] }; },
    getManyReference: async () => { return { data: [], total: 0 }; },
    updateMany: async () => { return { data: [] }; },
    create: async () => {
        throw new Error("Create is not supported for this resource.");
    },
    
};

export default customDataProvider;