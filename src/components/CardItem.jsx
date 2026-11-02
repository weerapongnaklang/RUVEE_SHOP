import Image from "next/image";

const CardItem = ({ item, priority = false }) => {
  return (
    <div
      id={`product-card-${item.id}`}
      className="flex flex-col items-center justify-center bg-surface shadow-lg rounded-lg p-4 m-4 w-64 h-80 transition-transform duration-200 ease-in-out hover:scale-105"
    >
      <Image
        id={`product-image-${item.id}`}
        src={item.image}
        alt={item.name}
        width={1080}
        height={1350}
        sizes="224px"
        priority={priority}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 id={`product-name-${item.id}`} className="text-xl font-bold mb-2">
        {item.name}
      </h2>
      <p id={`product-description-${item.id}`} className="text-ink-muted mb-2">
        {item.description}
      </p>
      <span
        id={`product-price-${item.id}`}
        className="text-lg font-semibold text-price"
      >
        ${item.unitPrice}
      </span>
    </div>
  );
};

export default CardItem;
