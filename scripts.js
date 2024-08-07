// Seleciona os elementos do formulário
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const amount = document.getElementById("amount")
const form = document.querySelector("form")

const expenseList = document.querySelector("aside ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = (event) => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100

  //Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

// Formata valores numéricos para representação de moeda
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  event.preventDefault()

  const { options, selectedIndex } = category

  const newExpense = {
    id: Date.now(),
    expense: expense.value,
    categoryId: category.value,
    categoryName: options[selectedIndex].text,
    amount: amount.value.replace(/[R$ ]/g, ""),
    createdAt: new Date(),
  }

  if(Number(newExpense.amount.replace(",", ".")) <= 0) {
    return alert("O valor da despesa deve ser maior do que 0")
  }

  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  console.log(newExpense.amount)
  try {
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `./img/${newExpense.categoryId}.svg`)
    expenseIcon.setAttribute("alt", `Ícone de ${newExpense.categoryName}`)

    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.categoryName
    
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount}`
    
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "./img/remove.svg")
    removeIcon.setAttribute("alt", "Ícone de remover item")

    expenseInfo.append(expenseName, expenseCategory)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    expenseList.append(expenseItem)

    updateTotals()
    formClear()
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista de despesas.")
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    const items = expenseList.children

    expensesQuantity.textContent = `${items.length} ${items.length !== 1 ? "despesas" : "despesa"}`

    let total = 0

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      value = parseFloat(value)

      if(isNaN(value)) {
        alert("Não foi possível calcular o total. O valor não parece ser um número.")
        total = 0
        break
      }

      total += Number(value)

    }
    
    expensesTotal.innerHTML = `<small>R$</small>${formatCurrencyBRL(total).replace("R$", "")}`

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", (event) => {
  if(event.target.classList.contains("remove-icon")) {

    // Captura o primeiro pai que corresponde ao selector
    const item = event.target.closest(".expense")
    item.remove()

    updateTotals()
  }
})

// Limpa formulário após submit dos dados
function formClear() {
  expense.value = ""  
  category.value = ""
  amount.value = formatCurrencyBRL(0)

  expense.focus()
}
