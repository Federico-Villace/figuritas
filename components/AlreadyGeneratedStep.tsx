"use client";

export default function AlreadyGeneratedStep() {
  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl space-y-4">
      <div className="text-5xl">⭐</div>
      <h2 className="text-[#008f89] font-black text-xl">¡Ya generaste tus figuritas!</h2>
      <p className="text-gray-500 text-sm">
        Cada persona puede generar sus figuritas una sola vez. Si perdiste los archivos,
        contactá al organizador del evento.
      </p>
    </div>
  );
}
