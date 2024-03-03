import { IProduct } from "../interfaces";
import { txtSlicer } from "../utils/function";
import Image from "./Image";
import Button from "./UI/Button";
import CircleColor from "./UI/CircleColor";

interface IProps {
  product: IProduct;
}

const ProductCard = ({ product }: IProps) => {
  const { category, colors, description, imageURL, price, title, id } = product;

  const renderProductColors = colors.map((color) => (
    <CircleColor color={color} key={color} />
  ));

  return (
    <div
      className="max-w-sm md:max-w-lg mx-auto border rounded-md p-2 flex flex-col"
      key={id}
    >
      <Image
        imageUrl={imageURL}
        alt={title}
        className="rounded-md h-52 w-full lg:object-cover"
      />
      <h3>{title}</h3>
      <p>{txtSlicer(description)}</p>

      <div className="flex items-center space-x-2">{renderProductColors}</div>

      <div className="flex justify-items-center justify-between">
        <span>${price}</span>
        <Image
          imageUrl={category.imageURL}
          alt={category.name}
          className="w-10 h-10 rounded-full object-bottom"
        />
      </div>
      <div className="flex items-center justify-between space-x-2 mt-5">
        <Button
          className="bg-indigo-700"
          onClick={() => {
            console.log("Clicked");
          }}
          onBlur={() => {}}
        >
          Edit
        </Button>
        <Button className="bg-red-700">Delete</Button>
      </div>
    </div>
  );
};

export default ProductCard;
