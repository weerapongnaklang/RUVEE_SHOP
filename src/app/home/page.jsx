import Navbar from "../../components/Navbar";
import CardItem from "../../components/CardItem";
import supabase from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from("catalog_items")
    .select("*")
    .order("id");

  if (error) console.error(error);
console.log("Products fetched:", products?.length ?? 0);
  return (
    <div>
      <Navbar />
      <main className="flex flex-wrap justify-center items-center">
        {(products ?? []).map((item, index) => (
          <CardItem key={item.id} item={item} priority={index < 3} />
        ))}
      </main>
    </div>
  );
}
