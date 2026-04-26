export function Footer() {
  return (
    <footer className="py-10 bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">UC</span>
          </div>
          <span className="font-medium text-slate-300">UCAR Intelligence</span>
        </div>
        <p className="text-slate-500">© {new Date().getFullYear()} Université de Carthage. Tous droits réservés.</p>
        <div className="flex items-center gap-4">
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <span className="text-slate-700">·</span>
          <a href="/login" className="hover:text-white transition-colors">Connexion</a>
          <span className="text-slate-700">·</span>
          <span className="text-slate-600">Hack4UCAR 2025</span>
        </div>
      </div>
    </footer>
  )
}
