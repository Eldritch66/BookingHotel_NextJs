import Link from "next/link";
import { auth } from "@/app/_lib/auth";
import { getGuest, getBookingWithDetails } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import { formatRupiah } from "@/app/_lib/currency";
import { format } from "date-fns";
import { CheckCircle2, ArrowRight, CreditCard, Banknote } from "lucide-react";

function formatPaymentMethod(method: string) {
  if (method === "qris") return "QRIS";
  if (method === "paypal") return "PayPal";
  if (method.startsWith("virtual_account_")) {
    const bank = method.replace("virtual_account_", "").toUpperCase();
    return `Virtual Account ${bank}`;
  }
  return method;
}

function PaymentIcon({ method }: { method: string }) {
  if (method === "qris") return <CreditCard size={20} />;
  if (method === "paypal") return <CreditCard size={20} />;
  if (method.startsWith("virtual_account_")) return <Banknote size={20} />;
  return <CreditCard size={20} />;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const { booking_id } = await searchParams;
  if (!booking_id) redirect("/account");

  const booking = await getBookingWithDetails(booking_id);
  if (!booking || booking.guest_id !== guest.guest_id) redirect("/account");

  const payment = booking.payments?.[0];
  const room = booking.rooms;
  const property = room?.properties;

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">
            Your booking has been confirmed. You will receive a confirmation
            email shortly.
          </p>
        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-primary-1000/10 flex items-center justify-center text-primary-1000">
              <PaymentIcon method={payment?.payment_method ?? ""} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-900">
                {formatPaymentMethod(payment?.payment_method ?? "")}
              </p>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-gray-900 font-medium">
              {payment?.transaction_id}
            </span>
          </div>

          {payment?.paid_at && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Paid at</span>
              <span className="text-gray-900 font-medium">
                {format(new Date(payment.paid_at), "MMM dd, yyyy HH:mm")}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-mono text-gray-900 font-medium text-xs">
              {booking.id}
            </span>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-3">
          {property && (
            <div>
              <p className="font-medium text-gray-900">{property.title}</p>
              <p className="text-xs text-gray-500">
                {property.city}, {property.province}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Check-in</span>
              <span className="font-medium text-gray-900">
                {format(new Date(booking.start_date), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-out</span>
              <span className="font-medium text-gray-900">
                {format(new Date(booking.end_date), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nights</span>
              <span className="font-medium text-gray-900">
                {booking.num_nights}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-semibold text-gray-900">
            <span>Total Paid</span>
            <span>{formatRupiah(payment?.amount ?? booking.total_price)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 justify-center">
          <Link
            href="/account/reservation"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a67f71] text-white font-medium text-sm hover:bg-[#8e6b5f] transition"
          >
            View My Reservations
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
