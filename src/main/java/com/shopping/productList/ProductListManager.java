package com.shopping.productList;

import com.googlecode.objectify.Key;
import com.shopping.product.ProductDto;
import com.shopping.product.ProductManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductListManager extends ProductListFactory {
    
    private ProductManager productManager = new ProductManager();
    
    public ProductListManager() {
        super();
    }

    public void create(ProductListDto productList) throws ProductListInvalid {
        ProductDto productDB = productManager.get(productList.getIdProduct());
        
        if (productDB == null) {
            throw new ProductListInvalid("product id=" + productList.getIdProduct() + " not exists");
        }
        super.save(productList);
    }
    
    public Map<Key<Object>, ProductListDto> create(Long idList, ProductListDto[] productsList) throws ProductListInvalid {
        List<ProductListDto> products = new ArrayList<ProductListDto>();
        for (ProductListDto productList : productsList) {
                productList.setIdList(idList);
                products.add(productList);
            }
        return super.save(products);
    }
    
    public ProductListDto update(long idProductList, Boolean purchased) throws ProductListInvalid {
        ProductListDto productListDB = super.get(idProductList);
        if (productListDB == null) {
            throw new ProductListInvalid("product id=" + idProductList + " not exists");
        }

        productListDB.setPurchased(purchased);
        super.save(productListDB);

        return productListDB;
    }
    
    

    @Override
    public void delete(long p_id_productList) {
        super.delete(p_id_productList);
    }

    @Override
    public List<ProductListDto> findAll() {
        return super.findAll();
    }

    public List<ProductListDto> findAllByCategory(Long p_idCategory) {
        return super.findByProperty("category", p_idCategory);
    }

    @SuppressWarnings("serial")
    public class ProductListInvalid extends Exception {

        public ProductListInvalid(String msg) {
            super(msg);
        }
    }

}
