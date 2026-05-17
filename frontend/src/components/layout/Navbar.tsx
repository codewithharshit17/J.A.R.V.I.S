export default function Navbar() {
  return (
    <nav className="w-full h-16 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-6">

      <h1 className="text-2xl font-bold tracking-widest text-cyan-400">
        J.A.R.V.I.S
      </h1>

      <div className="flex items-center gap-3">

        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

        <p className="text-sm text-gray-400">
          SYSTEM ONLINE
        </p>

      </div>

    </nav>
  );
}