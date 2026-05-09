"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("p50");
  const [quantity, setQuantity] = useState(1);
  const [characterName, setCharacterName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleOrder = async () => {
    const ref = doc(db, "products", selectedProduct);
    const snap = await getDoc(ref);

    const stock = snap.data().stock;

    if (stock < quantity) {
      alert("STOCK HABIS");
      return;
    }

    await updateDoc(ref, {
      stock: stock - quantity
    });

    await addDoc(collection(db, "orders"), {
      name: characterName,
      product: selectedProduct,
      quantity,
      status: "Pending",
      date: new Date().toLocaleString()
    });

    fetchProducts();
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">

      {/* HEADER */}
      <div className="p-6 text-center border-b border-red-900">
        <h1 className="text-5xl font-black text-red-600 tracking-widest">
          REBELLION STORE
        </h1>
        <p className="text-gray-400 mt-2">
          Black Market • GTA RP Weapons Shop
        </p>
      </div>

      {/* STOCK */}
      <div className="grid md:grid-cols-3 gap-4 p-6">
        {products.map(p => (
          <div key={p.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-red-600 transition">
            <h2 className="text-xl font-bold text-red-500 uppercase">{p.id}</h2>
            <p className="mt-2 text-lg">
              Stock: <span className="text-green-400 font-bold">{p.stock}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ORDER BOX */}
      <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">

        <h2 className="text-2xl font-bold text-red-500 mb-4">
          CREATE ORDER
        </h2>

        <input
          placeholder="Character Name"
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          onChange={(e) => setCharacterName(e.target.value)}
        />

        <select
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="p50">P50</option>
          <option value="machine_pistol">Machine Pistol</option>
          <option value="red_vest">Red Vest</option>
        </select>

        <input
          type="number"
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={handleOrder}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-bold tracking-widest"
        >
          PLACE ORDER
        </button>
      </div>

      {/* HISTORY */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          TRANSACTION HISTORY
        </h2>

        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-red-400">{o.product}</p>
                <p className="text-sm text-gray-400">
                  {o.name} • {o.quantity} pcs
                </p>
              </div>

              <span className="text-yellow-400 font-bold">
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
