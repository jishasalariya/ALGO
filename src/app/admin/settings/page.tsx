export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Store Settings</h2>

      <div className="bg-[#111] border border-white/10 rounded-xl p-8 space-y-8">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3">Store Name</label>
          <input type="text" defaultValue="KYU? Streetwear" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors" />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3">Admin Email Contact</label>
          <input type="email" defaultValue="algowear.co@gmail.com" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3">Shipping Flat Rate (₹)</label>
          <input type="number" defaultValue="50" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors" />
        </div>

        <button className="bg-white text-black px-6 py-3 rounded uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
