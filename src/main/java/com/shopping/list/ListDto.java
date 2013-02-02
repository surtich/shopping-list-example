package com.shopping.list;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.shopping.productList.ProductListDto;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Index
public class ListDto {

    @Id
    private Long idList;
    private String emailUser;
    private Date lastUpdated;
    private List<Long> productsList;
    private Long numPurchased;

    public ListDto() {
        List<Long> productsList = new ArrayList<Long>();
    }

    public Long getIdList() {
        return idList;
    }

    public void setIdList(Long idList) {
        this.idList = idList;
    }

    public String getEmailUser() {
        return emailUser;
    }

    public void setEmailUser(String emailUser) {
        this.emailUser = emailUser;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<Long> getProductsList() {
        return productsList;
    }

    public void setProductsList(List<Long> productsList) {
        this.productsList = productsList;
    }

    public Long getNumPurchased() {
        return numPurchased;
    }

    public void setNumPurchased(Long numPurchased) {
        this.numPurchased = numPurchased;
    }
    
}
