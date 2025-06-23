import { DurationResult } from '../models/DurationResult';

export const calculateMonthsAndDays = (
  startDate: Date | null,
  endDate?: Date | null
): DurationResult => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  // Calculate the number of full months
  let monthsDifference =
    end.getMonth() -
    start.getMonth() +
    12 * (end.getFullYear() - start.getFullYear());

  // Calculate the remaining days, including the end date
  let daysDifference;
  if (end.getDate() >= start.getDate()) {
    // If the end day is greater than or equal to the start day, simply subtract and add 1 (to include the end date)
    daysDifference = end.getDate() - start.getDate() + 1;
  } else {
    // If the end day is less than the start day, adjust the months and calculate days
    monthsDifference--;
    // Get the last day of the previous month
    const tempDate = new Date(end.getFullYear(), end.getMonth(), 0);
    daysDifference = end.getDate() + (tempDate.getDate() - start.getDate()) + 1;
  }

  return {
    totalMonths: monthsDifference,
    days: daysDifference,
  };
};

// Updated rounding function to fix Test Case 2, 15, and 19
const roundMonthsAndDays = (
  months: number,
  days: number,
  waiveOneDayInterest: boolean = false
): DurationResult => {
  // console.log(months, days);
  // console.log('waiveInterest', waiveOneDayInterest)
  const daysStartRange = waiveOneDayInterest ? 2 : 1;
  if (months === 0 && days > 1) {
    // If months is 0 and days > 1, round to 1 month and 0 days
    return { totalMonths: 1, days: 0 };
  } else if (months > 0) {
    if (days >= daysStartRange && days <= 15) {
      // If days are between 1 and 15, round to 15 days
      return { totalMonths: months, days: 15 };
    } else if (days > 15) {
      // If days are greater than 15, round to 0 days and add 1 month
      return { totalMonths: months + 1, days: 0 };
    }
  }
  // Default case (no rounding needed)
  return { totalMonths: months, days: days === 1 ? 0 : days };
};

// Updated function to calculate and round months and days
export const calculateRoundedMonthsAndDays = (
  startDate: Date | null,
  endDate: Date | null,
  waiveOneDayInterest?: boolean
): DurationResult => {
  // Calculate the raw months and days
  const rawResult = calculateMonthsAndDays(startDate, endDate);

  // Round the result based on the conditions
  return roundMonthsAndDays(
    rawResult.totalMonths,
    rawResult.days,
    waiveOneDayInterest
  );
};

// Test cases
// const testCalculateRoundedMonthsAndDays = () => {
//     const testCases = [
//         { start: '2025-01-01', end: '2025-02-05', expected: { totalMonths: 1, days: 15 } },
//         { start: '2025-01-01', end: '2025-02-16', expected: { totalMonths: 2, days: 0 } },
//         { start: '2025-02-01', end: '2025-02-09', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-01-01', end: '2024-02-15', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-02-15', end: '2024-02-28', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-02-15', end: '2024-03-15', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-02-15', end: '2024-03-20', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-02-01', end: '2024-02-28', expected: { totalMonths: 1, days: 0 } },
//         { start: '2025-02-14', end: '2025-03-19', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-03-01', end: '2024-03-31', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-03-15', end: '2024-03-31', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-02-28', end: '2024-03-31', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-01-31', end: '2024-02-28', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-01-01', end: '2024-03-15', expected: { totalMonths: 2, days: 15 } },
//         { start: '2024-01-15', end: '2024-03-30', expected: { totalMonths: 3, days: 0 } },
//         { start: '2024-02-01', end: '2024-02-29', expected: { totalMonths: 1, days: 0 } },
//         { start: '2024-12-15', end: '2025-01-20', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-12-01', end: '2025-01-15', expected: { totalMonths: 1, days: 15 } },
//         { start: '2024-02-10', end: '2024-03-25', expected: { totalMonths: 2, days: 0 } },
//         { start: '2024-02-20', end: '2024-03-05', expected: { totalMonths: 1, days: 0 } }
//     ];

//     testCases.forEach((testCase, index) => {
//         const startDate = new Date(testCase.start);
//         const endDate = new Date(testCase.end);
//         const result = calculateRoundedMonthsAndDays(startDate, endDate);
//         const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
//         console.log(`Test Case ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
//         console.log(`  Input: ${testCase.start} to ${testCase.end}`);
//         console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
//         console.log(`  Result: ${JSON.stringify(result)}`);
//         console.log('----------------------------------------');
//     });
// }

// Run the test cases
// testCalculateRoundedMonthsAndDays();
