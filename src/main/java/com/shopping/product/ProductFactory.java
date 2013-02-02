package com.shopping.product;

import com.igzcode.java.gae.pattern.AbstractFactory;

public class ProductFactory extends AbstractFactory<ProductDto> {

    protected ProductFactory() {
        super(ProductDto.class);
    }
}
