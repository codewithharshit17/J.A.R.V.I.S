"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-cyan-400">
          J.A.R.V.I.S
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          {message}
        </p>

      </div>

    </main>
  );
}