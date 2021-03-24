function toggle() {
  document.querySelector('.modal-overlay').classList.toggle('active');
}
const Modal = { open, close, toggle }
const newTransaction = document.querySelector('.button.new');
const cancel = document.querySelector('.button.cancel')
newTransaction.addEventListener('click', Modal.toggle);
cancel.addEventListener('click', Modal.toggle);

const transactions = [
  {
    id: 1,
    description: 'Aluguel',
    amount: 50000,
    date: '23/03/2021'
  },
  {
    id: 2,
    description: 'WebSite',
    amount: 5000,
    date: '23/03/2021'
  },
  {
    id: 3,
    description: 'Agua',
    amount: -50000,
    date: '23/03/2021'
  },
  {
    id: 4,
    description: 'Pensão',
    amount: 5000,
    date: '23/03/2021'
  },
  {
    id: 5,
    description: 'Ração',
    amount: -5000,
    date: '23/03/2021'
  },
];
const Transaction = {
  all: transactions,
  add(transaction) {
    this.all.push(transaction);
    App.reload();
  },
  remove(index) {
    this.all.splice(index, 1);
    App.reload();
  },
  incomes() {
    let income = 0;
    this.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    })
    return income;
  },
  expenses() {
    let expense = 0;
    this.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    })
    return expense;
  },
  total() {
    return this.incomes() + this.expenses();
  }
}
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index) {

    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    DOM.transactionsContainer.appendChild(tr)

  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img src="./assets/minus.svg" alt="Remover Transação">
    </td>
    `;
    return html;
  },
  updateBalance() {
    document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },
  clearTransactions() {
    this.transactionsContainer.innerHTML = '';
  }
}
const Utils = {
  formatCurrency(value) {

    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value;

  }
}
const Form = {
  submit(event) {
    console.log(event);
    event.preventDefault();
  }
}
const App = {
  init() {

    Transaction.all.forEach((item) => {
      DOM.addTransaction(item);
    });
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  }
}
App.init();
