document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.calculator').classList.add('animate__fadeIn');
});

document.getElementById("creditForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById("amount").value);
    const term = parseInt(document.getElementById("term").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const type = document.getElementById("type").value;
    const startDate = new Date(document.getElementById("startDate").value);
    
    const schedule = calculatePayments(amount, term, rate, type, startDate);
    displayResults(schedule);
});

function calculatePayments(amount, term, rate, type, startDate) {
    const monthlyRate = rate / 100 / 12;
    let payments = [];
    
    if (type === "annuity") {
        const annuityPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
        let balance = amount;
        
        for (let i = 1; i <= term; i++) {
            const interest = balance * monthlyRate;
            const principal = annuityPayment - interest;
            balance -= principal;
            
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(paymentDate.getMonth() + i);
            
            payments.push({
                date: paymentDate.toLocaleDateString(),
                principal: principal.toFixed(2),
                interest: interest.toFixed(2)
            });
        }
    } else {
        const principalPayment = amount / term;
        let balance = amount;
        
        for (let i = 1; i <= term; i++) {
            const interest = balance * monthlyRate;
            balance -= principalPayment;
            
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(paymentDate.getMonth() + i);
            
            payments.push({
                date: paymentDate.toLocaleDateString(),
                principal: principalPayment.toFixed(2),
                interest: interest.toFixed(2)
            });
        }
    }
    
    return payments;
}

function displayResults(schedule) {
    const tableBody = document.querySelector("#paymentTable tbody");
    tableBody.innerHTML = "";
    
    let totalPrincipal = 0;
    let totalInterest = 0;
    
    schedule.forEach(payment => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${payment.date}</td>
            <td>${payment.principal}</td>
            <td>${payment.interest}</td>
        `;
        
        tableBody.appendChild(row);
        
        totalPrincipal += parseFloat(payment.principal);
        totalInterest += parseFloat(payment.interest);
    });
    
    const totalPayment = totalPrincipal + totalInterest;
    
    document.getElementById("summary").innerHTML = `
        <p><strong>Загальна сума виплат: ${totalPayment.toFixed(2)} грн</strong></p>
        <p>Тіло кредиту: ${totalPrincipal.toFixed(2)} грн</p>
        <p>Відсотки: ${totalInterest.toFixed(2)} грн</p>
    `;
    
    document.getElementById("message").textContent = "Розрахунок успішно завершено!";
    document.getElementById("result").classList.remove("hidden");

    document.getElementById('result').scrollIntoView({
    behavior: 'smooth'
});
}