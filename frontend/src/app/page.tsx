import Navbar from "../components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">

      <Navbar />

      <section className="flex items-center justify-center h-[80vh]">

        <div className="text-center">

          <h1 className="text-7xl font-bold text-cyan-400">
            J.A.R.V.I.S
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            Artificial Intelligence System
          </p>

        </div>

      </section>

    </main>
  );
}