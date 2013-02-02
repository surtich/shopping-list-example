package com.shopping.list;

import com.googlecode.objectify.Key;
import com.shopping.product.ProductManager;
import com.shopping.productList.ProductListDto;
import com.shopping.productList.ProductListManager;
import com.shopping.productList.ProductListManager.ProductListInvalid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class ListManager extends ListFactory {

    private ProductListManager productListManager = new ProductListManager();

    public ListManager() {
        super();
    }

    public void create(ListDto list) throws ListInvalid {
        this.validateList(list);
        super.save(list);
    }

    public void create(ListDto list, ProductListDto[] productsList) throws ListInvalid, ProductListInvalid {
        this.validateList(list);
        super.save(list); //No actualiza la clave idList en los objetos productsList como pasa en JPA. Preguntar si esto se puede hacer ya que sino tenemos que hacer dos grabaciones
        createProducts(list, productsList);
        super.save(list); //Tenemos que volver a grabar porque no disponemos del Id de la lista.
    }

    public ListDto update(long p_id_list, ProductListDto[] productsList, Date date) throws ListInvalid, ProductListInvalid {

        ListDto listDB = super.get(p_id_list);
        if (listDB == null) {
            throw new ListInvalid("app id=" + p_id_list + " not exists");
        }

        listDB.setLastUpdated(date);
        update(listDB, productsList);
        return listDB;
    }

    public ListDto update(ListDto listDB, ProductListDto[] productsList) throws ProductListInvalid {
        if (listDB.getProductsList() != null && listDB.getProductsList().size() > 0) {
            productListManager.deleteByLongIds(listDB.getProductsList()); //Preguntar porque no es suficiente hacer listDB.setList y hay que boorar. ¿La librería no podría dar soporte a esto?
        }
        createProducts(listDB, productsList);
        super.save(listDB);
        return listDB;
    }

    public void deleteList(long p_id_list) throws ListInvalid {

        ListDto listDB = super.get(p_id_list);
        if (listDB == null) {
            throw new ListInvalid("app id=" + p_id_list + " not exists");
        }
        deleteList(listDB);
    }

    public void deleteList(ListDto p_list) {
        if (p_list.getProductsList() != null && p_list.getProductsList().size() > 0) {
            productListManager.deleteByLongIds(p_list.getProductsList());
        }
        super.delete(p_list.getIdList());
    }

    private void validateList(ListDto list) throws ListInvalid {
        if (list.getEmailUser() == null) {
            throw new ListInvalid("required: user email");
        }
    }

    private void createProducts(ListDto list, ProductListDto[] productsList) throws ProductListInvalid {
        Long numPurchased = 0L;
        Map<Key<Object>, ProductListDto> mapProducts = productListManager.create(list.getIdList(), productsList);
        List<Long> idProductsList = new ArrayList<Long>(); //¿Esto no lo podríamos hacer con la librería?
        for (Key<Object> key : mapProducts.keySet()) {
            ProductListDto product = mapProducts.get(key);
            if (product.getPurchased()) {
                numPurchased++;
            }
            idProductsList.add(key.getId());
        }
        list.setNumPurchased(numPurchased);
        list.setProductsList(idProductsList);
    }

    @Override
    public List<ListDto> findAll() {
        return super.findAll();
    }

    public List<ListDto> findAllByUser(String emailUser) {
        return super.findByProperty("emailUser", emailUser, "-lastUpdated");
    }

    @SuppressWarnings("serial")
    public class ListInvalid extends Exception {

        public ListInvalid(String msg) {
            super(msg);
        }
    }

    @SuppressWarnings("serial")
    public class ListDuplicated extends Exception {

        public ListDuplicated(String msg) {
            super(msg);
        }
    }
}
