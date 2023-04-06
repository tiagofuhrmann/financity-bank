import { User } from "./entities/User";
import { Loan } from "./entities/Loan";

export class App {
    static #users = [];

    static get users() {
        return this.#users;
    }

    static findUser(email) {
        return this.#users.find((user) => user.email == email);
    }

    static newUser(name, email) {
        if (!App.findUser(email)) {
            this.#users.push(new User(name, email));
        }
    }

    static newDeposit(email, value) {
        App.findUser(email).account.newDeposit(value);
    }

    static newTransfer(emailFrom, emailTo, value) {
        App.findUser(emailFrom).account.newTransfer(value, App.findUser(emailTo).account);
    }

    static newLoan(email, value, installments) {
        App.findUser(email).account.newLoan(value, installments);
    }

    static setInterest(newInterest) {
        Loan.interest = newInterest;
    }
}
