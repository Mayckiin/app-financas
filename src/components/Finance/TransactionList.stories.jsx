import React from "react";
import TransactionList from "./TransactionList";
import { TransactionsProvider } from "../../context/TransactionsProvider";

export default {
  title: "Finance/TransactionList",
  component: TransactionList,
};

export const ComFiltroComprador = () => (
  <TransactionsProvider useMock={false}>
    <div className="p-10 bg-[var(--bg-900)] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[var(--gold-soft)]">Lista de Transações</h2>
      <TransactionList />
    </div>
  </TransactionsProvider>
);

export const ListaVazia = () => (
  <TransactionsProvider useMock={false}>
    <div className="p-10 bg-[var(--bg-900)] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[var(--gold-soft)]">Lista Vazia</h2>
      <TransactionList />
    </div>
  </TransactionsProvider>
);
