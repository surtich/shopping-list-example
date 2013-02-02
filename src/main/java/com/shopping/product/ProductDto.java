package com.shopping.product;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;
import com.shopping.category.CategoryDto;

@Entity
@Index
public class ProductDto {

    @Id
    private Long idProduct;
    private String nameProduct;
    
    private Long category;

    public ProductDto() {
        
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }

    public String getNameProduct() {
        return nameProduct;
    }

    public void setNameProduct(String nameProduct) {
        this.nameProduct = nameProduct;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long value) {
        this.category = value;
    }
    
    
}
