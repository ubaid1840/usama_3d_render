"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import "./dashboard.css"

export default function DashboardPage() {
  const router = useRouter()

  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [authLoading, setAuthLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/portal/login")
        return
      }

      setAuthLoading(false)
    })

    return () => unsubAuth()
  }, [router])

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))

    const unsubOrders = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setOrders(list)
        setOrdersLoading(false)
      },
      () => {
        setOrdersLoading(false)
      }
    )

    return () => unsubOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders

    if (filter === "shipped") {
      return orders.filter((order) => order.deliveryStatus === "shipped")
    }

    return orders.filter((order) => order.orderStatus === "order placed")
  }, [orders, filter])

  const markAsShipped = async (orderId) => {
    setUpdatingId(orderId)

    try {
      await updateDoc(doc(db, "orders", orderId), {
        deliveryStatus: "shipped",
        orderStatus: "shipped",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/portal/login")
  }

  if (authLoading) {
    return <div className="page-loader">Checking authentication...</div>
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Orders Dashboard</h1>
          <p>Manage real-time customer orders from Firebase.</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="stat-card">
          <span>Order Placed</span>
          <strong>
            {orders.filter((o) => o.orderStatus === "order placed").length}
          </strong>
        </div>

        <div className="stat-card">
          <span>Shipped</span>
          <strong>
            {orders.filter((o) => o.deliveryStatus === "shipped").length}
          </strong>
        </div>
      </section>

      <section className="orders-section">
        <div className="orders-toolbar">
          <h2>Orders</h2>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="order placed">Order Placed</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>

        {ordersLoading ? (
          <div className="orders-loader">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">No orders found.</div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Order</th>
                  <th>Delivery</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.customerInfo?.name || "N/A"}</strong>
                      <span>{order.customerInfo?.email || "N/A"}</span>
                      <span>{order.customerInfo?.phone || "N/A"}</span>
                       <span>{order.customerInfo?.address || "N/A"}</span>
                    </td>

                    <td>{order.productName}</td>

                    <td>
                      {order.amount} {order.currency?.toUpperCase()}
                    </td>

                    <td>
                      <span className="badge payment">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span className="badge order">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          order.deliveryStatus === "shipped"
                            ? "badge shipped"
                            : "badge pending"
                        }
                      >
                        {order.deliveryStatus}
                      </span>
                    </td>

                    <td>
                      {order.deliveryStatus === "shipped" ? (
                        <button className="done-btn" disabled>
                          Shipped
                        </button>
                      ) : (
                        <button
                          className="ship-btn"
                          onClick={() => markAsShipped(order.id)}
                          disabled={updatingId === order.id}
                        >
                          {updatingId === order.id
                            ? "Updating..."
                            : "Mark Shipped"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}