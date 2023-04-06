import "./styles/style.css";
import { App } from "./App";
import { Loan } from "./entities/Loan";
import { Deposit } from "./entities/Deposit";
import { Transfer } from "./entities/Transfer";
import { Modal } from "./dom-entities/Modal";

// * - Deposit:
// *     - Deverá possuir um atributo para o valor e um atributo para a data de criação.
// * - Transfer:
// *     - Deverá possuir atributos para: o usuário que enviou a transferência, o que recebeu a transferência, o valor e a data de criação.
// * - Loan:
// *     - Deverá possuir um atributo estático privado para a taxa de juros e que possuir um getter estático para ler o atributo privado e um setter estático para definir uma nova taxa de juros a partir de uma porcentagem.
// *     - Deverá possuir os atributos para o valor do empréstimo e para a data de criação.
// *    - Também deverá possuir um atributo para as parcelas do empréstimo, sendo que o construtor deve ter como parâmetro o número de parcelas e então deve calcular as parcelas (instâncias de Installments) e armazená-las nesse atributo.
// * - Installment:
// *     - Deve possuir atributos para: o valor da parcela, o número dela e sua situação (paga ou pendente)
// * - Account:
//*     - Deve possuir atributos para: o saldo, todos os depósitos realizados, todos os empréstimos, todas as transferências e para o dono da conta.
// *     - O atributo do saldo deve ser privado e somente de leitura, ou seja, seu valor não pode ser reatribuído, somente podendo ser modificado através dos depósitos, empréstimos e transferências.
// *     - Deve possuir um método para fazer um novo depósito, onde o valor do deposito será acrescentado ao saldo e a instância de Deposit ao atributos array de depósitos.
// *     - Deve possuir um método para fazer um novo empréstimo, que deverá acrescentar o valor do empréstimo ao saldo e salvar a instância de Loan no atributo array de empréstimos.
// *     - Deve possuir um método de fazer uma transferência, onde é verificado se a transferência foi feita para o dono da conta ou pelo dono da conta para outro usuário. Se feito para o dono da conta, o valor dela deve ser acrescentado ao saldo. Se feito pelo dono da conta para outro usuário, o valor dela deve ser descontado do saldo. Além disso, a transferência deve ser salva no atributo array de transferências.
// * - User:
// *     - Deve possuir atributos para nome completo, email e conta.
// * - App:
// *     - Deve possuir um atributo estático privado para a lista dos usuários do app.
// *     - Deve possuir um método estático para criar um novo usuário que só permite criar um usuário por email, ou seja, se o email já estiver sendo usado por outro usuário não deverá ser utilizado novamente.
// *     - Deve possuir um método estático para encontrar um usuário a partir do seu email.
// *     - Deve possuir métodos estáticos para realizar as operações de depósito, transferência e empréstimo. Elas devem ter como parâmetro as informações necessárias, como o email do usuário que está realizando a operação e o valor.
// *     - Deve possuir um método para alterar a taxa dos empréstimos.

App.newUser("Tiago Fuhrmann Martins", "tiago@gmail.com");
App.newUser("George Lucas", "george@gmail.com");
App.newDeposit("tiago@gmail.com", 10000);
App.newTransfer("george@gmail.com", "tiago@gmail.com", 5000);
App.newLoan("tiago@gmail.com", 20000, 36);

Loan.interest = 3;

App.newLoan("george@gmail.com", 20000, 36);

function refreshBalance() {
    document.getElementById("balance").textContent = App.findUser("tiago@gmail.com")
        .account.balance.toFixed(2)
        .replace(/\./, ",");
}

function refreshTransactions() {
    document.getElementById("historyContent").innerHTML = "";
    const transactions = App.findUser("tiago@gmail.com").account.transactions;
    for (let i = transactions.length - 1; i >= 0; i--) {
        const transactionContainer = document.createElement("div");
        transactionContainer.className = "transactionContainer";

        const valueBox = document.createElement("div");
        valueBox.className = "valueBox";

        const value = document.createElement("h3");
        value.innerText = `R$ ${transactions[i].value}`;
        valueBox.appendChild(value);

        const infoBox = document.createElement("div");
        infoBox.className = "infoBox";
        const type = document.createElement("h4");
        const date = document.createElement("h5");
        date.innerText = transactions[i].creationDate.toLocaleDateString("pt-br", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        transactionContainer.append(infoBox, valueBox);

        if (transactions[i] instanceof Deposit) {
            type.innerText = "Depósito";
            date.innerText = transactions[i].creationDate.toLocaleDateString("pt-br", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            });
            infoBox.append(type, date);
        } else if (transactions[i] instanceof Transfer) {
            type.innerText = `Transferência`;
            date.innerText = transactions[i].creationDate.toLocaleDateString("pt-br", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            });
            const transferTo = document.createElement("h5");
            transferTo.innerText = `> ${transactions[i].accountTo.user.name}`;
            infoBox.append(type, transferTo, date);
        } else if (transactions[i] instanceof Loan) {
            type.innerText = "Empréstimo";
            infoBox.append(type, date);
        }

        document.getElementById("historyContent").appendChild(transactionContainer);
    }
}

document.getElementById("modalCloseBtn").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    document.getElementById("modalForm").innerHTML = "";
});

document.getElementById("deposit").addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Novo Depósito";
    const valueInput = document.createElement("input");
    valueInput.id = "modalValueInput";
    valueInput.class = "modalInput";

    document.getElementById("modalForm").appendChild(valueInput);
    document.getElementById("modal").style.display = "block";
    addSubmitEvent("deposit");
});

document.getElementById("transfer").addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Nova Transferência";
    const valueInput = document.createElement("input");
    valueInput.id = "modalValueInput";
    valueInput.class = "modalInput";

    const toInput = document.createElement("input");
    toInput.id = "modalToInput";
    toInput.class = "modalInput";

    document.getElementById("modalForm").append(toInput, valueInput);
    document.getElementById("modal").style.display = "block";
    addSubmitEvent("transfer");
});

function addSubmitEvent(transactionType) {
    if (transactionType === "deposit") {
        document.getElementById("modalFormSubmit").addEventListener("click", function submit() {
            App.newDeposit("tiago@gmail.com", parseFloat(document.getElementById("modalValueInput").value));
            document.getElementById("modalForm").innerHTML = "";
            document.getElementById("modal").style.display = "none";
            refreshTransactions();
            refreshBalance();
            this.removeEventListener("click", submit);
        });
    } else if (transactionType === "transfer") {
        document.getElementById("modalFormSubmit").addEventListener("click", function submit() {
            App.newTransfer(
                "tiago@gmail.com",
                document.getElementById("modalToInput").value,
                document.getElementById("modalValueInput").value
            );
            document.getElementById("modalForm").innerHTML = "";
            document.getElementById("modal").style.display = "none";
            refreshTransactions();
            refreshBalance();
            this.removeEventListener("click", submit);
        });
    }
}

refreshTransactions();
refreshBalance();
