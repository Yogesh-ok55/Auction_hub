"use client"
import React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"

const ProductContext = createContext()

export const useProducts = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  // Simulate fetching products from an API
  useEffect(() => {
    
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://localhost:5000/upload/getProduct"); 
          const data = await response.json();
          console.log(data.products)
          setProducts(data.products);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      };
    
      fetchProducts();

    fetchProducts()
  }, [])

  
  const createListing = async (productData) => {
    if (!currentUser) return false;

    const formData = new FormData();

    // Loop through the properties of productData and append them to FormData
    Object.keys(productData).forEach((key) => {
        if (key !== 'images') {
            formData.append(key, productData[key]);  // Append other fields
        }
    });

    // Handle images (add only the first image from the array)
    if (productData.images) {
        formData.append('image', productData.images);  // Append the first image file
    }

    // Additionally append seller_id
    formData.append('seller_id', currentUser.id);

    console.log(formData)

    try {
        const response = await fetch('http://localhost:5000/upload/productListings', {
            method: 'POST',
            body: formData,  
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        const res= await response.json();
        
        console.log(res.data);
        setProducts((prevProducts) => [...prevProducts, res.data]);

          
        return res.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return false;
    }
  }

  // Place a bid on a product
  const placeBid = (productId, bidAmount) => {
    if (!currentUser) return false

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId && bidAmount > product.currentBid) {
          const newBid = {
            userId: currentUser.id,
            amount: bidAmount,
            time: new Date().toISOString(),
          }

          return {
            ...product,
            currentBid: bidAmount,
            bids: [...product.bids, newBid],
          }
        }
        return product
      }),
    )

    return true
  }

  // Get a single product by ID
  const getProduct = (productId) => {
    return products.find((product) => product.id === productId)
  }

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category)
  }

  // Get products by seller
  const getProductsBySeller = (sellerId) => {
    return products.filter((product) => product.seller === sellerId)
  }

  // Get products user has bid on
  const getBidProducts = (userId) => {
    return products.filter((product) => product.bids.some((bid) => bid.userId === userId))
  }

  const value = {
    products,
    loading,
    createListing,
    placeBid,
    getProduct,
    getProductsByCategory,
    getProductsBySeller,
    getBidProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

