export const validationRules = {
    required: (value) => value ? '' : 'שדה זה הוא חובה.',
    email: (value) => {
        if (!value) return 'אימייל הוא שדה חובה.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'כתובת אימייל לא תקינה.';
    },
    date: (value) => value ? '' : 'תאריך הוא שדה חובה.',
    file: (value) => {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        return (!value || validFileTypes.includes(value.type)) ? '' : 'סוג קובץ לא נתמך.';
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

