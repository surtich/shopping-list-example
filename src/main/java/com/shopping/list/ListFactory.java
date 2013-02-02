package com.shopping.list;

import com.igzcode.java.gae.pattern.AbstractFactory;

public class ListFactory extends AbstractFactory<ListDto> {

    protected ListFactory() {
        super(ListDto.class);
    }
}
