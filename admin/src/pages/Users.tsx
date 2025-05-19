import { List, Datagrid, TextField /*, EditButton , Edit, SimpleForm, TextInput*/ } from "react-admin";

export const UsersList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            {/* <EditButton /> */}
        </Datagrid>
    </List>
);
//No need to edit users
// export const UsersEdit = () => (
//     <Edit>
//         <SimpleForm>
//             <TextInput source="name" />
//             <TextInput source="email" />
//         </SimpleForm>
//     </Edit>
// );