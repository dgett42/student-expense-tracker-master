# Student Expense Tracker – Option A 

This is a React Native + Expo Student Expense Tracker application that stores expenses locally using SQLite.  
For the final assignment (Option A), the project was enhanced by adding a dynamic pie chart that visualizes spending by category using real app data.

The pie chart updates automatically whenever expenses are added, deleted, edited, or filtered.  
This completes the requirement to integrate a meaningful chart connected to real application state.


###  Core App Features
- Add expenses with:
  - Amount  
  - Category  
  - Optional note  
- Edit existing expenses  
- Delete expenses  
- Data saved locally using SQLite  
- Filter expenses by:
  - All Expenses  
  - This Week  
  - This Month  

###  Added Feature for Final Project (Option A)
- Category Pie Chart built with:
  - react-native-chart-kit  
  - react-native-svg  
- Displays total spending per category  
- Automatically updates when:
  - Expenses change  
  - Filters change  
- Clean, dark-themed UI consistent with the rest of the app  


##  Installation & Setup

Install dependencies:

bash:
npm install

## Run the app:

bash:
npx expo start


Open the Expo Go app on your device or emulator.


## Project Structure 


/App.js  
/ExpenseScreen.js  
/CategoryPieChart.js   ← Added in Option A  
/package.json  


SQLite is initialized on first run and stored locally.


#  GitHub Copilot Reflection

## How I used GitHub Copilot

I used GitHub Copilot throughout the development of the new CategoryPieChart component.  
I often began by writing comments such as:


// Create a pie chart that shows spending by category


Copilot then provided:

- A starter layout for the component  
- Suggested PieChart configuration  
- A basic data transformation structure  
- Styling templates  

I adjusted these suggestions to properly map the real byCategory data and match the app’s theme.

I also used Copilot to speed up repetitive work such as styles, mapping, and JSX layout.


## A Copilot suggestion I rejected

Copilot suggested using **hard-coded dummy data**:


const data = [
  { name: "Food", amount: 200 },
  { name: "Gas", amount: 50 }
];


I rejected this because the assignment requires using **real** data.

Instead:

- `getAnalytics(filteredExpenses)` computes real totals  
- `CategoryPieChart` transforms those values for the chart  

This ensured accurate, real-time updates and compliance with the assignment.


## A Copilot suggestion that saved me time

The biggest time-saver was Copilot auto-generating chart configuration.  
When typing:


<PieChart


Copilot filled in:

- width / height  
- accessor="amount"  
- backgroundColor="transparent"  
- chartConfig with color functions  

This saved lookup time and sped up development.


## ✅ Final Notes

This project now includes:

- A meaningful, dynamic chart  
- Real data integration  
- Improved visualization of spending analytics  


