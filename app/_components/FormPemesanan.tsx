import { format } from "date-fns";

function FormPemesanan({
  buatPemesanan,
  price_per_two_months,
  startDate,
  endDate,
  months,
  propertiId,
  propertiTitle,
}: {
  buatPemesanan: (formData: FormData) => Promise<void>;
  price_per_two_months: number;
  startDate: Date;
  endDate: Date;
  months: number;
  propertiId: string;
  propertiTitle: string;
}) {
  return (
    <form action={buatPemesanan}>
      <input type="hidden" name="price_per_two_months" value={price_per_two_months} />
      <input type="hidden" name="start_date" value={format(startDate, "yyyy-MM-dd")} />
      <input type="hidden" name="end_date" value={format(endDate, "yyyy-MM-dd")} />
      <input type="hidden" name="num_months" value={months} />
      <input type="hidden" name="properti_id" value={propertiId} />
      <input type="hidden" name="properti_title" value={propertiTitle} />

      <button
        type="submit"
        className="w-full text-2xl bg-[#a67f71] text-white py-3 rounded-xl mt-4 font-semibold hover:opacity-90 transition cursor-pointer"
      >
        Sewa Sekarang
      </button>
    </form>
  );
}

export default FormPemesanan;
