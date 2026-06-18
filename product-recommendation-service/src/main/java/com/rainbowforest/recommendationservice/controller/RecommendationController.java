package com.rainbowforest.recommendationservice.controller;

import com.rainbowforest.recommendationservice.feignClient.ProductClient;
import com.rainbowforest.recommendationservice.feignClient.UserClient;
import com.rainbowforest.recommendationservice.feignClient.OrderClient;
import com.rainbowforest.recommendationservice.http.header.HeaderGenerator;
import com.rainbowforest.recommendationservice.model.Product;
import com.rainbowforest.recommendationservice.model.Recommendation;
import com.rainbowforest.recommendationservice.model.User;
import com.rainbowforest.recommendationservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private UserClient userClient;
    
    @Autowired
    private OrderClient orderClient;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping(value = "/recommendations")
    public ResponseEntity<List<Recommendation>> getAllRecommendations(@RequestParam(value = "name", required = false) String productName){
        List<Recommendation> recommendations;
        if (productName != null && !productName.isEmpty()) {
            recommendations = recommendationService.getAllRecommendationByProductName(productName);
        } else {
            recommendations = recommendationService.getAllRecommendations();
        }
        if(recommendations != null && !recommendations.isEmpty()) {
        	return new ResponseEntity<List<Recommendation>>(
        		recommendations,
        		headerGenerator.getHeadersForSuccessGetMethod(),
        		HttpStatus.OK);
        }
        return new ResponseEntity<List<Recommendation>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }
    
    @GetMapping(value = "/recommendations/product/{productId}")
    public ResponseEntity<List<Recommendation>> getRecommendationsByProductId(@PathVariable("productId") Long productId){
        List<Recommendation> recommendations = recommendationService.getAllRecommendationByProductId(productId);
        if(recommendations != null && !recommendations.isEmpty()) {
        	return new ResponseEntity<List<Recommendation>>(
        		recommendations,
        		headerGenerator.getHeadersForSuccessGetMethod(),
        		HttpStatus.OK);
        }
        return new ResponseEntity<List<Recommendation>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }
    
    @PostMapping(value = "/{userId}/recommendations/{productId}")
    public ResponseEntity<?> saveRecommendations(
            @PathVariable ("userId") Long userId,
            @PathVariable ("productId") Long productId,
            @RequestParam (value = "rating", required = false, defaultValue = "0") int rating,
            @RequestParam (value = "comment", required = false) String comment,
            HttpServletRequest request){
    	
		try {
    		Product product = productClient.getProductById(productId);
			User user = userClient.getUserById(userId);
    	
			if(product != null && user != null) {
				Recommendation recommendation = new Recommendation();
				recommendation.setProduct(product);
				recommendation.setUser(user);
				recommendation.setRating(rating);
				if (comment != null) recommendation.setComment(comment);
				recommendationService.saveRecommendation(recommendation);
				return new ResponseEntity<Recommendation>(
						recommendation,
						headerGenerator.getHeadersForSuccessPostMethod(request, recommendation.getId()),
						HttpStatus.CREATED);
			}
        	return new ResponseEntity<String>(
        		"Product or User not found",
        		headerGenerator.getHeadersForError(),
        		HttpStatus.BAD_REQUEST);
		}catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(
					e.toString() + " : " + e.getMessage(),
					headerGenerator.getHeadersForError(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

    @DeleteMapping(value = "/recommendations/{id}")
    public ResponseEntity<Void> deleteRecommendations(@PathVariable("id") Long id){
    	Recommendation recommendation = recommendationService.getRecommendationById(id);
    	if(recommendation != null) {
    		try {
    			recommendationService.deleteRecommendation(id);
    			return new ResponseEntity<Void>(
    					headerGenerator.getHeadersForSuccessGetMethod(),
    					HttpStatus.OK);
    		}catch (Exception e) {
    			e.printStackTrace();
    			return new ResponseEntity<Void>(
    					headerGenerator.getHeadersForError(),
    					HttpStatus.INTERNAL_SERVER_ERROR);	
    		}
    	}
    	return new ResponseEntity<Void>(
    			headerGenerator.getHeadersForError(),
    			HttpStatus.NOT_FOUND);
    }

    @PutMapping(value = "/recommendations/{id}/reply")
    public ResponseEntity<?> replyRecommendation(
            @PathVariable("id") Long id,
            @RequestParam("adminReply") String adminReply,
            HttpServletRequest request) {
        try {
            Recommendation recommendation = recommendationService.replyToRecommendation(id, adminReply);
            if (recommendation != null) {
                return new ResponseEntity<Recommendation>(
                        recommendation,
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            }
            return new ResponseEntity<String>(
                    "Recommendation not found",
                    headerGenerator.getHeadersForError(),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>(
                    e.toString() + " : " + e.getMessage(),
                    headerGenerator.getHeadersForError(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
