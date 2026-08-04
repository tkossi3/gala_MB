package com.baobab.gala.repository;

import com.baobab.gala.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    List<Vote> findByVoterId(String voterId);

    Optional<Vote> findByVoterIdAndCategoryId(String voterId, String categoryId);

    Optional<Vote> findByFingerprintAndCategoryId(String fingerprint, String categoryId);

    List<Vote> findByFingerprint(String fingerprint);

    List<Vote> findByCategoryId(String categoryId);
}
