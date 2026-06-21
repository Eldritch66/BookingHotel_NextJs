import { getBookingWithDetails } from "@/app/_lib/data-services";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import PaymentPageClient from "@/app/_components/PaymentPageClient";

export const metadata = {
  title: "Payment",
};

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const booking = await getBookingWithDetails(bookingId);

  if (!booking) redirect("/account/reservation");

  if (booking.guest_id !== guest.guest_id) {
    redirect("/account/reservation");
  }

  const payment = booking.payments?.[0] ?? null;

  if (payment?.status === "berhasil") {
    redirect("/account/thankyou?payment=success");
  }

  return <PaymentPageClient booking={booking} payment={payment} />;
}
