import React, { useEffect, useState } from 'react';
import './App.css';
function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState(null);
  const [cart, setCart] = useState({});
  const [myList, setmyList] = useState(true);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://o-complex.com:1337/reviews');
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);
    useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://o-complex.com:1337/products?page=1&page_size=20');
        if (!response.ok) {
          throw new Error(`Network. Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.items);
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoadings(false);
      }
    };
    fetchProducts();
  }, []);
  function toggleWord() {
    setmyList(!myList);
  }
  const handleBuy = (productId) => {
    setCart({ ...cart, [productId]: 1 });
  };
  const handleIncrement = (productId) => {
    setCart({ ...cart, [productId]: cart[productId] + 1 });
  };
  const handleDecrement = (productId) => {
    if (cart[productId] === 1) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart({ ...cart, [productId]: cart[productId] - 1 });
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Тестовое задание</h1>
      </header>
      <section className="review">
        {loading && <p>Загрузка...</p>}
        {error && <p>Ошибка: {error}</p>}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div dangerouslySetInnerHTML={{ __html: review.text }} />
            </div>
          ))
        ) : (
          !loading && <p>Нет отзывов</p>
        )}
      </section>
      <section className='number'>
        <h2>Добавленные товары</h2>
        {Object.keys(cart).length > 0 ? (
          <>
            <ul className='list_number'>
              {Object.entries(cart).map(([id, count]) => {
                const product = products.find(p => p.id === Number(id));
                return (
                  <li key={id}>
                    {product ? product.title : `ID: ${id}`} — {count} шт. × {product ? product.price : '-'} ₽
                  </li>
                );
              })}
            </ul>
            <p className='total'>
              Общее количество: {Object.values(cart).reduce((a, b) => a + b, 0)}
            </p>
            <p className='total'>
              Общая сумма: {
                Object.entries(cart).reduce((sum, [id, count]) => {
                  const product = products.find(p => p.id === Number(id));
                  return sum + (product ? product.price * count : 0);
                }, 0)
              } ₽
            </p>
            <div className='contact'>
              <input
                className='tel'
                type='tel'
                name='tel'
                placeholder='+7 (___)___-__-__'
              />
              <button className='submit_tel'>Заказать</button>
            </div>
          </>
        ) : (
          <p className='empty'>Корзина пуста</p>
        )}
      </section>
      {myList ? <Landing products={products} loadings={loadings} errors={errors} cart={cart} onBuy={handleBuy} onIncrement={handleIncrement} onDecrement={handleDecrement} toggleWord={toggleWord} /> : <Marketing />}
    </div>
  );
}
function Landing({ products, loadings, errors, cart, onBuy, onIncrement, onDecrement }) {
  return (
    <section className="products">
      {loadings && <p>Loading...</p>}
      {errors && <p>Error: {errors}</p>}
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.title}</h3>
              <img src={product.image_url} alt={product.title} style={{ width: '200px' }} />
              <p>{product.description}</p>
              <p>Цена: {product.price} ₽</p>
              {cart[product.id] ? (
                <div className="counter">
                  <button onClick={() => onDecrement(product.id)}>-</button>
                  <span>{cart[product.id]}</span>
                  <button onClick={() => onIncrement(product.id)}>+</button>
                </div>
              ) : (
                <button className='submit_technical' onClick={() => onBuy(product.id)}>Купить</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loadings && <p>Нет товаров</p>
      )}
    </section>
  );
}
function Marketing() {
  return <h1>Marketing</h1>;
}
export default App;


