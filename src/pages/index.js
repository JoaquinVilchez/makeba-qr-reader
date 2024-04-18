import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/router';

export default function Home() {
  const auth = getAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const getTickets = async () => {
    const col = collection(db, "tickets");
    const querySnapshot = await getDocs(col);
    const tickets = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    setTickets(tickets);
    setIsLoading(false);
  }

  const getTotalTicketsByType = (type) => {
    return tickets.filter(ticket => ticket.type === type).length;
  }

  const getRemainTicketsByType = (type) => {
    return tickets.filter(ticket => ticket.type === type && ticket.status === 'PENDING').length;
  }

  const submit = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      router.reload();
      return modalAlert("EXITO", "Bienvenido", "success", false);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return modalAlert("ERROR", errorMessage, "error", false);
    });
  }

  const modalAlert = useCallback(async (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Cerrar',
    })
  }, []);

  useEffect(() => {
    getTickets()
  }, [])

  if(isLoading) {
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
              CARGANDO, ESPERE POR FAVOR...
            </div>
          </div>
        </div>
      </>
    )
  } else {
    if (auth.currentUser) {
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
              <Link
                className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 my-3 duration-200"
                href="/scan"
              >
                ESCANEAR
              </Link>
            </div>
  
            <p className="text-center text-xl font-bold mx-5 mb-4">UTILIZAR ESTE SCANNER SÓLO PARA LAS ENTRADAS FÍSICAS</p>
            <div className="text-center">
              <div className="flex flex-col items-center justify-center border border-gray-500 rounded-lg	m-5 p-4">
                <p className="font-bold text-3xl mb-0">GENERAL</p>
  
                <div className="grid grid-cols-2 divide-x my-4">
                  <div className="p-4">
                    <p className="text-xs mb-0">TOTAL</p>
                    <p className="text-4xl font-bold mb-0">
                      {getTotalTicketsByType('GENERAL')}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-0">RESTAN</p>
                    <p className="text-4xl font-bold mb-0">
                      {getRemainTicketsByType('GENERAL')}
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="flex flex-col items-center justify-center border border-gray-500 rounded-lg	m-5 p-4">
                <p className="font-bold text-3xl mb-0">VIP</p>
  
                <div className="grid grid-cols-2 divide-x my-4">
                  <div className="p-4">
                    <p className="text-xs mb-0">TOTAL</p>
                    <p className="text-4xl font-bold mb-0">
                      {getTotalTicketsByType('VIP')}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-0">RESTAN</p>
                    <p className="text-4xl font-bold mb-0">
                      {getRemainTicketsByType('VIP')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="flex flex-col justify-between items-center pb-4 border-gray-900 mb-4">
              <Image
                src="/images/logo_mkbprod.png"
                alt="logo"
                className="w-32 mt-4"
                width={100}
                height={100}
              />
            </div>
          </div>
          <Head>
            <title>Makeba - mkbprod</title>
          </Head>
        </>
      );
    } else if (!auth.currentUser) {
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
              <form className="shadow-md rounded pt-6 pb-8 mb-4 text-center">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    EMAIL
                  </label>
                  <input className="bg-transparent shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" 
                    id="email"
                    type="text"
                    placeholder="Ingresa tu email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    CONTRASEÑA
                  </label>
                  <input className="bg-transparent shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                    id="password" 
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button 
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={submit}
                  >
                    INICIAR SESION
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center pb-4 border-gray-900 mb-4">
            <Image
              src="/images/logo_mkbprod.png"
              alt="logo"
              className="w-32 mt-4"
              width={100}
              height={100}
            />
          </div>
        </div>
          <Head>
            <title>Makeba - mkbprod</title>
          </Head>
        </>
      );
    }
  }
}