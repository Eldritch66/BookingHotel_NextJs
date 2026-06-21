import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const isSuccess = payment === "success";

  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
          isSuccess ? "bg-green-100" : "bg-[#a67f71]/10"
        }`}
      >
        <CheckCircle2
          size={32}
          className={isSuccess ? "text-green-600" : "text-[#a67f71]"}
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 text-center">
        {isSuccess
          ? "Payment Successful!"
          : "Thank you for your reservation!"}
      </h1>

      <p className="text-gray-500 mt-2 text-center max-w-md">
        {isSuccess
          ? "Your booking has been confirmed. You will receive a confirmation email shortly."
          : "Your booking request has been received. Please complete the payment to confirm your reservation."}
      </p>

      <div className="flex items-center gap-4 mt-8">
        <Link
          href="/account/reservation"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a67f71] text-white font-medium text-sm hover:bg-[#8e6b5f] transition"
        >
          View My Reservations
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
