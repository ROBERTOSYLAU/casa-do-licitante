import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="contato"
      className="bg-black/20 backdrop-blur-md border-t border-white/20 py-12 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tighter">
                CASA DO LICITANTE
              </span>
            </div>
            <p className="text-white/80">Sua empresa no melhor lugar.</p>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">
              Plataforma
            </span>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#funcionalidades" className="hover:text-white transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-white transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <a href="/ferramentas" className="hover:text-white transition-colors">
                  Ferramentas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">
              Empresa
            </span>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">
              Suporte
            </span>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60">
            © {new Date().getFullYear()} Casa do Licitante. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
