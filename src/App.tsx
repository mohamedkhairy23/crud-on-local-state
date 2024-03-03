import { ChangeEvent, FormEvent, useState } from "react";
import ProductCard from "./components/ProductCard";
import Modal from "./components/UI/Modal";
import { categories, colors, formInputsList, productList } from "./data";
import Button from "./components/UI/Button";
import Input from "./components/UI/Input";
import { IProduct } from "./interfaces";
import { productValidation } from "./validation";
import ErrorMessage from "./components/UI/ErrorMessage";
import CircleColor from "./components/UI/CircleColor";
import { v4 as uuid } from "uuid";
import Select from "./components/UI/Select";

const App = () => {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };

  const [products, setProducts] = useState<IProduct[]>(productList);
  const [product, setProduct] = useState<IProduct>(defaultProductObj);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: "",
  });
  const [tempColors, setTempColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  console.log(tempColors);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { title, description, imageURL, price, colors } = product;

    const errors = productValidation({
      title,
      description,
      price,
      imageURL,
      colors,
    });
    console.log(errors);

    // ** Check if any property has a value of "" && Check if all properties have a value of ""
    const hasErrorMessage =
      Object.values(errors).some((value) => value === "") &&
      Object.values(errors).every((value) => value === "");

    if (!hasErrorMessage) {
      setErrors(errors);
      return;
    }

    setProducts((prev) => [
      {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory,
      },
      ...prev,
    ]);

    setProduct(defaultProductObj);
    setTempColors([]);
    closeModal();
  };

  const onCancel = () => {
    setProduct(defaultProductObj);
    closeModal();
  };

  const renderProductList = products.map((product) => (
    <ProductCard product={product} key={product.id} />
  ));

  const renderFormInputList = formInputsList.map((input) => (
    <div className="flex flex-col" key={input.id}>
      <label
        htmlFor={input.id}
        className="mb-[2px] text-sm font-medium text-gray-700"
      >
        {input.label}
      </label>
      <Input
        type={input.type}
        id={input.id}
        name={input.name}
        value={product[input.name]}
        onChange={onChangeHandler}
      />
      <ErrorMessage msg={errors[input.name]} />
    </div>
  ));

  const renderProductColors = colors.map((color) => (
    <CircleColor
      color={color}
      key={color}
      onClick={() => {
        if (tempColors.includes(color)) {
          setTempColors((prev) => prev.filter((item) => item !== color));
        } else {
          setTempColors((prev) => [...prev, color]);
        }
      }}
    />
  ));

  return (
    <main className="container">
      <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={openModal}>
        Add
      </Button>
      <div className="m-5 grid  grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
        {renderProductList}
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal} title="ADD A NEW PRODUCT">
        <form className="space-y-3" onSubmit={submitHandler}>
          {renderFormInputList}

          <Select
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />

          <div className="flex items-center space-x-2">
            {renderProductColors}
          </div>
          <div className="flex items-center space-x-2 flex-wrap">
            {tempColors.map((color) => (
              <>
                <span
                  key={color}
                  className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </span>{" "}
              </>
            ))}{" "}
            {tempColors.length === 0 && <ErrorMessage msg={errors["colors"]} />}
          </div>

          <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              Submit
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-800"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default App;
