package com.shopping.productList;

import com.igzcode.java.gae.pattern.AbstractFactory;
import com.shopping.productList.ProductListDto;

public class ProductListFactory extends AbstractFactory<ProductListDto> {

    protected ProductListFactory() {
        super(ProductListDto.class);
    }
}
