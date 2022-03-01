export default function NftCard({
  index,
  nft,
  onClickHandler,
}: {
  index: number
  nft: any
  onClickHandler?: any
}) {
  return (
    <div
      key={index}
      className="flex flex-col overflow-hidden rounded-xl border bg-white shadow hover:scale-105"
    >
      <div className="flex h-full w-full justify-center border-b-2">
        <img
          className="h-[240px] w-full object-contain"
          src={nft.image}
          alt={nft.name}
        />
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-semibold">{nft.name}</h3>
        <p>{nft.description}</p>
      </div>
      <div className="h-full bg-gray-800 p-4">
        <p className="text-2xl font-bold text-white">{nft.price} Matic</p>
        {onClickHandler && (
          <button
            className="w-full rounded bg-gray-700 py-2 px-12 font-bold text-white"
            onClick={() => onClickHandler(nft)}
          >
            Buy
          </button>
        )}
      </div>
    </div>
  )
}
