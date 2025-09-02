import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main>
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
