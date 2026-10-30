import Image from "next/image";

const CardItem = ({ item, priority = false }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4 m-4 w-64 h-80 transition-transform duration-200 ease-in-out hover:scale-105">
      <Image
        src={item.image}
        alt={item.name}
        width={1080}
        height={1350}
        sizes="224px"
        priority={priority}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{item.name}</h2>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <span className="text-lg font-semibold text-red-500">${item.unitPrice}</span>
    </div>
  );
};

export default CardItem;
