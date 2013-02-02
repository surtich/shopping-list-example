package com.shopping.category;

import com.igzcode.java.gae.pattern.AbstractFactory;

public class CategoryFactory extends AbstractFactory<CategoryDto> {

    protected CategoryFactory() {
        super(CategoryDto.class);
    }
}
