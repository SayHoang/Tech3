import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout Components
import HeaderMain from "./components/HeaderMain";
import Footer from "./components/Footer";

// Page Components (main UI pages)
import HomePage from "./pages/HomePage";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <HeaderMain />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
