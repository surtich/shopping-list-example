package com.shopping.category;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
@Index
public class CategoryDto {

    @Id
    private Long idCategory;
    private String nameCategory;

    public CategoryDto() {
        
    }

    public Long getIdCategory() {
        return idCategory;
    }
    
    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public String getNameCategory() {
        return nameCategory;
    }

    public void setNameCategory(String nameCategory) {
        this.nameCategory = nameCategory;
    }
}
