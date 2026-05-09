"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status
    });

    fetchOrders();
  };

  const handleLogin = () => {
    if (user === "rebellion" && pass === "admin123") {
      setLogin(true);
    } else {
      alert("Salah login");
    }
  };

  if (!login) {
    return (
      <div>
        <h2>ADMIN LOGIN</h2>

        <input placeholder="username" onChange={(e)=>setUser(e.target.value)} />
        <input placeholder="password" type="password" onChange={(e)=>setPass(e.target.value)} />

        <button onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>ADMIN PANEL</h1>

      {orders.map(o => (
        <div key={o.id}>
          <p>{o.name} - {o.product} - {o.status}</p>

          <button onClick={() => updateStatus(o.id, "Accepted")}>
            Accept
          </button>

          <button onClick={() => updateStatus(o.id, "Rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
