import { db } from "@/config/firebase";
import { NoSSR } from "@kwooshung/react-no-ssr";
import { Scanner } from "@yudiel/react-qr-scanner";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const MySwal = withReactContent(Swal)

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
      return modalAlert("EXITO", "El ticket es válido", "success", false);
    } catch (error) {
      return modalAlert("ERROR", "Hubo un error, intente de nuevo", "error", false);
    }
  }

  const scanTicket = async (text, result) => {
    console.log(isScanning)
    if (isScanning===false) {
      const ticket = tickets.find(ticket => ticket.code === text);
      if (ticket) {
        if (ticket.status !== 'USED') {
          await updateTicket({ status: 'USED' }, ticket.id);
        } else {
          modalAlert('QR INVALIDO', 'El QR ya fue escaneado', 'error', false);
        }
      } else {
        modalAlert('EL QR NO EXISTE', 'El ticket no existe en la base de datos', 'error', false);
      }
    }
    setIsScanning(true);
  }

  const modalAlert = async (title, text, icon, isScanning) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsScanning(isScanning);
      }
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
          tracker={false}
        />
      </NoSSR>
      </div>
    </>
  );
}