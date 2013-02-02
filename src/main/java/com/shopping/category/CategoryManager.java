package com.shopping.category;

import com.igzcode.java.util.StringUtil;
import java.util.List;

public class CategoryManager extends CategoryFactory {

    public CategoryManager() {
        super();
    }

    public void create(CategoryDto category) throws CategoryInvalid, CategoryDuplicated {
        this.validateCategory(category);
        super.save(category);
    }

    public CategoryDto update(long idCategory, String nameCategory) throws CategoryInvalid, CategoryDuplicated {

        CategoryDto categoryDB = super.get(idCategory);
        if (categoryDB == null) {
            throw new CategoryInvalid("app id=" + idCategory + " not exists");
        }

        categoryDB.setNameCategory(nameCategory);
        this.validateCategory(categoryDB);
        super.save(categoryDB);

        return categoryDB;
    }

    @Override
    public void delete(long p_id_category) {
        super.delete(p_id_category);
    }

    private void validateCategory(CategoryDto category) throws CategoryInvalid, CategoryDuplicated {
        this.checkNullOrDuplicated("nameCategory", category.getNameCategory(), category.getIdCategory());
    }

    private void checkNullOrDuplicated(String field, String value, Long idCategory) throws CategoryInvalid, CategoryDuplicated {
        if (StringUtil.isNullOrEmpty(value)) {
            throw new CategoryInvalid("required:" + field);
        }

        CategoryDto categoryDB = super.getByProperty(field, value);
        if (categoryDB != null) {
            if (idCategory == null || !idCategory.equals(categoryDB.getIdCategory())) {
                throw new CategoryDuplicated("duplicated:" + field);
            }
        }
    }

    @Override
    public List<CategoryDto> findAll() {
        return super.findAll();
    }

    @SuppressWarnings("serial")
    public class CategoryInvalid extends Exception {

        public CategoryInvalid(String msg) {
            super(msg);
        }
    }

    @SuppressWarnings("serial")
    public class CategoryDuplicated extends Exception {

        public CategoryDuplicated(String msg) {
            super(msg);
        }
    }
}
