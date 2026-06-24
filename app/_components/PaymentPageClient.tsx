"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/app/_lib/currency";
import { format } from "date-fns";
import { simulatePayment } from "@/app/_lib/action";
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Building2,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

const banks = [
  { id: "bca", name: "BCA" },
  { id: "bri", name: "BRI" },
  { id: "bni", name: "BNI" },
  { id: "mandiri", name: "Mandiri" },
  { id: "cimb", name: "CIMB Niaga" },
  { id: "danamon", name: "Danamon" },
  { id: "permata", name: "Permata" },
  { id: "maybank", name: "Maybank" },
  { id: "ocbc", name: "OCBC NISP" },
];

const paymentMethods = [
  {
    id: "qris",
    name: "QRIS",
    description: "Scan QR via GoPay, OVO, DANA, ShopeePay, & lainnya",
    icon: Wallet,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    selectedColor: "ring-primary-1000 border-primary-1000",
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
    id: "virtual_account",
    name: "Virtual Account",
    description: "Bayar melalui transfer ke virtual account bank pilihan",
    icon: Building2,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    selectedColor: "ring-amber-500 border-amber-500",
  },
];

interface RoomProperty {
  title: string;
  city: string;
  province: string;
  property_images: { image_url: string }[];
}

interface PaymentRoomData {
  id: string;
  name: string;
  price_per_night: number;
  properties: RoomProperty;
}

export default function PaymentPageClient({
  room,
  startDate,
  endDate,
  numNights,
  totalPrice,
}: {
  room: PaymentRoomData;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
}) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankOpen, setBankOpen] = useState(false);

  const roomPrice = room.price_per_night;
  const service = 25000;
  const tax = roomPrice * 0.1;
  const subtotal = numNights * roomPrice;
  const computedTotal = subtotal + service + tax;

  const isVaSelected = selectedMethod === "virtual_account";
  const canPay = selectedMethod && (!isVaSelected || selectedBank);

  const getPaymentMethod = () => {
    if (isVaSelected && selectedBank) {
      return `virtual_account_${selectedBank}`;
    }
    return selectedMethod ?? "";
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
            {room.properties.title} &middot; Pending payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Choose Payment Method
              </h2>

              <form action={simulatePayment}>
                <input type="hidden" name="room_id" value={room.id} />
                <input type="hidden" name="start_date" value={startDate} />
                <input type="hidden" name="end_date" value={endDate} />
                <input type="hidden" name="num_nights" value={String(numNights)} />
                <input type="hidden" name="total_price" value={String(totalPrice)} />
                <input
                  type="hidden"
                  name="payment_method"
                  value={getPaymentMethod()}
                />

                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    const Icon = method.icon;
                    const description =
                      method.id === "virtual_account" && selectedBank
                        ? `Pembayaran melalui Virtual Account ${banks.find((b) => b.id === selectedBank)?.name}`
                        : method.description;
                    return (
                      <div key={method.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMethod(method.id);
                            if (method.id !== "virtual_account") {
                              setSelectedBank(null);
                            }
                          }}
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
                              <Icon size={22} className={method.iconColor} />
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
                                {description}
                              </p>
                            </div>
                            <div
                              className={`shrink-0 w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                                isSelected
                                  ? "border-primary-1000"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary-1000" />
                              )}
                            </div>
                          </div>
                        </button>

                        {isSelected && method.id === "virtual_account" && (
                          <div className="mt-3 animate-fade-up w-full">
                            <Dropdown
                              isOpen={bankOpen}
                              onOpenChange={setBankOpen}
                            >
                              <DropdownTrigger>
                                <button
                                  type="button"
                                  className={`w-full flex items-center justify-between rounded-lg px-4 py-2.5 text-sm border-2 transition-all cursor-pointer ${
                                    bankOpen
                                      ? "border-primary-1000 ring-2 ring-primary-1000/10 bg-primary-1000/5"
                                      : "border-gray-300 hover:border-gray-400 bg-white"
                                  }`}
                                >
                                  <span
                                    className={
                                      selectedBank
                                        ? "text-gray-900 font-medium"
                                        : "text-gray-400"
                                    }
                                  >
                                    {selectedBank
                                      ? banks.find((b) => b.id === selectedBank)
                                          ?.name
                                      : "Pilih bank tujuan"}
                                  </span>
                                  <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-300 ${
                                      bankOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </DropdownTrigger>

                              <DropdownMenu
                                selectionMode="single"
                                aria-label="Pilih bank"
                                selectedKeys={
                                  selectedBank
                                    ? new Set([selectedBank])
                                    : new Set()
                                }
                                onSelectionChange={(keys) => {
                                  const value = Array.from(keys)[0];
                                  if (value) {
                                    setSelectedBank(value as string);
                                    setBankOpen(false);
                                  }
                                }}
                                className="p-1.5 rounded-xl border border-gray-200 shadow-lg bg-white w-[280px] sm:w-[400px]"
                              >
                                {banks.map((bank) => {
                                  const isBankSelected =
                                    selectedBank === bank.id;
                                  return (
                                    <DropdownItem
                                      key={bank.id}
                                      className={`rounded-lg text-sm py-2 data-[hover=true]:bg-primary-1000/10 data-[focus=true]:bg-primary-1000/10 ${
                                        isBankSelected ? "bg-primary-1000/10" : ""
                                      }`}
                                      startContent={
                                        <div
                                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            isBankSelected
                                              ? "border-primary-1000"
                                              : "border-gray-300"
                                          }`}
                                        >
                                          {isBankSelected && (
                                            <div className="w-2 h-2 rounded-full bg-primary-1000" />
                                          )}
                                        </div>
                                      }
                                    >
                                      <span
                                        className={
                                          isBankSelected
                                            ? "font-medium text-primary-1000"
                                            : "text-gray-700"
                                        }
                                      >
                                        {bank.name}
                                      </span>
                                    </DropdownItem>
                                  );
                                })}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-4">
                  <Button
                    type="submit"
                    disabled={!canPay}
                    className="w-full h-12 text-base font-semibold bg-[#a67f71] hover:bg-[#8e6b5f] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    Pay {formatRupiah(computedTotal)}
                  </Button>

                  <p className="text-center text-xs text-gray-400">
                    By continuing, you agree to our Terms &amp; Conditions
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Booking Summary
              </h2>

              {room.properties?.property_images?.[0] && (
                <div className="rounded-xl overflow-hidden mb-5 relative h-40">
                  <Image
                    src={room.properties.property_images[0].image_url}
                    alt={room.properties.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {room.properties?.title ?? "Property"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {room.properties?.city}, {room.properties?.province}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-in</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(startDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-out</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nights</span>
                    <span className="font-medium text-gray-900">
                      {numNights}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      {formatRupiah(roomPrice)} &times; {numNights} nights
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
                    <span>{formatRupiah(computedTotal)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    Awaiting payment
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
