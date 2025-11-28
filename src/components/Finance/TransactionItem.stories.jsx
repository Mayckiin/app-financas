import React from "react";
import TransactionItem from "./TransactionItem";

export default {
  title: "Finance/TransactionItem",
  component: TransactionItem,
};

export const ParcelaUnica = () => (
  <div className="p-6 bg-[var(--bg-900)] max-w-md">
    <TransactionItem
      item={{
        id: "tx1",
        title: "Compra no Mercado",
        purchaser: "Ana",
        category: "Alimentos",
        amount: 200,
        type: "expense",
        createdAt: "2024-02-01",
      }}
      onEdit={() => alert('Editar transação')}
      onDelete={() => alert('Deletar transação')}
    />
  </div>
);

export const ParcelaDeTres = () => (
  <div className="p-6 bg-[var(--bg-900)] max-w-md space-y-3">
    {[1, 2, 3].map((i) => (
      <TransactionItem
        key={i}
        item={{
          id: "tx" + i,
          title: "Notebook",
          purchaser: "Carlos",
          category: "Tecnologia",
          amount: 1233.33,
          type: "expense",
          installmentNumber: i,
          totalInstallments: 3,
          dueDate: "2024-03-" + (10 + i),
          createdAt: "2024-02-01",
        }}
        onEdit={() => alert('Editar parcela ' + i)}
        onDelete={() => alert('Deletar parcela ' + i)}
      />
    ))}
  </div>
);

export const Receita = () => (
  <div className="p-6 bg-[var(--bg-900)] max-w-md">
    <TransactionItem
      item={{
        id: "tx_income",
        title: "Salário",
        purchaser: "Empresa XYZ",
        category: "Receita",
        amount: 5000,
        type: "income",
        createdAt: "2024-02-01",
      }}
      onEdit={() => alert('Editar receita')}
      onDelete={() => alert('Deletar receita')}
    />
  </div>
);
