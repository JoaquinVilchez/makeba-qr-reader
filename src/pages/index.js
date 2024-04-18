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

  const getTotalTicketsByType = (type) => {
    return tickets.filter(ticket => ticket.type === type).length;
  }

  const getRemainTicketsByType = (type) => {
    return tickets.filter(ticket => ticket.type === type && ticket.status === 'PENDING').length;
  }

  useEffect(() => {
    getTickets()
  }, [])

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex flex-col justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <img src="/images/logo_makeba.svg" alt="logo" className="w-48" />
          <Link
            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 my-3 duration-200"
            href="/scan"
          >
            ESCANEAR
          </Link>
        </div>

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

            <div class="grid grid-cols-2 divide-x my-4">
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


        <div className="flex flex-col justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <img src="/images/logo_mkbprod.png" alt="logo" className="w-32 mt-4" />
        </div>
      </div>
      <Head>
        <title>Makeba - mkbprod</title>
      </Head>
    </>
  );
}