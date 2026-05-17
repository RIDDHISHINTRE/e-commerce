import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Package, 
  DollarSign, 
  FileText, 
  Layers, 
  Image as ImageIcon,
  Activity,
  FolderPlus,
  Loader2,
  Trash2
} from "lucide-react";

const SAMPLE_PRODUCTS = [
  {
    name: "Ceramic Matte Coffee Mug",
    price: 850,
    description: "Handcrafted stoneware mug with a tactile matte finish. Holds 350ml of your favorite pour-over brew.",
    stock: 12,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Organic Waffle Knit Blanket",
    price: 3400,
    description: "Soft, breathable organic cotton knitted throw with subtle textures. Perfect for cozying up your sofa or desk.",
    stock: 5,
    image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Acoustic Wood Desk Stand",
    price: 4900,
    description: "Elevate your audio and desk aesthetic with this solid oak hardwood stand, handcrafted with natural oils.",
    stock: 3,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Nordic Minimalist Desk Clock",
    price: 1800,
    description: "Silent quartz movement clock in a sleek circular birchwood frame. Brings a serene touch to any wall or desk.",
    stock: 0,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Natural Soy Moss & Cedar Candle",
    price: 1200,
    description: "A calming scent of rich cedar, forest moss, and clean musk, hand-poured in a beautiful amber apothecary jar.",
    stock: 25,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Vegan Leather Journal Cover",
    price: 1500,
    description: "Re-fillable premium journal sleeve made from water-resistant vegan leather. Includes an elegant elastic clasp.",
    stock: 8,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600"
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [sessionOrders, setSessionOrders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [successBuyId, setSuccessBuyId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: ""
  });

  // LOAD PRODUCTS FROM DATABASE
  const loadProducts = () => {
    axios.get("/api/products")
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Error loading products:", err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // HANDLE FORM INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD SINGLE PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill in all required fields (Name, Price, Stock)");
      return;
    }

    try {
      // Fallback placeholder image if none provided
      const finalImage = form.image.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";
      
      await axios.post("/api/products", {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        stock: Number(form.stock),
        image: finalImage
      });

      setForm({ name: "", price: "", description: "", stock: "", image: "" });
      setIsFormOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    }
  };

  // BUY PRODUCT
  const buyProduct = async (id) => {
    setBuyingId(id);
    try {
      const res = await axios.post(`/api/orders/buy/${id}`);
      
      // Flash success state for button
      setSuccessBuyId(id);
      setTimeout(() => {
        setSuccessBuyId(null);
      }, 2000);

      // Track order in local session log
      if (res.data && res.data.order) {
        setSessionOrders(prev => [res.data.order, ...prev]);
      }
      
      // Re-fetch products to reflect potential stock changes if the backend supported it,
      // or at least refresh local display.
      loadProducts();
    } catch (err) {
      console.error("Error buying product:", err);
      alert("Error placing order. Please try again.");
    } finally {
      setBuyingId(null);
    }
  };

  // SEED SAMPLE PRODUCTS TO DATABASE
  const seedProducts = async () => {
    setIsSeeding(true);
    try {
      for (const product of SAMPLE_PRODUCTS) {
        await axios.post("/api/products", product);
      }
      loadProducts();
    } catch (err) {
      console.error("Error seeding database:", err);
      alert("Error seeding some products. Please ensure the backend is running.");
    } finally {
      setIsSeeding(false);
    }
  };

  // HELPER TO RENDER STOCK BADGE
  const renderStockBadge = (stock) => {
    if (stock <= 0) {
      return <span className="badge badge-out">Sold Out</span>;
    } else if (stock <= 5) {
      return <span className="badge badge-low">Only {stock} Left</span>;
    } else {
      return <span className="badge badge-in">{stock} in stock</span>;
    }
  };

  return (
    <div className="app-layout">
      {/* HEADER NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          <div className="logo-group">
            <div className="logo-icon">
              <ShoppingBag size={20} />
            </div>
            <span className="logo-text">Atelier</span>
          </div>

          <div className="nav-actions">
            <button 
              className={`btn btn-secondary ${isFormOpen ? "active" : ""}`}
              onClick={() => setIsFormOpen(!isFormOpen)}
            >
              <Plus size={16} />
              <span>List Product</span>
            </button>

            {products.length === 0 && (
              <button 
                className="btn btn-seed"
                onClick={seedProducts}
                disabled={isSeeding}
              >
                {isSeeding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span>{isSeeding ? "Seeding..." : "Quick-Seed Shop"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="main-content">
        
        {/* ADD PRODUCT COLLAPSIBLE FORM */}
        {isFormOpen && (
          <section className="form-section">
            <div className="section-header">
              <h2>
                <FolderPlus size={18} />
                <span>List a New Product</span>
              </h2>
              <p>Add a beautiful new item to your boutique collection.</p>
            </div>

            <form onSubmit={addProduct} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <div className="input-wrapper">
                    <FileText className="input-icon" size={16} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Linen Throw Pillow"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹) *</label>
                  <div className="input-wrapper">
                    <DollarSign className="input-icon" size={16} />
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="e.g. 1200"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Available Stock *</label>
                  <div className="input-wrapper">
                    <Layers className="input-icon" size={16} />
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="e.g. 10"
                      value={form.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group form-fullwidth">
                  <label htmlFor="image">Image URL</label>
                  <div className="input-wrapper">
                    <ImageIcon className="input-icon" size={16} />
                    <input
                      id="image"
                      name="image"
                      type="url"
                      placeholder="https://images.unsplash.com/... or blank for default"
                      value={form.image}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group form-fullwidth">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Describe the crafted quality, dimensions, materials..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-tertiary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Item
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PRODUCTS SECTION */}
        <section className="catalog-section">
          <div className="catalog-header">
            <div>
              <span className="subtitle">Curated Collection</span>
              <h1 className="catalog-title">Shop Our Essentials</h1>
            </div>

            {products.length > 0 && products.length < 10 && (
              <button 
                className="btn btn-seed-small" 
                onClick={seedProducts}
                disabled={isSeeding}
              >
                <Sparkles size={14} />
                <span>{isSeeding ? "Seeding..." : "Quick-Seed Samples"}</span>
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-graphic">
                <Package size={48} />
              </div>
              <h3>No products found</h3>
              <p>Your beautiful storefront is currently empty. Get started by seeding mock products or manually listing your own.</p>
              <div className="empty-actions">
                <button 
                  className="btn btn-primary"
                  onClick={seedProducts}
                  disabled={isSeeding}
                >
                  {isSeeding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  <span>{isSeeding ? "Seeding Essentials..." : "Seed Curated Essentials"}</span>
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsFormOpen(true)}
                >
                  <Plus size={16} />
                  <span>List New Product</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => {
                const isBuying = buyingId === product._id;
                const isSuccess = successBuyId === product._id;
                const isOutOfStock = product.stock <= 0;

                return (
                  <article key={product._id} className="card">
                    <div className="card-media">
                      <img 
                        src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"} 
                        alt={product.name}
                        loading="lazy"
                      />
                      <div className="card-badge">
                        {renderStockBadge(product.stock)}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-meta">
                        <h3 className="card-name">{product.name}</h3>
                        <p className="card-price">₹{product.price.toLocaleString("en-IN")}</p>
                      </div>
                      
                      <p className="card-description">
                        {product.description || "No description provided for this minimalist essential."}
                      </p>

                      <button
                        className={`btn ${
                          isSuccess 
                            ? "btn-buy-success" 
                            : isOutOfStock 
                            ? "btn-buy-disabled" 
                            : "btn-buy-now"
                        }`}
                        onClick={() => buyProduct(product._id)}
                        disabled={isBuying || isOutOfStock || isSuccess}
                      >
                        {isBuying ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Order Placed!</span>
                          </>
                        ) : isOutOfStock ? (
                          <span>Out of Stock</span>
                        ) : (
                          <span>Buy Now</span>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* RECENT SESSION ACTIVITY */}
        {sessionOrders.length > 0 && (
          <section className="activity-section animate-fade-in">
            <div className="activity-header">
              <Activity size={18} className="activity-pulse" />
              <h2>Recent Session Purchases</h2>
            </div>
            
            <div className="activity-list">
              {sessionOrders.map((order, idx) => (
                <div key={order._id || idx} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-details">
                    <p className="activity-text">
                      Successfully purchased <strong>{order.productName}</strong>
                    </p>
                    <span className="activity-time">
                      Total: ₹{order.totalPrice.toLocaleString("en-IN")} • {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Atelier. Crafted with soft minimalism & subtle aesthetics.</p>
      </footer>
    </div>
  );
}