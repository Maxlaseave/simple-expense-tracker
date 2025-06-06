const balanceEl = document.getElementById('balance');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

transactionForm.addEventListener("submit", addTransaction); 

function addTransaction(e) {
   e.preventDefault(); 

   //get form values

   const description = descriptionInput.value.trim();
   const amount = parseFloat(amountInput.value);

   transactions.push({
        id:Date.now(),
        description,
        amount
   })

   localStorage.setItem('transactions', JSON.stringify(transactions));

   updateTransactionList();
   updateSummary();

   transactionForm.reset(); // Clear the form inputs
}

function updateTransactionList() {
    transactionList.innerHTML = '';

    const sortedTransaction = [...transactions].reverse();
    sortedTransaction.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionList.appendChild(transactionEl);
    })
}

function createTransactionElement(transaction) {
    const li = document.createElement('li');
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? 'income' : 'expense');

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>
        ${formatCurrency(transaction.amount)}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `

    return li;
}

function updateSummary() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount ,0)
    
    const income = transactions.filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions.filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    //update the UI
    balanceEl.textContent = formatCurrency(balance);
    incomeAmount.textContent = formatCurrency(income);
    expenseAmount.textContent = formatCurrency(expenses);
}


function formatCurrency(number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(number);
    
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

// Initial call to update the UI
updateSummary();
updateTransactionList();

