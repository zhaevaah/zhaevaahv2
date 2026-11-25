import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="font-montserrat text-4xl font-bold text-[#1C1208] mb-3">
        404 - Page Not Found
      </h2>
      <p className="font-poppins text-sm text-[#767069] mb-6">
        The luxury jewelry piece or page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#C38B75] text-white text-xs uppercase font-medium tracking-wider rounded-xs hover:bg-[#B07863] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

