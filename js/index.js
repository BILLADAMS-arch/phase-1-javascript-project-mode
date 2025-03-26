const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense");
const expensesList = document.getElementById("expenses");
const getAiTipButton = document.getElementById("get-ai-tip");
const aiTipText = document.getElementById("ai-tip");

let expenses = [];

function showExpenses() {
    expensesList.innerHTML = "";

    expenses.forEach((expense, index) => {
        let li = document.createElement("li");
        li.textContent = `${expense.category}: $${expense.amount}`;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
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

function removeExpense(index) {
    expenses.splice(index, 1);
    showExpenses();
}

function getAiBudgetTip() {
    const tips = [
        "Track all your expenses daily.",
        "Set a monthly spending limit.",
        "Save at least 20% of your income.",
        "Avoid impulse buying.",
        "Use cash instead of credit cards to control spending."
    ];

    const randomIndex = Math.floor(Math.random() * tips.length);
    aiTipText.textContent = tips[randomIndex];
}

addExpenseButton.addEventListener("click", addExpense);

expenseAmount.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addExpense();
    }
});

getAiTipButton.addEventListener("click", getAiBudgetTip);
