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
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleOrder = async () => {
    const productRef = doc(db, "products", selectedProduct);
    const productSnap = await getDoc(productRef);

    const stock = productSnap.data().stock;

    if (stock < quantity) {
      alert("Stock habis");
      return;
    }

    await updateDoc(productRef, {
      stock: stock - quantity
    });

    await addDoc(collection(db, "orders"), {
      name: characterName,
      product: selectedProduct,
      quantity,
      status: "Pending",
      date: new Date().toLocaleString()
    });

    alert("Order sukses!");
    fetchProducts();
    fetchOrders();
  };

  return (
    <div style={{ padding: 20, background: "#000", color: "#fff" }}>
      <h1>REBELLION STORE</h1>

      <h2>STOCK</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.id} : {p.stock}
        </div>
      ))}

      <h2>ORDER</h2>

      <input
        placeholder="Nama Character"
        onChange={(e) => setCharacterName(e.target.value)}
      />

      <select onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="p50">P50</option>
        <option value="machine_pistol">Machine Pistol</option>
        <option value="red_vest">Red Vest</option>
      </select>

      <input
        type="number"
        onChange={(e) => setQuantity(Number(e.target.value))}
        value={quantity}
      />

      <button onClick={handleOrder}>
        ORDER
      </button>

      <h2>HISTORY</h2>
      {orders.map(o => (
        <div key={o.id}>
          {o.name} - {o.product} - {o.quantity} - {o.status}
        </div>
      ))}
    </div>
  );
}
