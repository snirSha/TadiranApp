import { useLogin } from "react-admin";
import { useState } from "react";
import { validationRules, validateFields } from "../utils/validators";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

export const LoginPage = () => {
    const login = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({});
    
        const formData = { email, password };
        const rules = { email: validationRules.email, password: validationRules.password };
    
        const newErrors = validateFields(formData, rules);
        
        if (newErrors) {
            setErrors(newErrors); 
            return;
        }
    
        login({ email, password })
            .then(() => setErrors({})) 
            .catch((error) => {
                setErrors({});
                
                if (error.message.includes("Access denied")) {
                    setErrors({ general: "המשתמש אינו אדמין" });
                } else {
                    setErrors({ general: "התחברות נכשלה, בדוק את הפרטים" });
                }
            });
    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300, mx: "auto", mt: 5 }}
        >
            <Typography variant="h5" align="center">
                התחברות למערכת
            </Typography>

            <TextField
                label="אימייל"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? <span style={{ display: "block", textAlign: "center" }}>{errors.email}</span> : ""}
                fullWidth
            />

            <TextField
                label="סיסמה"
                type={passwordVisible ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password ? <span style={{ display: "block", textAlign: "center" }}>{errors.password}</span> : ""}
                fullWidth
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setPasswordVisible(!passwordVisible)} edge="end">
                                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            {errors.general && (
                <Typography color="error" sx={{ display: "flex", justifyContent: "center", textAlign: "center", mt: 2 }}>
                {errors.general}
            </Typography>
        
            )}

            <Button type="submit" variant="contained" color="primary">
                התחבר
            </Button>
        </Box>
    );
};