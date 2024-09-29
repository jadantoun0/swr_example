import { Product } from "@/types/Product";

  let products: Product[] = [];
  let idCounter = 1;

  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
  
    if (id) {
      const product = products.find((product) => product.id === parseInt(id));
      if (product) {
        return new Response(JSON.stringify(product), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
      }
    }
    return new Response(JSON.stringify(products), { status: 200 });
  }
  
  export async function POST(request: Request) {
    const body = await request.json();
    const newProduct: Product = { id: idCounter++, ...body };
    products.push(newProduct);
    return new Response(JSON.stringify(newProduct), { status: 201 });
  }
  
  export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') ?? '0');
    const body = await request.json();
    const index = products.findIndex((product) => product.id === id);
  
    if (index !== -1) {
      products[index] = { ...products[index], ...body };
      return new Response(JSON.stringify(products[index]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
  }
  
  export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') ?? '0');
  
    const initialLength = products.length;
    products = products.filter((product) => product.id !== id);
  
    if (products.length < initialLength) {
      return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
  }
  