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
import { ProductNameTypes } from "./types";
import toast, { Toaster } from "react-hot-toast";

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
  const [productToEdit, setProductToEdit] =
    useState<IProduct>(defaultProductObj);
  console.log(productToEdit);
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0);
  console.log(productToEditIdx);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
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
  const closeEditModal = () => setIsOpenEditModal(false);
  const openEditModal = () => setIsOpenEditModal(true);
  const closeConfirmModal = () => setIsOpenConfirmModal(false);
  const openConfirmModal = () => setIsOpenConfirmModal(true);

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

  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProductToEdit({
      ...productToEdit,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { title, description, imageURL, price } = product;

    const errors = productValidation({
      title,
      description,
      price,
      imageURL,
      colors: tempColors,
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
    toast.success("Product has been added", {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };

  const submitEditHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { title, description, imageURL, price } = productToEdit;
    const errors = productValidation({
      title,
      description,
      price,
      imageURL,
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

    const updatedProducts = [...products];
    updatedProducts[productToEditIdx] = {
      ...productToEdit,
      colors: tempColors.concat(productToEdit.colors),
    };
    setProducts(updatedProducts);

    setProductToEdit(defaultProductObj);
    setTempColors([]);
    closeEditModal();

    toast.success("Product has been edited", {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };

  const removeProductHandler = () => {
    // console.log(`You want to delete product ${productToEdit.id}`);
    const filtered = products.filter(
      (product) => product.id !== productToEdit.id
    );
    setProducts(filtered);
    closeConfirmModal();
    toast.success("Product has been deleted", {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  };

  const onCancel = () => {
    setProduct(defaultProductObj);
    setTempColors([]);
    closeModal();
  };

  const renderProductList = products.map((product, idx) => (
    <ProductCard
      product={product}
      key={product.id}
      setProductToEdit={setProductToEdit}
      openEditModal={openEditModal}
      openConfirmModal={openConfirmModal}
      idx={idx}
      setProductToEditIdx={setProductToEditIdx}
    />
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
          return;
        }
        if (productToEdit.colors.includes(color)) {
          setTempColors((prev) => prev.filter((item) => item !== color));
          return;
        }
        setTempColors((prev) => [...prev, color]);
      }}
    />
  ));

  const renderProducEditWithErrorMsg = (
    id: string,
    label: string,
    name: ProductNameTypes
  ) => {
    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="mb-[2px] text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <Input
          type="text"
          id={id}
          name={name}
          value={productToEdit[name]}
          onChange={onChangeEditHandler}
        />
        <ErrorMessage msg={errors[name]} />
      </div>
    );
  };

  return (
    <main className="container">
      <Button
        className="block bg-indigo-700 hover:bg-indigo-800 mx-auto my-10 px-10 font-medium"
        onClick={openModal}
        width="w-fit"
      >
        Add Product
      </Button>
      <div className="m-5 grid  grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
        {renderProductList}
      </div>

      <Modal
        isOpen={isOpenEditModal}
        closeModal={closeEditModal}
        title="EDIT PRODUCT"
      >
        <form className="space-y-3" onSubmit={submitEditHandler}>
          {renderProducEditWithErrorMsg("title", "Product Title", "title")}
          {renderProducEditWithErrorMsg(
            "description",
            "Product Description",
            "description"
          )}
          {renderProducEditWithErrorMsg(
            "imageURL",
            "Product Title",
            "imageURL"
          )}
          {renderProducEditWithErrorMsg("price", "Product Price", "price")}

          <Select
            selected={productToEdit.category}
            setSelected={(value) =>
              setProductToEdit({ ...productToEdit, category: value })
            }
          />

          <div className="flex items-center space-x-2">
            {renderProductColors}
          </div>
          <div className="flex items-center space-x-2 flex-wrap">
            {tempColors.concat(productToEdit.colors).map((color) => (
              <>
                <span
                  key={color}
                  className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </span>{" "}
              </>
            ))}
            {tempColors.length === 0 && <ErrorMessage msg={errors["colors"]} />}
          </div>

          <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              Submit
            </Button>
            <Button
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

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
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete prod confirm modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button
            className="bg-[#c2344d] hover:bg-red-800"
            onClick={removeProductHandler}
          >
            Yes, remove
          </Button>
          <Button
            type="button"
            className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
            onClick={closeConfirmModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <Toaster />
    </main>
  );
};

export default App;
