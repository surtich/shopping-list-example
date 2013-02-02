package com.shopping.productList;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
@Index
public class ProductListDto {

    @Id
    private Long idProductList;
    private Boolean purchased;
    private Long idList;
    private Long idProduct;
    private Long order;
    
    public ProductListDto() {
        
    }

    public Long getIdProductList() {
        return idProductList;
    }

    public void setIdProductList(Long idProductList) {
        this.idProductList = idProductList;
    }

    public Boolean getPurchased() {
        return purchased;
    }

    public void setPurchased(Boolean purchased) {
        this.purchased = purchased;
    }

    public Long getIdList() {
        return idList;
    }

    public void setIdList(Long idList) {
        this.idList = idList;
    }
    
    public Long getOrder() {
        return order;
    }

    public void setOrder(Long order) {
        this.order = order;
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }
    
    
    
}
