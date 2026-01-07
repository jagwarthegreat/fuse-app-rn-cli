export const emailvalidation = (value) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.)?edu\.sg$/;
    return emailRegex.test(value);
  };