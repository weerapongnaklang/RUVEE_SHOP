import '../styles/CardItem.css';

const CardItem = ({ item }) => {
  return (
    <div className="card_item flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4 m-4 w-64 h-80">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{item.name}</h2>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <span className="text-lg font-semibold text-red-500">${item.unitprice}</span>
    </div>
  );
};

export default CardItem;
