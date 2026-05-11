package com.rainbowforest.productcatalogservice.controller;
import com.rainbowforest.productcatalogservice.entity.Category;
import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import java.util.ArrayList;
import java.util.List;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTests {

    private static final String PRODUCT_NAME= "test";
    private static final Long PRODUCT_ID = 5L;
    private static final String PRODUCT_CATEGORY = "testCategory";
    private List<Product> products;
    private Product product;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @BeforeEach
    void setUp(){
        Category category = new Category();
        category.setName(PRODUCT_CATEGORY);

        product = new Product();
        product.setId(PRODUCT_ID);
        product.setProductName(PRODUCT_NAME);
        product.setCategory(category);
        products = new ArrayList<Product>();
        products.add(product);

    }

    @Test
    void  get_all_products_controller_should_return200_when_validRequest() throws Exception {
    	//when
    	when(productService.getAllProduct()).thenReturn(products);
//        given(productService.getAllProduct()).willReturn(products);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$[0].id").value(PRODUCT_ID))
                .andExpect(jsonPath("$[0].productName").value(PRODUCT_NAME));

        verify(productService, Mockito.times(1)).getAllProduct();
        verifyNoMoreInteractions(productService);
    }
    
    @Test
    void  get_all_products_controller_should_return404_when_productList_isEmpty() throws Exception {
    	//given
    	List<Product> products = new ArrayList<Product>();
    	
    	//when
    	when(productService.getAllProduct()).thenReturn(products);
    	
    	//then
    	mockMvc.perform(get("/products"))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON_UTF8));

    	verify(productService, Mockito.times(1)).getAllProduct();
    	verifyNoMoreInteractions(productService);
    }
    	
    	
    	
    @Test
    void get_all_product_by_category_controller_should_return200_when_validRequest() throws Exception {
    	//when
        when(productService.getAllProductByCategoryName(PRODUCT_CATEGORY)).thenReturn(products);

        //then
        mockMvc.perform(get("/products").param("category", PRODUCT_CATEGORY))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$[0].id").value(PRODUCT_ID))
                .andExpect(jsonPath("$[0].category.name").value(PRODUCT_CATEGORY));

        verify(productService, times(1)).getAllProductByCategoryName(anyString());
        verifyNoMoreInteractions(productService);
    }

    @Test
    void get_all_product_by_category_controller_should_return404_when_productList_isEmpty() throws Exception {
    	//given
    	List<Product> products = new ArrayList<Product>();
    	
    	//when
    	when(productService.getAllProductByCategoryName(PRODUCT_CATEGORY)).thenReturn(products);
    	
        //then
        mockMvc.perform(get("/products").param("category", PRODUCT_CATEGORY))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON_UTF8));

        verify(productService, times(1)).getAllProductByCategoryName(anyString());
        verifyNoMoreInteractions(productService);
    }
    
    @Test
    void get_one_product_by_id_controller_should_return200_when_validRequest() throws Exception {
    	//when
        when(productService.getProductById(anyLong())).thenReturn(product);
        
        //then
        mockMvc.perform(get("/products/{id}", PRODUCT_ID))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(PRODUCT_ID))
                .andExpect(jsonPath("$.productName").value(PRODUCT_NAME))
                .andExpect(jsonPath("$.category.name").value(PRODUCT_CATEGORY));

        verify(productService, times(1)).getProductById(PRODUCT_ID);
        verifyNoMoreInteractions(productService);
    }
    
    @Test
    void get_one_product_by_id_controller_should_return404_when_product_isNotExist() throws Exception {
    	//when
        when(productService.getProductById(anyLong())).thenReturn(null);
        
        //then
        mockMvc.perform(get("/products/{id}", PRODUCT_ID))
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON_UTF8))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getProductById(PRODUCT_ID);
        verifyNoMoreInteractions(productService);
    }
}
