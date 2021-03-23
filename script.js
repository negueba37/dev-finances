
function open() {
  document.querySelector('.modal-overlay').classList.toggle('active');
}
function close() {
  document.querySelector('.modal-overlay').classList.toggle('active');
}
const Modal = { open, close }
const newTransaction = document.querySelector('.button.new');
const cancel = document.querySelector('.button.cancel')
newTransaction.addEventListener('click', Modal.open);
cancel.addEventListener('click', Modal.close);