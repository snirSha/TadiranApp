export const validationRules: Record<string, (value: string | undefined) => string> = {
    required: (value) => value ? '' : 'שדה זה הוא חובה.',
    email: (value) => {
        if (!value) return 'אימייל הוא שדה חובה.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(value)) ? '' : 'כתובת אימייל לא תקינה.'; 
    },
    password: (value) => {
        if (!value || typeof value !== "string") return 'סיסמה היא שדה חובה.';
        return value.length >= 6 ? '' : 'הסיסמה חייבת להיות לפחות 6 תווים.';
    }    
};

// Function to validate fields based on rules
export const validateFields = (
    fields: Record<string, string>,
    rules: Record<string, (value: string) => string>
    ): Record<string, string> | null => {
        const errors: Record<string, string> = {};

        Object.keys(rules).forEach((field) => {
            const errorMessage = rules[field](fields[field]);
            if (errorMessage) errors[field] = errorMessage;
        });

        return Object.keys(errors).length > 0 ? errors : null;
};
