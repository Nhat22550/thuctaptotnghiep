package com.rainbowforest.recommendationservice.service;

import com.rainbowforest.recommendationservice.model.Recommendation;
import com.rainbowforest.recommendationservice.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private com.rainbowforest.recommendationservice.repository.ProductRepository productRepository;

    @Autowired
    private com.rainbowforest.recommendationservice.repository.UserRepository userRepository;

    @Override
    public Recommendation saveRecommendation(Recommendation recommendation) {
        if (recommendation.getProduct() != null) {
            recommendation.setProduct(productRepository.save(recommendation.getProduct()));
        }
        if (recommendation.getUser() != null) {
            recommendation.setUser(userRepository.save(recommendation.getUser()));
        }
        return recommendationRepository.save(recommendation);
    }

    @Override
    public List<Recommendation> getAllRecommendationByProductName(String productName) {
        return recommendationRepository.findAllRatingByProductName(productName);
    }

    @Override
    public List<Recommendation> getAllRecommendationByProductId(Long productId) {
        return recommendationRepository.findAllByProductId(productId);
    }

    @Override
    public List<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    @Override
    public void deleteRecommendation(Long id) {
        recommendationRepository.deleteById(id);
    }

	@Override
	public Recommendation getRecommendationById(Long recommendationId) {
		return recommendationRepository.getOne(recommendationId);
	}

    @Override
    public Recommendation replyToRecommendation(Long id, String adminReply) {
        Recommendation recommendation = recommendationRepository.findById(id).orElse(null);
        if (recommendation != null) {
            recommendation.setAdminReply(adminReply);
            recommendation.setRepliedAt(java.time.LocalDateTime.now());
            return recommendationRepository.save(recommendation);
        }
        return null;
    }
}
