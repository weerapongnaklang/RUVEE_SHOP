"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5">
          Welcome to{" "}
          <img
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            className="inline w-24"
          />
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="px-12 py-4 text-white rounded-full bg-[#ae2019] hover:bg-[#9b1c1c] transition duration-300"
        >
          SHOPPING NOW
        </button>
      </div>
    </div>
  );
}
