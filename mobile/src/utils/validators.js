export const validationRules = {
    required: (value) => value ? '' : 'שדה זה הוא חובה.',
    email: (value) => {
        if (!value) return 'אימייל הוא שדה חובה.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'כתובת אימייל לא תקינה.';
    },
    password: (value) => {
        if (!value) return 'סיסמה היא שדה חובה.';
        return value.length >= 6 ? '' : 'הסיסמה חייבת להיות לפחות 6 תווים.';
    },
    date: (value) => value ? '' : 'תאריך הוא שדה חובה.',
    file: (value) => {
        if (!value) return 'חובה להעלות קובץ.';
        // console.log("🔍 File value:", value);
        // console.log("🔍 File type:", value.type);
        // console.log("🔍 File mimeType:", value.mimeType);
    
        const validFileTypes = ['application/pdf']; 
        const isImage = (value.type && value.type.startsWith('image')) || 
                        (value.mimeType && value.mimeType.startsWith('image/')); 
    
        return isImage || validFileTypes.includes(value.type) ? '' : 'סוג קובץ לא נתמך.';
    }

};

// Function to validate fields based on rules
export const validateFields = (fields, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach((field) => {
        const errorMessage = rules[field](fields[field]);
        if (errorMessage) errors[field] = errorMessage;
    });

    return Object.keys(errors).length > 0 ? errors : null;
};

