import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [tickets, setTickets] = useState([]);

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
  }

  useEffect(() => {
    getTickets()
  }, [])

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Tickets</h1>
          <Link
            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
            href="/scan"
          >
            Escanear
          </Link>
        </div>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id} className="py-2 flex justify-between w-full">
              <span>
                <strong>{ticket.code}</strong> - {ticket.status}
              </span>
              <span className="flex gap-2">
                <Link className="text-blue-700 underline hover:no-underline" href={`/${ticket.id}/edit`}>Editar</Link>
                <Link className="text-red-500 underline hover:no-underline" href={`/${ticket.id}/delete`}>Eliminar</Link>
              </span>
            </li>
          ))}
          {tickets?.length < 1 && <div className="py-2">No data</div>}
        </ul>
      </div>
      <Head>
        <title>Tickets</title>
      </Head>
    </>
  );
}