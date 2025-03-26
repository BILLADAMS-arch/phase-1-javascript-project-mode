const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense");
const expensesList = document.getElementById("expenses");
let expenses = [];

function showExpenses() {
    expensesList.innerHTML = "";

    expenses.forEach((expense, index) => {
        let li = document.createElement("li");
        li.textContent = `${expense.category}: $${expense.amount}`;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.onclick = function () {
            removeExpense(index);
        };

        li.appendChild(deleteButton);
        expensesList.appendChild(li);
    });
}
function addExpense() {
    let category = expenseCategory.value;
    let amount = parseFloat(expenseAmount.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    expenses.push({ category, amount });
    showExpenses();
    expenseAmount.value = "";
}