export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#a67f71] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading payment details...</p>
      </div>
    </div>
  );
}
