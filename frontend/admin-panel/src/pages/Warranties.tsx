import { List, Datagrid, TextField, Edit, SimpleForm, SelectInput, TextInput, DateInput} from "react-admin";

export const WarrantiesList = () => (
    <List>
        <Datagrid>
            <TextField source="clientName" />
            <TextField source="productInfo" />
            <TextField source="installationDate" />
            <TextField source="status" />
            <TextField source="installerName" label="Installer Name" />
        </Datagrid>
    </List>
);

export const WarrantiesEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="clientName" label="Client Name" />
            <TextInput source="productInfo" label="Product Info" />
            <DateInput source="installationDate" label="Installation Date" />
            <SelectInput source="status" choices={[
                { id: "Manual Review", name: "Manual Review" },
                { id: "Rejected", name: "Rejected" },
                { id: "Approved", name: "Approved" },
                { id: "Pending", name: "Pending" },
            ]} />
        </SimpleForm>
    </Edit>
);