const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense-btn");
const expensesList = document.getElementById("expenses");
const getBudgetTipButton = document.getElementById("get-budget-tip");
const budgetTipText = document.getElementById("budget-tip");

let expenses = [];
let editingExpenseId = null;

async function fetchExpenses() {
    try {
        const response = await fetch("http://localhost:3000/expenses");
        if (!response.ok) throw new Error("Failed to fetch expenses");

        expenses = await response.json();
        showExpenses();
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}

function getTotalExpenses() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function showExpenses() {
    expensesList.innerHTML = "";

    if (expenses.length === 0) {
        budgetTipText.textContent = "Add an expense first to get a budgeting tip!";
    }

    expenses.forEach(expense => {
        let li = document.createElement("li");
        li.textContent = `${expense.category}: $${expense.amount}`;

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.onclick = () => editExpense(expense);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => removeExpense(expense.id);

        li.append(editButton, deleteButton);
        expensesList.appendChild(li);
    });
}

function editExpense(expense) {
    expenseCategory.value = expense.category;
    expenseAmount.value = expense.amount;
    addExpenseButton.textContent = "Update Expense";
    editingExpenseId = expense.id;
    changeBackground(expense.category);
}


async function addExpense() {
    let category = expenseCategory.value.trim();
    let amount = parseFloat(expenseAmount.value.trim());

    if (!category || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid category and amount.");
        return;
    }

    let expenseData = { category, amount };

    try {
        const url = editingExpenseId
            ? `http://localhost:3000/expenses/${editingExpenseId}`
            : "http://localhost:3000/expenses";

        const method = editingExpenseId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            await fetchExpenses();
            resetForm();
        } else {
            throw new Error("Failed to save expense");
        }
    } catch (error) {
        console.error("Error saving expense:", error);
    }
}


async function removeExpense(id) {
    try {
        const response = await fetch(`http://localhost:3000/expenses/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            await fetchExpenses();
        } else {
            throw new Error("Failed to delete expense");
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
}


async function getBudgetTip() {
    if (expenses.length === 0) {
        budgetTipText.textContent = "Add an expense first to get a budgeting tip!";
        return;
    }

    const totalSpent = getTotalExpenses();

    if (totalSpent <= 500) {
        budgetTipText.textContent = "You are within your budget.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/budget_tips");
        if (!response.ok) throw new Error("Failed to fetch budget tips");

        const tips = await response.json();
        if (tips.length > 0) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            budgetTipText.textContent = randomTip.tip;
        } else {
            budgetTipText.textContent = "No tips available. Add some in db.json!";
        }
    } catch (error) {
        console.error("Error fetching budget tip:", error);
        budgetTipText.textContent = "Could not fetch tips. Try again later.";
    }
}

function resetForm() {
    expenseCategory.value = "";
    expenseAmount.value = "";
    addExpenseButton.textContent = "Add Expense";
    editingExpenseId = null;
    changeBackground("");
}


document.addEventListener("DOMContentLoaded", function () {
    fetchExpenses();
    changeBackground("");

    document.getElementById("expense-category").addEventListener("change", function () {
        changeBackground(this.value);
    });

    function changeBackground(category) {
        const images = {
            groceries: "images/groceries.jpeg",
            transport: "images/transport.jpg",
            entertainment: "images/ENTERTAINMENT.jpeg",
            shopping: "images/SHOPPING.jpeg",
            bills: "images/bills.png",
            default: "images/background.jpg"
        };

        document.body.style.backgroundImage = `url('${images[category] || images.default}')`;
    }
});

addExpenseButton.addEventListener("click", addExpense);
expenseAmount.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addExpense();
});
getBudgetTipButton.addEventListener("click", getBudgetTip);
