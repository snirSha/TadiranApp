import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { warrantyProvider } from "./providers/warrantyProvider";
import { UsersList, UsersEdit} from './pages/Users';
import { WarrantiesList, WarrantiesEdit} from './pages/Warranties';
import { authProvider } from "./providers/authProvider";
import { LoginPage } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const App = () => (
    <QueryClientProvider client={queryClient}>
        <Admin layout={Layout} authProvider={authProvider} dataProvider={warrantyProvider} loginPage={LoginPage}>
            <Resource name="warranties" list={WarrantiesList} edit={WarrantiesEdit} />
            <Resource name="users" list={UsersList} edit={UsersEdit} />
        </Admin>
    </QueryClientProvider>


);
