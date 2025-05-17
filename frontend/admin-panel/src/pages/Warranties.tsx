import { List, Datagrid, TextField, Edit, SimpleForm, SelectInput, TextInput, DateInput, FunctionField } from "react-admin";
import { Button, Typography } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { getDownloadUrl, getHeaders } from "../providers/warrantyProvider";
import { useState } from "react";

const DownloadButtonField = ({ record }: { record?: any }) => {
    if (!record?.invoiceUpload) {
        return null;
    }
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleDownload = async () => {
        console.log("🔍 Trying to fetch download URL for record ID:", record._id);
    
        const downloadUrl = await getDownloadUrl(record._id);
    
        if (!downloadUrl) {
            console.error("Could not retrieve download URL.");
            setErrorMessage("לא ניתן להוריד את הקובץ.");
            setSuccessMessage(null); // 🔄 איפוס הודעת הצלחה במקרה של שגיאה
            return;

        }
    
        console.log(`✅ Fetching file from: ${downloadUrl}`);
    
        const response = await fetch(downloadUrl, {
            method: "GET",
            headers: getHeaders(),
        });
    
        if (!response.ok) {
            console.error(`Error downloading file: ${response.status} ${response.statusText}`);
            if (response.status === 404) {
                setErrorMessage("הקובץ לא נמצא בשרת. אנא בדוק אם הוא הועלה נכון.");
            } else {
                setErrorMessage("שגיאה בעת הורדת הקובץ. נסה שוב.");
            }

            return;
        }
    
        const blob = await response.blob();

        console.log("record.fileName: ",record.fileName);
        const fileName = record.fileName || "warranty_file.jpg"; // שם ברירת מחדל אם לא הצלחנו לשלוף

        console.log(`📂 Saving file as: ${fileName}`);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName); // עכשיו הדפדפן ישתמש בשם הקובץ האמיתי
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setErrorMessage(null);
        setSuccessMessage("✅ הקובץ ירד בהצלחה!"); 
    };

    return (
        <>
            <Button onClick={handleDownload} variant="contained" size="small" startIcon={<CloudDownload />}>
            קובץ אחריות
            </Button>
            {errorMessage && (
                <Typography color="error" variant="body2">
                    {errorMessage}
                </Typography>
            )}
            {successMessage && (
                <Typography color="success" variant="body2">
                    {successMessage}
                </Typography>
            )}
        </>
    );
};

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
            <TextInput source="installerName" label="Installer Name" disabled />
            <FunctionField render={(record) => {
                // console.log("🔍 Record received:", record);
                return <DownloadButtonField record={record} />;
            }} />
        </SimpleForm>
    </Edit>
);