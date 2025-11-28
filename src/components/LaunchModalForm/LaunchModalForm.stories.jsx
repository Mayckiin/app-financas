import React, { useState } from "react";
import LaunchModalForm from "./LaunchModalForm";
import { TransactionsProvider } from "../../context/TransactionsProvider";

export default {
  title: "Finance/LaunchModalForm",
  component: LaunchModalForm
};

export const Parcelamento = () => {
  const [open, setOpen] = useState(true);

  return (
    <TransactionsProvider useMock={false}>
      <div className="p-10 bg-[var(--bg-900)] min-h-screen">
        <LaunchModalForm
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(payload) => {
            console.log("Payload enviado:", payload);
            alert("Payload gerado (veja o console)");
            setOpen(false);
          }}
        />
        
        {!open && (
          <button 
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded bg-[var(--midnight-gold)] text-black font-semibold"
          >
            Abrir Modal
          </button>
        )}
      </div>
    </TransactionsProvider>
  );
};
