import ProductForm from "@/components/form/ProductForm";
import Layout from "@/components/layout/Layout";

export default function NewProduct() {
    return (
        <Layout>
            <h1 className="ml-8 my-2 flex">New Product</h1>
            <ProductForm />
        </Layout>
    );
}