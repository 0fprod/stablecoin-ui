export const getDetails = (errorMessage: string) => {
  const detailsSection = errorMessage.split('Details: ')[1];
  if (detailsSection) {
    return detailsSection.split('\n')[0];
  } else {
    return '';
  }
};