import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Star, Shirt, Zap, Heart } from 'lucide-react';
import { brandSlogan, brandMission } from '../mock';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo grande */}
            <div className="mb-8 flex justify-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_fb4260be-c858-4e2d-91a5-ab7091220c34/artifacts/mf6s52k4_Logo%20nuevo.png" 
                alt="Air Logo" 
                className="h-24 w-auto animate-fade-in hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Eslogan principal */}
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-800 via-emerald-700 to-slate-800 bg-clip-text text-transparent">
                {brandSlogan}
              </span>
            </h1>
            
            {/* Descripción */}
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {brandMission}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/productos">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  Explorar Productos
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué elegir Air?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Descubre lo que hace especial a nuestra marca y por qué miles de clientes confían en nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-slate-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shirt className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Calidad Premium</h3>
                <p className="text-slate-600 leading-relaxed">
                  Materiales de la más alta calidad seleccionados cuidadosamente para garantizar durabilidad y comfort.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-slate-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Diseño Innovador</h3>
                <p className="text-slate-600 leading-relaxed">
                  Diseños únicos que combinan funcionalidad y estilo para que te sientas cómodo y elegante.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-slate-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Hecho con Amor</h3>
                <p className="text-slate-600 leading-relaxed">
                  Cada prenda es creada con pasión y dedicación para brindarte la mejor experiencia posible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explora nuestra colección completa de prendas diseñadas para cada momento de tu día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <Link to="/productos?category=pantalon">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 h-64 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Pantalones</h3>
                    <p className="text-emerald-100">Comodidad y estilo</p>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer">
              <Link to="/productos?category=sueter">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 h-64 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Suéteres</h3>
                    <p className="text-slate-100">Calidez y elegancia</p>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer">
              <Link to="/productos?category=medias">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 h-64 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Medias</h3>
                    <p className="text-blue-100">Soporte y confort</p>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_fb4260be-c858-4e2d-91a5-ab7091220c34/artifacts/lrzjfwl3_Logo%20nuevo%20blanco.png" 
              alt="Air Logo" 
              className="h-12 w-auto mx-auto mb-4"
            />
            <p className="text-slate-400 mb-4">{brandSlogan}</p>
            <p className="text-slate-500 text-sm">© 2025 Air. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;