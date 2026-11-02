import Navbar from "../../components/Navbar";

export default function Loading() {
  return (
    <div id="home-loading" aria-busy="true">
      <Navbar />
      <main
        id="product-list-loading"
        role="status"
        aria-label="Loading products"
        className="flex flex-wrap justify-center items-center"
      >
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center bg-surface shadow-lg rounded-lg p-4 m-4 w-64 h-80 animate-pulse"
          >
            <div className="w-full h-40 rounded-lg mb-4 bg-page" />
            <div className="w-3/4 h-6 rounded mb-2 bg-page" />
            <div className="w-1/2 h-4 rounded mb-2 bg-page" />
            <div className="w-1/4 h-5 rounded bg-page" />
          </div>
        ))}
      </main>
    </div>
  );
}
