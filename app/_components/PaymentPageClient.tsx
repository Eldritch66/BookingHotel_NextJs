"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingWithPayment, Payment } from "@/app/_lib/type";
import { formatRupiah } from "@/app/_lib/currency";
import { format } from "date-fns";
import { simulatePayment } from "@/app/_lib/action";
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const paymentMethods = [
  {
    id: "qris",
    name: "QRIS",
    description: "Scan QR via GoPay, OVO, DANA, ShopeePay, & lainnya",
    icon: Wallet,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    selectedColor: "ring-indigo-500 border-indigo-500",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Bayar dengan akun PayPal Anda",
    icon: CreditCard,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    selectedColor: "ring-blue-500 border-blue-500",
  },
  {
    id: "bank_transfer",
    name: "Kartu Bank (BCA)",
    description: "Debit / Kredit BCA, Virtual Account BCA",
    icon: Building2,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    selectedColor: "ring-amber-500 border-amber-500",
  },
];

export default function PaymentPageClient({
  booking,
  payment,
}: {
  booking: BookingWithPayment;
  payment: Payment | null;
}) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const roomPrice = booking.rooms?.price_per_night ?? 0;
  const service = 25000;
  const tax = roomPrice * 0.1;
  const subtotal = booking.num_nights * roomPrice;
  const total = subtotal + service + tax;

  const handlePay = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    try {
      await simulatePayment(booking.id, selectedMethod);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Complete Your Payment
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Booking #{booking.id.slice(0, 8)} &middot;{" "}
            {payment?.status === "berhasil"
              ? "Already paid"
              : "Pending payment"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Choose Payment Method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${method.color} ${method.selectedColor} ring-2`
                          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}
                        >
                          <Icon
                            size={22}
                            className={method.iconColor}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {method.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2
                                size={18}
                                className="text-green-500 shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`shrink-0 w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                            isSelected
                              ? "border-indigo-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={handlePay}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full h-12 text-base font-semibold bg-[#a67f71] hover:bg-[#8e6b5f] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay ${formatRupiah(total)}`}
                </Button>

                <p className="text-center text-xs text-gray-400">
                  By continuing, you agree to our Terms &amp; Conditions
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Booking Summary
              </h2>

              {booking.rooms?.properties?.property_images?.[0] && (
                <div className="rounded-xl overflow-hidden mb-5">
                  <img
                    src={
                      booking.rooms.properties.property_images[0].image_url
                    }
                    alt={booking.rooms.properties.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.rooms?.properties?.title ?? "Property"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {booking.rooms?.properties?.city},{" "}
                    {booking.rooms?.properties?.province}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="font-medium text-gray-900">
                      {booking.num_guests}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      {formatRupiah(roomPrice)} &times; {booking.num_nights}{" "}
                      nights
                    </span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service fee</span>
                    <span>{formatRupiah(service)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (10%)</span>
                    <span>{formatRupiah(tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-base">
                    <span>Total</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      payment?.status === "berhasil"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        payment?.status === "berhasil"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    {payment?.status === "berhasil"
                      ? "Paid"
                      : "Awaiting payment"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
