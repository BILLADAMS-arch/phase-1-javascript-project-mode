const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense");
const expensesList = document.getElementById("expenses");
const getAiTipButton = document.getElementById("get-ai-tip");
const aiTipText = document.getElementById("ai-tip");

let expenses = [];


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

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            removeExpense(expense.id);
        };

        li.appendChild(deleteButton);
        expensesList.appendChild(li);
    });
}


async function addExpense() {
    let category = expenseCategory.value;
    let amount = parseFloat(expenseAmount.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let newExpense = { category, amount };

    try {
        let response = await fetch("http://localhost:3000/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExpense)
        });

        if (response.ok) {
            fetchExpenses();
        }
    } catch (error) {
        console.error("Error adding expense:", error);
    }

    expenseAmount.value = "";
}


async function removeExpense(id) {
    try {
        let response = await fetch(`http://localhost:3000/expenses/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchExpenses();
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


document.addEventListener("DOMContentLoaded", function () {
    const selectCategory = document.getElementById("expense-category");

    selectCategory.addEventListener("change", function () {
        const selectedValue = selectCategory.value;
        changeBackground(selectedValue);
    });

    function changeBackground(category) {
        let imageUrl = "";

        switch (category) {
            case "groceries":
                imageUrl = "url('images/groceries.jpeg')";
                break;
            case "transport":
                imageUrl = "url('images/transport.jpg')";
                break;
            case "entertainment":
                imageUrl = "url('images/ENTERTAINMENT.jpeg')";
                break;
            case "shopping":
                imageUrl = "url('images/SHOPPING.jpeg')";
                break;
            case "bills":
                imageUrl = "url('images/bills.png')";
                break;
            default:
                imageUrl = "url('images/default.jpg')";
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
document.addEventListener("DOMContentLoaded", fetchExpenses);
