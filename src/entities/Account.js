import { Deposit } from "./Deposit";
import { Loan } from "./Loan";
import { Transfer } from "./Transfer";

export class Account {
    #balance = undefined;
    constructor(user) {
        this.#balance = 0;
        this.transactions = [];
        this.user = user;
    }

    get balance() {
        return this.#balance;
    }

    set balance(newBalance) {
        this.#balance = newBalance;
    }

    newDeposit(value) {
        this.#balance += value;
        this.transactions.push(new Deposit(value));
    }

    newLoan(value, installments) {
        this.#balance += value;
        this.transactions.push(new Loan(value, installments));
    }

    newTransfer(value, accountTo) {
        this.#balance -= value;
        accountTo.balance += value;
        accountTo.transactions.push(new Transfer(this, accountTo, value));
        this.transactions.push(new Transfer(this, accountTo, value));
    }
}
