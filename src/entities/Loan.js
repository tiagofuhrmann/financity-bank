import { Installment } from "./Installment";

export class Loan {
    static #interest = 0.05;
    constructor(value, installments) {
        this.value = value;
        this.creationDate = new Date();
        this.installments = [];
        this.valueWithInterest = Math.round(value * Math.pow(1 + Loan.#interest, installments));

        for (let i = 1; i <= installments; i++) {
            this.installments.push(new Installment(Math.round(this.valueWithInterest / installments), i));
        }
    }

    static get interest() {
        return Loan.#interest;
    }
    static set interest(percentage) {
        if (percentage > 0) {
            Loan.#interest = percentage / 100;
        }
    }
}
