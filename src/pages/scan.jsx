import { db } from "@/config/firebase";
import { Scanner } from "@yudiel/react-qr-scanner";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [tickets, setTickets] = useState([]);

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
      return console.log("Document successfully updated");
    } catch (error) {
      return console.error("Error updating document: ", error);
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
        return console.log('Ticket already used')
      }
      return console.log('Ticket not found')
    })
  }

  useEffect(() => {
    getTickets()
  }, [])

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <Scanner
          onResult={(text, result) => scanTicket(text, result)}
          onError={(error) => console.log(error?.message)}
        />
      </div>
    </>
  );
}