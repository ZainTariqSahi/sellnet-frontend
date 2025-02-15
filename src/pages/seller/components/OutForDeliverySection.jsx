import { useDispatch, useSelector } from "react-redux";
import { getSpecificProducts, getCustomers } from "../../../redux/userHandle";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BlueButton, GreenButton } from "../../../utils/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { useNavigate } from "react-router-dom";
import {
  
  
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const CompletedOrderSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentUser,
    specificProductData,
    responseSpecificProducts,
    customersList,
  } = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");



  useEffect(() => {
    dispatch(
      getSpecificProducts(currentUser._id, "getOrderedProductsBySeller")
    );
  }, [dispatch, currentUser._id]);

  useEffect(() => {
    console.log("✅ Specific Customer Data:", customersList);
  }, [customersList]);

  useEffect(() => {
    console.log("📦 Ordered Products API Response:", specificProductData);
  }, [specificProductData]);

   const handleShowCustomers = (productName) => {
    if (!productName) {
      return;
    }

    const customers = specificProductData
      .filter((product) => product.productName === productName)
      .map((product) => product.buyer)
      .filter((buyer, index, self) => buyer && self.findIndex(b => b._id === buyer._id) === index);

    if (customers.length === 0) {
      setCustomerList([]);
    } else {
      setCustomerList(customers);
    }
    
    setSelectedProduct(productName);
    setOpenDialog(true);
  };


  useEffect(() => {
    console.log("📦 Ordered Products API Response:", specificProductData);
  }, [specificProductData]);
  const productsColumns = [
    { id: "name", label: "Product Name", minWidth: 170 },
    { id: "quantity", label: "Product Quantity", minWidth: 100 },
    { id: "category", label: "Product Category", minWidth: 100 },
    { id: "subcategory", label: "Product SubCategory", minWidth: 100 },
  ];

  const productsRows =
    Array.isArray(specificProductData) && specificProductData.length > 0
      ? specificProductData.map((product) => ({
          name: product.productName,
          quantity: product.quantity,
          category: product.category,
          subcategory: product.subcategory,
          id: product.productName,
          productID: product._id,
          buyer: product.buyer?._id || null, // ✅ Ensure buyer ID exists
        }))
      : [];

  const ProductsButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          onClick={() => {
            navigate("/Seller/orders/product/" + row.productID);
          }}
        >
          View Product
        </BlueButton>
        <GreenButton onClick={() => handleShowCustomers(row.name)}>
          Show Customers
        </GreenButton>
      </>
    );
  };

  return (
    <>
      {responseSpecificProducts ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Seller/addproduct")}
          >
            Add Products
          </GreenButton>
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Products List:
          </Typography>

          <TableTemplate
            buttonHaver={ProductsButtonHaver}
            columns={productsColumns}
            rows={productsRows}
          />
        </>
      )}

<Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Customers who purchased {selectedProduct}
          <IconButton 
            aria-label="close" 
            onClick={() => setOpenDialog(false)} 
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {customerList.length > 0 ? (
            <List>
              {customerList.map((buyer, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Name: ${buyer.name}`} secondary={`Email: ${buyer.email}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No customers found for this product.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletedOrderSection;
