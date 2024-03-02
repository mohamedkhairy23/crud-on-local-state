import ProductCard from "./components/ProductCard";
import { productList } from "./data";

const App = () => {
  const renderProductList = productList.map((product) => (
    <ProductCard product={product} key={product.id} />
  ));
  return (
    <div>
      <div className="m-5 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2 rounded-md">
        {renderProductList}
      </div>
    </div>
  );
};

export default App;
