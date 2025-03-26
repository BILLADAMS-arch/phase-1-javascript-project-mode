const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense-btn");
const expensesList = document.getElementById("expenses");
const getAiTipButton = document.getElementById("get-ai-tip");
const aiTipText = document.getElementById("ai-tip");

let expenses = [];
let editingExpenseId = 0;

async function fetchExpenses() {
    try {
        let response = await fetch("http://localhost:3000/expenses");
        expenses = await response.json();
        showExpenses();
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}

function showExpenses() {
    expensesList.innerHTML = "";

    expenses.forEach((expense) => {
        let li = document.createElement("li");
        li.textContent = `${expense.category}: $${expense.amount}`;

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.onclick = function () {
            editExpense(expense);
        };

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function () {
            removeExpense(expense.id);
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        expensesList.appendChild(li);
    });
}

function editExpense(expense) {
    expenseCategory.value = expense.category;
    expenseAmount.value = expense.amount;
    addExpenseButton.textContent = "Update Expense";
    editingExpenseId = expense.id;
}

async function addExpense() {
    let category = expenseCategory.value.trim();
    let amount = parseFloat(expenseAmount.value.trim());

    if (!category || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid category and amount.");
        return;
    }

    let newExpense = { category, amount };

    try {
        if (editingExpenseId) {

            newExpense.id = editingExpenseId;

            let response = await fetch(`http://localhost:3000/expenses/${editingExpenseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });

            if (response.ok) {
                await fetchExpenses();
                resetForm();
            }
        } else {
            let response = await fetch("http://localhost:3000/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });

            if (response.ok) {
                await fetchExpenses();
            }
        }
    } catch (error) {
        console.error("Error saving expense:", error);
    }
}

async function removeExpense(id) {
    try {
        let response = await fetch(`http://localhost:3000/expenses/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            await fetchExpenses();
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
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

function resetForm() {
    expenseCategory.value = "groceries";
    expenseAmount.value = "";
    addExpenseButton.textContent = "Add Expense";
    editingExpenseId = null;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchExpenses();

    const selectCategory = document.getElementById("expense-category");
    selectCategory.addEventListener("change", function () {
        changeBackground(selectCategory.value);
    });

    function changeBackground(category) {
        let imageUrl = "";
        switch (category) {
            case "groceries": imageUrl = "url('images/groceries.jpeg')"; break;
            case "transport": imageUrl = "url('images/transport.jpg')"; break;
            case "entertainment": imageUrl = "url('images/ENTERTAINMENT.jpeg')"; break;
            case "shopping": imageUrl = "url('images/SHOPPING.jpeg')"; break;
            case "bills": imageUrl = "url('images/bills.png')"; break;
            default: imageUrl = "url('images/default.jpg')";
        }
        document.body.style.backgroundImage = imageUrl;
    }
});


addExpenseButton.addEventListener("click", addExpense);
expenseAmount.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addExpense();
    }
});
getAiTipButton.addEventListener("click", getAiBudgetTip);
