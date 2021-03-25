function toggle() {
  document.querySelector('.modal-overlay').classList.toggle('active');
}
const Modal = { open, close, toggle }
const newTransaction = document.querySelector('.button.new');
const cancel = document.querySelector('.button.cancel')
newTransaction.addEventListener('click', Modal.toggle);
cancel.addEventListener('click', Modal.toggle);

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

  }
}
const transactions = [
  {
    description: 'Aluguel',
    amount: 50000,
    date: '23/03/2021'
  },
  {
    description: 'WebSite',
    amount: 5000,
    date: '23/03/2021'
  },
  {
    description: 'Agua',
    amount: -50000,
    date: '23/03/2021'
  },
  {
    description: 'Pensão',
    amount: 5000,
    date: '23/03/2021'
  },
  {
    description: 'Ração',
    amount: -5000,
    date: '23/03/2021'
  },
];
const Transaction = {
  all: Storage.get(),
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr)

  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="Remover Transação">
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
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100;
    return value;
  },

  formatCurrency(value) {

    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value;

  },
  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

}
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    }
  },
  formatValues() {
    let { description, amount, date } = this.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date
    }
  },
  validateFields() {
    const { description, amount, date } = this.getValues();
    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos");
    }

  },
  clearFields() {
    this.description.value = '';
    this.amount.value = '';
    this.date.value = '';

  },
  submit(event) {
    event.preventDefault();
    try {
      this.validateFields();
      const transaction = this.formatValues();
      Transaction.add(transaction);
      this.clearFields();
      Modal.toggle();


    } catch (error) {
      alert(error.message);
    }

  }
}
const App = {
  init() {

    Transaction.all.forEach((item, index) => {
      DOM.addTransaction(item, index);
    });
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  }
}
App.init();
