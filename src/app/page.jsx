import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5">
          Welcome to{" "}
          <Image
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            width={375}
            height={104}
            priority
            className="inline w-24 h-auto"
          />
        </h1>
        <Link
          href="/home"
          className="inline-block px-12 py-4 text-white rounded-full bg-[#ae2019] hover:bg-[#9b1c1c] transition duration-300"
        >
          SHOPPING NOW
        </Link>
      </div>
    </main>
  );
}
