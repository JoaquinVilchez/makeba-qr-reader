import { db } from "@/config/firebase";
import { NoSSR } from "@kwooshung/react-no-ssr";
import { Scanner } from "@yudiel/react-qr-scanner";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import swal from 'sweetalert';


export default function Home() {
  const [tickets, setTickets] = useState([]);

  const onError = (error) => {
    return swal("ERROR", error, "error");
  }
  const getTickets = async () => {
    const col = collection(db, "tickets");
    const snapshot = await getDocs(col);
    setTickets(snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }));
  }

  const updateTicket = async (data, id) => {
    const ticketRef = doc(db, "tickets", id);
    try {
      await updateDoc(ticketRef, {
        ...data
      });
      getTickets()
      return swal("EXITO", "El ticket es válido", "success");
    } catch (error) {
      return swal("ERROR", "Hubo un error, intente de nuevo", "error");
    }
  }

  const scanTicket = async (text, result) => {
    tickets.map(async ticket => {
      if (ticket.code === text) {
        if(ticket.status != 'USED') {
          return await updateTicket({
            status: 'USED'
          }, ticket.id);
        }
        return swal("QR INVALIDO", "El QR ya fue escaneado", "error");
      }
      return swal("EL QR NO EXISTE", "El ticket no existe en la base de datos", "error");
    })
  }
  
  useEffect(() => {
    getTickets()
  }, [])

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
      <NoSSR>
        <Scanner
          onResult={(text, result) => scanTicket(text, result)}
          onError={(error) => onError(error?.message)}
        />
      </NoSSR>
      </div>
    </>
  );
}