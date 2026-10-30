import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("URL set:", !!url, "| KEY set:", !!key);

const { data, error } = await createClient(url, key).from("products").select("id");
console.log(error ? `ERROR: ${error.message}` : `OK, ${data.length} rows`);
