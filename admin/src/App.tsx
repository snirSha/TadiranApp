import { Admin ,Resource} from "react-admin";
import { Layout } from "./Layout";
import { UsersList} from './pages/Users';
import { WarrantiesList, WarrantiesEdit} from './pages/Warranties';
import customDataProvider from "./providers/customeDataProvider";
import { authProvider } from "./providers/authProvider";
import { LoginPage } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

const queryClient = new QueryClient();

export const App = () => (
    useEffect(() => {
        console.log("Component Mounted!");

        return () => {
            console.log("Component Unmounted, Cleaning up...");
            localStorage.removeItem("token"); 
        };
    }, []),

    <QueryClientProvider client={queryClient}>
        <BrowserRouter> 
            <Admin layout={Layout} authProvider={authProvider} dataProvider={customDataProvider} loginPage={LoginPage}>
                <Resource name="warranties" list={WarrantiesList} edit={WarrantiesEdit} />
                <Resource name="users" list={UsersList} />
            </Admin>
        </BrowserRouter>

    </QueryClientProvider>
);