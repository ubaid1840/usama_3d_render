"use client";

import { useEffect, useState } from "react";


export default function PaymentSuccess() {
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get("payment_intent");

    if (!paymentIntent) {
      setStatus("Payment intent not found.");
      return;
    }

    fetch("/api/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_intent: paymentIntent }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Payment verification response:", data);

        if (data.verified) {
          setStatus("Payment completed and verified successfully.");
        } else {
          setStatus(`Payment status: ${data.status}`);
        }
      });
  }, []);

  return (
    <div className="payment-box">
      <h1>Payment Success</h1>
      <p>{status}</p>
    </div>
  );
}