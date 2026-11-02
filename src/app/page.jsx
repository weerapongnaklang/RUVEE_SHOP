import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main
      id="welcome-page"
      className="flex justify-center items-center h-screen bg-page"
    >
      <div className="text-center">
        <h1 id="welcome-title" className="text-3xl font-bold mb-5">
          Welcome to{" "}
          <Image
            id="welcome-logo"
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
          className="inline-block px-12 py-4 text-on-brand rounded-full bg-cta hover:bg-cta-hover transition duration-300"
          id="shopping-now-button"
        >
          SHOPPING NOW
        </Link>
      </div>
    </main>
  );
}
