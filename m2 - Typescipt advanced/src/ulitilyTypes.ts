//Pick
type Product = {
    id: number;
    name : string;
    price : number;
    stock : number;
    color? : string;
}

type ProductSummary = Pick< Product,'id' | 'name'>; // only include these keys


//Omit
type ProductWithoutStock = Omit< Product, 'color'>
type ProductWithColor = Required<Product> // shob keys thakbe
type OptionalProduct = Partial< Product> // shob keys optional
type ReadOnlyProduct = Readonly<Product>
