export class Transfer {
    constructor(accountFrom, accountTo, value) {
        this.accountFrom = accountFrom;
        this.accountTo = accountTo;
        this.value = value;
        this.creationDate = new Date();
    }
}
