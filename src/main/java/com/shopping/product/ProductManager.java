package com.shopping.product;

import com.igzcode.java.util.StringUtil;
import java.util.List;

public class ProductManager extends ProductFactory {

    public ProductManager() {
        super();
    }

    public void create(ProductDto product) throws ProductInvalid, ProductDuplicated {
        this.validateProduct(product);
        super.save(product);
    }

    public ProductDto update(long idProduct, String nameProduct) throws ProductInvalid, ProductDuplicated {

        ProductDto productDB = super.get(idProduct);
        if (productDB == null) {
            throw new ProductInvalid("app id=" + idProduct + " not exists");
        }

        productDB.setNameProduct(nameProduct);
        this.validateProduct(productDB);
        super.save(productDB);

        return productDB;
    }

    @Override
    public void delete(long p_id_product) {
        super.delete(p_id_product);
    }

    private void validateProduct(ProductDto product) throws ProductInvalid, ProductDuplicated {
        this.checkNullOrDuplicated("nameProduct", product.getNameProduct(), product.getIdProduct());
    }

    private void checkNullOrDuplicated(String field, String value, Long idProduct) throws ProductInvalid, ProductDuplicated {
        if (StringUtil.isNullOrEmpty(value)) {
            throw new ProductInvalid("required:" + field);
        }

        ProductDto productDB = super.getByProperty(field, value);
        if (productDB != null) {
            if (idProduct == null || !idProduct.equals(productDB.getIdProduct())) {
                throw new ProductDuplicated("duplicated:" + field);
            }
        }
    }

    @Override
    public List<ProductDto> findAll() {
        return super.findAll();
    }

    public List<ProductDto> findAllByCategory(Long p_idCategory) {
        return super.findByProperty("category", p_idCategory);
    }

    @SuppressWarnings("serial")
    public class ProductInvalid extends Exception {

        public ProductInvalid(String msg) {
            super(msg);
        }
    }

    @SuppressWarnings("serial")
    public class ProductDuplicated extends Exception {

        public ProductDuplicated(String msg) {
            super(msg);
        }
    }
}
