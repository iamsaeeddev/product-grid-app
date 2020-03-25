import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "./context/store/storeContext";
import Loader from './components/Loader';

const App = () => {
  const [productsCount, setProductsCount] = useState(1);
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const { state, actions } = useContext(StoreContext);
  
  /* function to compute the days difference */
	const computeDaysDifference = (date) => {
    let date1 = new Date(date); 
    let date2 = new Date(); 
    let difference = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    let result;
    if (difference === 0) {
			result = 'Today'
		}
		if (difference === 1) {
			result = difference + ' day ago'
		}
    if (difference < 7 && difference !== 1 && difference !== 0) {
      result = difference + ' days ago'
    }
    else {
      result = date
    }
    return result
  }

  /* logic to handle infinite scrolling */
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleScroll() {
    if (!actions.generalActions.isLoading && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setIsFetching(true)
      setProductsCount(productsCount=>productsCount+1)
    }
  }

  useEffect(()=>{
    if (state.generalStates.products !== undefined) {
      setProducts(prevState=>prevState.concat(state.generalStates.products))
    }
  },[state.generalStates.products])

  useEffect(() => {
    if (productsCount!==1 && productsCount%2==0)
    {
      let imageIndex = Math.floor(Math.random()*1000)
      fetch(`http://localhost:3000/ads/?r=${imageIndex}`)
        .then(results => setImageUrl(results.url))
    }
  }, [productsCount]);

  useEffect(() => {
    actions.generalActions.setLoading(true)
    actions.generalActions.allProductsAction(productsCount)
  }, [actions.generalActions.products,actions.generalActions.isLoading,productsCount]);

  const sortyByPrice = () => {
    setProducts([])
    actions.generalActions.productsSortAction('price');
  }

  const sortById = () => {
    setProducts([])
    actions.generalActions.productsSortAction('id');
  }

  const sortBySize = () => {
    setProducts([])
    actions.generalActions.productsSortAction('size'); 
  }

  return (
    <div>
      <h2>Products Grid</h2>
Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.
      <br/>
      <button onClick={sortyByPrice}>
        SORT BY PRICE
      </button>
      <button onClick={sortById}>
        SORT BY ID
      </button>
      <button onClick={sortBySize}>
        SORT BY SIZE
      </button>
    
      {products.length > 0 ? products.map((c, index) => (
        <div key={index}>
          <div>
            <h2 style={{fontSize:`${c.size}px`}}>{c.face}</h2>
      			<p>{'$'+c.price}</p>
      			<p>{computeDaysDifference(c.date)}</p>
          </div>
          {productsCount!==1 ? (index%20 === 0 && index!==0) && (imageUrl ? <img className="ad" src={imageUrl}/>: <Loader />):null }
        </div>
      )) : products.length === 500 ? "End of catalogue" : <Loader/> }
    </div>
  );
};

export default App;