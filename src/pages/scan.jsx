import { db } from "@/config/firebase";
import { NoSSR } from "@kwooshung/react-no-ssr";
import { Scanner } from "@yudiel/react-qr-scanner";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const MySwal = withReactContent(Swal)
  const auth = getAuth();

  const onError = (error) => {
    return modalAlert("ERROR", error, "error", false);
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
    if(auth.currentUser) {
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
  }

  const scan = useCallback(async (text) => {
    if(auth.currentUser) {
      if (isScanning) return;
      const ticket = tickets.find(({ code }) => code === text);
      if (!ticket) {
        return modalAlert('EL QR NO EXISTE', 'El ticket no existe en la base de datos', 'error', false);
      }
      if (ticket.status !== 'USED') {
        await updateTicket({ status: 'USED' }, ticket.id);
      } else {
        modalAlert('QR INVALIDO', 'El QR ya fue escaneado', 'error', false);
      }
      setIsScanning(true);
    }
  }, [isScanning, tickets]);

  const modalAlert = useCallback(async (title, text, icon, isScanning) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsScanning(isScanning);
      }
    });
  }, []);

  useEffect(() => {
    getTickets()
  }, [])

  
  if (auth.currentUser) {
    return (
      <>
        <div className="container mx-auto mt-8 max-w-[560px]">
        <NoSSR>
          <Scanner
            onResult={(text, result) => scan(text)}
            onError={(error) => onError(error?.message)}
            tracker={false}
          />
        </NoSSR>
        </div>
        <div className="flex flex-col justify-between items-center pb-4 mb-4">
          <Link
            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 my-3 duration-200"
            href="/"
          >
            VOLVER
          </Link>
        </div>
  
        <div className="flex flex-col justify-between items-center pb-4 mb-4">
          <Image
            src="/images/logo_mkbprod.png"
            alt="logo"
            className="w-32 mt-4"
            width={100}
            height={100}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container mx-auto mt-8 max-w-[560px]">
          <div className="flex flex-col justify-between items-center pb-4 border-gray-900 mb-4">
            <Image
              src="/images/logo_makeba.svg"
              alt="logo"
              className="w-48"
              width={100}
              height={100}
            />
            <div className="text-center">
              NO TIENES ACCESO A ESTA PAGINA
            </div>
            <div className="flex flex-col justify-between items-center pb-4 mb-4">
            <Link
              className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 my-3 duration-200"
              href="/"
            >
              VOLVER A INICIO
            </Link>
          </div>
          </div>
        </div>
      </>
    )
  }
}