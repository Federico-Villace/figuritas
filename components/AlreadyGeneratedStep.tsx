"use client";

interface Props {
  figuritas: { seleccion: string; club: string } | null;
}

async function downloadFromUrl(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blobUrl);
}

export default function AlreadyGeneratedStep({ figuritas }: Props) {
  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl space-y-4">
      <div className="text-5xl">⭐</div>
      <h2 className="text-[#008f89] font-black text-xl">¡Ya generaste tus figuritas!</h2>

      {figuritas ? (
        <>
          <p className="text-gray-500 text-sm">
            Podés descargarlas de nuevo durante los próximos días.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => downloadFromUrl(figuritas.seleccion, "figurita-seleccion.png")}
              className="w-full py-2.5 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white transition-all text-sm"
            >
              Descargar Selección
            </button>
            <button
              onClick={() => downloadFromUrl(figuritas.club, "figurita-club.png")}
              className="w-full py-2.5 rounded-xl font-black bg-[#00B5AD] hover:bg-[#008f89] text-white transition-all text-sm"
            >
              Descargar Club
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">
          El período de descarga ya expiró. Si necesitás las imágenes, contactá al organizador del evento.
        </p>
      )}
    </div>
  );
}
