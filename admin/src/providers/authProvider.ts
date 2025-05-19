const apiUrl = import.meta.env.VITE_API_URL;

export const authProvider = {
    
    login: async ({ email, password }: { email: string; password: string }) => {
        console.log("API URL:", apiUrl);
        console.log("Login email:", email, " pass: ", password);
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("Login Response Data:", data);
        if (!data.token) throw new Error("Invalid credentials");

        localStorage.setItem("token", data.token);
        console.log("Saved Token:", localStorage.getItem("token"));
        // Check if the user have the right admin credentials
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        if (!decodedToken.isAdmin) {
            throw new Error("Access denied: Not an admin");
        }
    },
    logout: () => {
        localStorage.removeItem("token");
        return Promise.resolve();
    },
    checkAuth: () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return Promise.reject({ redirectTo: "/login" }); // נותן ל-React Admin לבצע את ההפניה
        }
        return Promise.resolve();

    },
    checkError: (error: { status?: number }) => {//like authGuard in frontend
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("token");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const token = localStorage.getItem("token");
        if (!token) return Promise.reject();
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return Promise.resolve(decodedToken.isAdmin ? "admin" : "user");
    }
};