// Add this utility function to convert numbers to words
const numberToWords = (num: number): string => {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const convertToWords = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertToWords(n % 100) : "");
    if (n < 100000) return convertToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convertToWords(n % 1000) : "");
    if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convertToWords(n % 100000) : "");
    return convertToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convertToWords(n % 10000000) : "");
  };
  
  if (num === 0) return "Zero";
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let words = convertToWords(rupees) + " Rupee" + (rupees !== 1 ? "s" : "");
  
  if (paise > 0) {
    words += " and " + convertToWords(paise) + " Paise";
  }
  
  return words;
};

// Format total amount in Indian format with commas
const formatIndianCurrency = (amount: number): string => {
  const parts = amount.toFixed(2).split(".");
  const rupees = parts[0];
  const paise = parts[1];
  
  // Format rupees in Indian numbering system
  const lastThree = rupees.slice(-3);
  const otherNumbers = rupees.slice(0, -3);
  const formattedRupees = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + 
    (otherNumbers ? "," : "") + lastThree;
  
  return `₹${formattedRupees}.${paise}`;
};

export { numberToWords, formatIndianCurrency };